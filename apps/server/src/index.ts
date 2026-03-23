import fastify from "fastify";
import helmet from "@fastify/helmet";
import { Server as SocketIOServer, Socket } from "socket.io";
import { z } from "zod";
import {
  Tile,
  CardInfo,
  CardUnity,
  createInitialBoard,
  canAddCardToPosition,
  mapPawns,
  shuffleDeck,
  drawCards,
  deckCards,
} from "@queens-blood/shared";
import {
  placeCardSchema,
  skipTurnSchema,
  createGameSchema,
  joinGameSchema,
  attemptToJoinGameSchema,
  rematchRespondSchema,
  readyRespondSchema,
} from "./schemas";
import { checkRateLimit, cleanupRateLimit } from "./rateLimit";

const isDev = process.env.NODE_ENV !== "production";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const PRODUCTION_ORIGINS = ["https://react-queens-blood.vercel.app"];

const app = fastify();

const io = new SocketIOServer(app.server, {
  cors: {
    origin: [...CORS_ORIGIN.split(","), ...PRODUCTION_ORIGINS],
    methods: ["GET", "POST"],
  },
});

type ServerGameState = {
  playerIds: string[];
  playerNames: string[];
  playerSkippedTurn: boolean;
  board: Tile[][];
  currentTurnPlayerId: string;
  decks: Record<string, CardInfo[]>;
  hands: Record<string, CardUnity[]>;
  cardIdCounter: number;
  rematchStatus: Record<string, "waiting" | "confirmed" | "refused"> | null;
  readyStatus: Record<string, "waiting" | "confirmed" | "refused"> | null;
};

let currentGames: Record<string, ServerGameState> = {};

function getPlayerIndex(game: ServerGameState, socketId: string): number {
  return game.playerIds.indexOf(socketId);
}

function isPlayerOne(game: ServerGameState, socketId: string): boolean {
  return getPlayerIndex(game, socketId) === 0;
}

function generateGameCode(): string {
  let code: string;
  do {
    code = String(Math.floor(100000 + Math.random() * 900000));
  } while (code in currentGames);
  return code;
}

function getOpponentId(game: ServerGameState, socketId: string): string {
  const idx = getPlayerIndex(game, socketId);
  return game.playerIds[idx === 0 ? 1 : 0];
}

function validatePayload<T>(
  socket: Socket,
  schema: z.ZodSchema<T>,
  data: unknown
): T | null {
  const result = schema.safeParse(data);
  if (!result.success) {
    socket.emit("error", { message: "Invalid payload" });
    return null;
  }
  return result.data;
}

function requirePlayer(game: ServerGameState, socketId: string): boolean {
  return game.playerIds.includes(socketId);
}

io.on("connection", (socket) => {
  if (isDev) console.log("A Player with id", socket.id, "connected");

  socket.on("place-card", (data: unknown) => {
    if (!checkRateLimit(socket.id)) return;
    const parsed = validatePayload(socket, placeCardSchema, data);
    if (!parsed) return;

    const game = currentGames[parsed.gameId];
    if (!game) return;
    if (!requirePlayer(game, socket.id)) return;

    // Validate it's this player's turn
    if (game.currentTurnPlayerId !== socket.id) {
      io.to(socket.id).emit("move-rejected", {
        reason: "Not your turn",
        board: game.board,
        hand: game.hands[socket.id],
      });
      return;
    }

    // Find card in player's hand
    const hand = game.hands[socket.id];
    const cardIndex = hand.findIndex((c) => c.id === parsed.cardId);
    if (cardIndex === -1) {
      io.to(socket.id).emit("move-rejected", {
        reason: "Card not in hand",
        board: game.board,
        hand: game.hands[socket.id],
      });
      return;
    }

    const card = hand[cardIndex];
    const isP1 = isPlayerOne(game, socket.id);

    // Validate placement
    const position = game.board[parsed.row]?.[parsed.col];
    if (!position || !canAddCardToPosition(card, position, isP1)) {
      io.to(socket.id).emit("move-rejected", {
        reason: "Invalid placement",
        board: game.board,
        hand: game.hands[socket.id],
      });
      return;
    }

    // Compute new board state
    const newBoard = mapPawns(game.board, card, parsed.row, parsed.col, isP1);
    game.board = newBoard;

    // Remove card from hand
    hand.splice(cardIndex, 1);

    // Reset skip flag
    game.playerSkippedTurn = false;

    // Switch turn to opponent
    const opponentId = getOpponentId(game, socket.id);
    game.currentTurnPlayerId = opponentId;

    // Draw card for opponent
    const opponentDeck = game.decks[opponentId];
    let drawnCard: CardUnity | null = null;
    if (opponentDeck.length > 0) {
      const result = drawCards(opponentDeck, 1, game.cardIdCounter);
      game.decks[opponentId] = result.remaining;
      game.cardIdCounter = result.nextId;
      drawnCard = result.drawn[0];
      game.hands[opponentId].push(drawnCard);
    }

    // Send to the player who placed (no drawn card for them)
    io.to(socket.id).emit("new-turn", {
      tiles: game.board,
      playerSkippedTurn: game.playerSkippedTurn,
      drawnCard: null,
    });

    // Send to opponent (with their drawn card)
    io.to(opponentId).emit("new-turn", {
      tiles: game.board,
      playerSkippedTurn: game.playerSkippedTurn,
      drawnCard,
    });
  });

  socket.on("skip-turn", (data: unknown) => {
    if (!checkRateLimit(socket.id)) return;
    const parsed = validatePayload(socket, skipTurnSchema, data);
    if (!parsed) return;

    const game = currentGames[parsed.gameId];
    if (!game) return;
    if (!requirePlayer(game, socket.id)) return;

    // Validate it's this player's turn
    if (game.currentTurnPlayerId !== socket.id) return;

    if (game.playerSkippedTurn) {
      // Both players skipped — game over
      game.rematchStatus = {
        [game.playerIds[0]]: "waiting",
        [game.playerIds[1]]: "waiting",
      };
      io.to(game.playerIds).emit("game-end");
      return;
    }

    game.playerSkippedTurn = true;

    // Switch turn to opponent
    const opponentId = getOpponentId(game, socket.id);
    game.currentTurnPlayerId = opponentId;

    // Draw card for opponent
    const opponentDeck = game.decks[opponentId];
    let drawnCard: CardUnity | null = null;
    if (opponentDeck.length > 0) {
      const result = drawCards(opponentDeck, 1, game.cardIdCounter);
      game.decks[opponentId] = result.remaining;
      game.cardIdCounter = result.nextId;
      drawnCard = result.drawn[0];
      game.hands[opponentId].push(drawnCard);
    }

    // Send to the player who skipped (no drawn card)
    io.to(socket.id).emit("new-turn", {
      tiles: game.board,
      playerSkippedTurn: game.playerSkippedTurn,
      drawnCard: null,
    });

    // Send to opponent (with their drawn card)
    io.to(opponentId).emit("new-turn", {
      tiles: game.board,
      playerSkippedTurn: game.playerSkippedTurn,
      drawnCard,
    });
  });

  socket.on("disconnect", () => {
    if (isDev) console.log("A Player with id", socket.id, "disconnected");
    cleanupRateLimit(socket.id);

    const gameIdForDcedPlayer = Object.keys(currentGames).find((gameId) =>
      currentGames[gameId].playerIds.includes(socket.id)
    );

    if (gameIdForDcedPlayer) {
      const dcGame = currentGames[gameIdForDcedPlayer];

      if (dcGame.readyStatus) {
        // During ready room — remove disconnected player, keep room open
        const remainingId = dcGame.playerIds.find((id) => id !== socket.id);
        const dcIdx = dcGame.playerIds.indexOf(socket.id);
        dcGame.playerIds.splice(dcIdx, 1);
        dcGame.playerNames.splice(dcIdx, 1);
        dcGame.readyStatus = null;

        if (remainingId) {
          io.to(remainingId).emit("ready-player-left");
        }
        return;
      }

      if (dcGame.rematchStatus) {
        // During rematch phase — mark as refused and notify
        dcGame.rematchStatus[socket.id] = "refused";
        const p1Id = dcGame.playerIds[0];
        const p2Id = dcGame.playerIds[1];
        const remainingId = socket.id === p1Id ? p2Id : p1Id;
        io.to(remainingId).emit("rematch-status-update", {
          playerOneStatus: dcGame.rematchStatus[p1Id],
          playerTwoStatus: dcGame.rematchStatus[p2Id],
        });
        io.to(remainingId).emit("rematch-cancelled");
      } else {
        io.to(dcGame.playerIds).emit("game-end", {
          playerDisconnected: true,
        });
      }

      delete currentGames[gameIdForDcedPlayer];
      return;
    }
  });

  // rooms

  socket.on("create-game", (data: unknown) => {
    if (!checkRateLimit(socket.id)) return;
    const parsed = validatePayload(socket, createGameSchema, data);
    if (!parsed) return;

    const gameId = generateGameCode();
    currentGames[gameId] = {
      playerIds: [socket.id],
      playerNames: [parsed.playerName],
      playerSkippedTurn: false,
      board: createInitialBoard(),
      currentTurnPlayerId: socket.id, // P1 goes first
      decks: {},
      hands: {},
      cardIdCounter: 0,
      rematchStatus: null,
      readyStatus: null,
    };
    io.to(socket.id).emit("game-created", { gameId });
    io.to(socket.id).emit("player-connected", {
      firstPlayer: true,
    });
  });

  socket.on("join-game", (data: unknown) => {
    if (!checkRateLimit(socket.id)) return;
    const parsed = validatePayload(socket, joinGameSchema, data);
    if (!parsed) return;

    const game = currentGames[parsed.gameId];
    if (!game) return;

    if (game.playerIds.includes(socket.id)) {
      game.playerNames.push(parsed.playerName);
      io.to(socket.id).emit("player-connected", {
        firstPlayer: game.playerNames.length === 1,
      });

      // Both players are in — enter ready room
      const p1Id = game.playerIds[0];
      const p2Id = game.playerIds[1];

      game.readyStatus = {
        [p1Id]: "waiting",
        [p2Id]: "waiting",
      };

      io.to(game.playerIds).emit("ready-room", {
        playerNames: game.playerNames,
      });

      return;
    }
    if (game.playerIds.length >= 2) {
      io.to(socket.id).emit("game-busy");
      return;
    }
  });

  socket.on("attempt-to-join-game", (data: unknown) => {
    if (!checkRateLimit(socket.id)) return;
    const parsed = validatePayload(socket, attemptToJoinGameSchema, data);
    if (!parsed) return;

    if (currentGames[parsed.gameId]?.playerIds.length >= 2) {
      io.to(socket.id).emit("game-busy");
      return;
    }

    if (currentGames[parsed.gameId]) {
      io.to(socket.id).emit("game-found", {
        gameIdFound: parsed.gameId,
      });
      currentGames[parsed.gameId].playerIds.push(socket.id);
      return;
    }
    io.to(socket.id).emit("game-not-found");
  });

  socket.on("ready-respond", (data: unknown) => {
    if (!checkRateLimit(socket.id)) return;
    const parsed = validatePayload(socket, readyRespondSchema, data);
    if (!parsed) return;

    const game = currentGames[parsed.gameId];
    if (!game || !game.readyStatus) return;
    if (!requirePlayer(game, socket.id)) return;

    game.readyStatus[socket.id] = parsed.response;

    const p1Id = game.playerIds[0];
    const p2Id = game.playerIds[1];

    // Broadcast status update
    io.to(game.playerIds).emit("ready-status-update", {
      playerOneStatus: game.readyStatus[p1Id],
      playerTwoStatus: game.readyStatus[p2Id],
    });

    // Both confirmed — start the game
    if (
      game.readyStatus[p1Id] === "confirmed" &&
      game.readyStatus[p2Id] === "confirmed"
    ) {
      game.readyStatus = null;
      game.currentTurnPlayerId = p1Id;

      // Shuffle decks and draw initial hands
      game.decks[p1Id] = shuffleDeck([...deckCards]);
      game.decks[p2Id] = shuffleDeck([...deckCards]);

      const p1Draw = drawCards(game.decks[p1Id], 5, game.cardIdCounter);
      game.decks[p1Id] = p1Draw.remaining;
      game.hands[p1Id] = p1Draw.drawn;
      game.cardIdCounter = p1Draw.nextId;

      const p2Draw = drawCards(game.decks[p2Id], 5, game.cardIdCounter);
      game.decks[p2Id] = p2Draw.remaining;
      game.hands[p2Id] = p2Draw.drawn;
      game.cardIdCounter = p2Draw.nextId;

      io.to(p1Id).emit("game-start", {
        playerNames: game.playerNames,
        initialHand: game.hands[p1Id],
        isPlayerOne: true,
      });
      io.to(p2Id).emit("game-start", {
        playerNames: game.playerNames,
        initialHand: game.hands[p2Id],
        isPlayerOne: false,
      });
      return;
    }

    // Either player refused — remove them, keep room open for the other
    if (
      game.readyStatus[p1Id] === "refused" ||
      game.readyStatus[p2Id] === "refused"
    ) {
      const quitterId = game.readyStatus[p1Id] === "refused" ? p1Id : p2Id;
      const remainingId = quitterId === p1Id ? p2Id : p1Id;

      // Remove the quitter
      const quitterIdx = game.playerIds.indexOf(quitterId);
      game.playerIds.splice(quitterIdx, 1);
      game.playerNames.splice(quitterIdx, 1);
      game.readyStatus = null;

      io.to(quitterId).emit("ready-cancelled");
      io.to(remainingId).emit("ready-player-left");
    }
  });

  socket.on("rematch-respond", (data: unknown) => {
    if (!checkRateLimit(socket.id)) return;
    const parsed = validatePayload(socket, rematchRespondSchema, data);
    if (!parsed) return;

    const game = currentGames[parsed.gameId];
    if (!game || !game.rematchStatus) return;
    if (!requirePlayer(game, socket.id)) return;

    game.rematchStatus[socket.id] = parsed.response;

    const p1Id = game.playerIds[0];
    const p2Id = game.playerIds[1];

    // Emit status update to human players
    const statusUpdate = {
      playerOneStatus: game.rematchStatus[p1Id],
      playerTwoStatus: game.rematchStatus[p2Id],
    };

    io.to(game.playerIds).emit("rematch-status-update", statusUpdate);

    // Check if both confirmed
    if (
      game.rematchStatus[p1Id] === "confirmed" &&
      game.rematchStatus[p2Id] === "confirmed"
    ) {
      // Reset game state for rematch
      game.board = createInitialBoard();
      game.playerSkippedTurn = false;
      game.currentTurnPlayerId = p1Id;
      game.cardIdCounter = 0;
      game.rematchStatus = null;

      game.decks[p1Id] = shuffleDeck([...deckCards]);
      game.decks[p2Id] = shuffleDeck([...deckCards]);

      const p1Draw = drawCards(game.decks[p1Id], 5, game.cardIdCounter);
      game.decks[p1Id] = p1Draw.remaining;
      game.hands[p1Id] = p1Draw.drawn;
      game.cardIdCounter = p1Draw.nextId;

      const p2Draw = drawCards(game.decks[p2Id], 5, game.cardIdCounter);
      game.decks[p2Id] = p2Draw.remaining;
      game.hands[p2Id] = p2Draw.drawn;
      game.cardIdCounter = p2Draw.nextId;

      io.to(p1Id).emit("game-start", {
        playerNames: game.playerNames,
        initialHand: game.hands[p1Id],
        isPlayerOne: true,
      });

      io.to(p2Id).emit("game-start", {
        playerNames: game.playerNames,
        initialHand: game.hands[p2Id],
        isPlayerOne: false,
      });
      return;
    }

    // Check if either refused
    if (
      game.rematchStatus[p1Id] === "refused" ||
      game.rematchStatus[p2Id] === "refused"
    ) {
      io.to(game.playerIds).emit("rematch-cancelled");
      delete currentGames[parsed.gameId];
    }
  });
});

async function start() {
  await app.register(helmet, { contentSecurityPolicy: false });

  const PORT = parseInt(process.env.PORT || "4000", 10);
  app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

start();
