import fastify from "fastify";
import { Server as SocketIOServer } from "socket.io";

const app = fastify();

const io = new SocketIOServer(app.server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let numPlayers = 0;
let playerSkippedTurn = false;
let playerNames = [] as string[];
let playerIds = [] as string[];
let isGameBusy = false;
let currentGames = {} as {
  [key: string]: {
    playerIds: string[];
    playerNames: string[];
  };
};
const history = [] as { player: string; card: string }[];

io.on("connection", (socket) => {
  console.log("A Player with id", socket.id, "connected");
  if (numPlayers < 2) {
    numPlayers++;
    io.to(socket.id).emit("player-connected", {
      firstPlayer: numPlayers === 1,
    });
  }
  if (isGameBusy) {
    io.to(socket.id).emit("game-busy");
  }

  socket.on("skip-turn", (tiles) => {
    if (playerSkippedTurn) {
      io.emit("game-end");
      return;
    }
    playerSkippedTurn = true;
    io.emit("new-turn", { tiles, playerSkippedTurn });
  });

  socket.on("place-card", (tiles) => {
    playerSkippedTurn = false;
    history.push(tiles);
    io.emit("new-turn", { tiles, playerSkippedTurn });
  });

  socket.on("history", () => {
    io.to(socket.id).emit("history", history);
  });

  socket.on("disconnect", () => {
    console.log("A Player with id", socket.id, "disconnected");
    if (playerIds.includes(socket.id)) {
      numPlayers = 0;
      playerNames = [];
      io.emit("game-end", { playerDisconnected: true });
      isGameBusy = false;
      return;
    }
  });

  socket.on("player-name", (data) => {
    if (playerNames.length < 2) {
      playerNames.push(data);
      playerIds.push(socket.id);
      io.to(playerIds).emit("game-start", playerNames);
      isGameBusy = true;
      return;
    }
    if (playerNames.length >= 2) {
      io.to(playerIds).emit("game-busy");
    }
  });

  // rooms

  socket.on(
    "start-game-info",
    (data: { playerName: string; gameId: string }) => {
      currentGames[data.gameId] = {
        playerIds: [socket.id],
        playerNames: [data.playerName],
      };
    }
  );

  socket.on("join-game", (data: { playerName: string; gameId: string }) => {
    currentGames[data.gameId].playerIds.push(socket.id);
    currentGames[data.gameId].playerNames.push(data.playerName);
    io.to(currentGames[data.gameId].playerIds).emit(
      "game-start",
      currentGames[data.gameId].playerNames
    );
    isGameBusy = true;
  });

  socket.on("attempt-to-join-game", (data: { gameId: string }) => {
    if (currentGames[data.gameId].playerIds.length >= 2) {
      io.to(socket.id).emit("game-busy");
      return;
    }

    if (currentGames[data.gameId]) {
      io.to(socket.id).emit("game-found");
      return;
    }
    io.to(socket.id).emit("game-not-found");
  });
});

app.get("/", async () => {
  return { hello: "world" };
});

app.listen({ port: 4000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
