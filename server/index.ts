import fastify from "fastify";
import { Server as SocketIOServer } from "socket.io";
import { Tile } from "../src/@types/Tile";

const app = fastify();

const io = new SocketIOServer(app.server, {
  cors: {
    origin: "*",

    methods: ["GET", "POST"],
  },
});
let currentGames = {} as {
  [key: string]: {
    playerIds: string[];
    playerNames: string[];
    playerSkippedTurn: boolean;
  };
};

io.on("connection", (socket) => {
  console.log("A Player with id", socket.id, "connected");

  socket.on("skip-turn", (data: { tiles: Tile[][]; gameId: string }) => {
    if (currentGames[data.gameId].playerSkippedTurn) {
      io.to(currentGames[data.gameId].playerIds).emit("game-end");
      return;
    }
    currentGames[data.gameId].playerSkippedTurn = true;
    io.to(currentGames[data.gameId].playerIds).emit("new-turn", {
      tiles: data.tiles,
      playerSkippedTurn: currentGames[data.gameId].playerSkippedTurn,
    });
  });

  socket.on("place-card", (data: { tiles: Tile[][]; gameId: string }) => {
    currentGames[data.gameId].playerSkippedTurn = false;
    io.to(currentGames[data.gameId].playerIds).emit("new-turn", {
      tiles: data.tiles,
      playerSkippedTurn: currentGames[data.gameId].playerSkippedTurn,
    });
  });

  socket.on("disconnect", () => {
    console.log("A Player with id", socket.id, "disconnected");
    const gameIdForDcedPlayer = Object.keys(currentGames).find((gameId) =>
      currentGames[gameId].playerIds.includes(socket.id)
    );

    if (gameIdForDcedPlayer) {
      io.to(currentGames[gameIdForDcedPlayer].playerIds).emit("game-end", {
        playerDisconnected: true,
      });
      return;
    }
  });

  // rooms

  socket.on(
    "start-game-info",
    (data: { playerName: string; gameId: string }) => {
      currentGames[data.gameId] = {
        playerIds: [socket.id],
        playerNames: [data.playerName],
        playerSkippedTurn: false,
      };
      io.to(socket.id).emit("player-connected", {
        firstPlayer: currentGames[data.gameId].playerNames.length === 1,
      });
    }
  );

  socket.on("join-game", (data: { playerName: string; gameId: string }) => {
    if (currentGames[data.gameId]["playerIds"].includes(socket.id)) {
      currentGames[data.gameId].playerNames.push(data.playerName);
      io.to(socket.id).emit("player-connected", {
        firstPlayer: currentGames[data.gameId].playerNames.length === 1,
      });
      io.to(currentGames[data.gameId].playerIds).emit(
        "game-start",
        currentGames[data.gameId].playerNames
      );
      return;
    }
    if (currentGames[data.gameId]?.playerIds.length >= 2) {
      io.to(socket.id).emit("game-busy");
      return;
    }
  });

  socket.on("attempt-to-join-game", (data: { gameId: string }) => {
    if (currentGames[data.gameId]?.playerIds.length >= 2) {
      io.to(socket.id).emit("game-busy");
      return;
    }

    if (currentGames[data.gameId]) {
      io.to(socket.id).emit("game-found", {
        gameIdFound: data.gameId,
      });
      currentGames[data.gameId]["playerIds"].push(socket.id);
      return;
    }
    io.to(socket.id).emit("game-not-found");
  });
});

app.listen({ port: 4000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
