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
const history = [] as { player: string; card: string }[];

io.on("connection", (socket) => {
  console.log("A Player with id", socket.id, "connected");
  numPlayers++;
  io.to(socket.id).emit("player-connected", { firstPlayer: numPlayers === 1 });

  socket.on("skip-turn", (data) => {
    if (playerSkippedTurn) {
      io.emit("game-end");
      return;
    }
    playerSkippedTurn = true;
    io.emit("new-turn", data);
  });

  socket.on("place-card", (data) => {
    playerSkippedTurn = false;
    history.push(data);
    io.emit("new-turn", data);
  });

  socket.on("history", () => {
    io.to(socket.id).emit("history", history);
  });

  socket.on("disconnect", () => {
    console.log("A Player with id", socket.id, "disconnected");
    numPlayers--;
    playerNames.pop();
    io.emit("game-end", { playerDisconnected: true });
  });

  socket.on("player-name", (data) => {
    playerNames.push(data);
    if (playerNames.length === 2) {
      io.emit("game-start", playerNames);
    }
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
