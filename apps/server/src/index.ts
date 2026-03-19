import fastify from "fastify";
import { Server as SocketIOServer } from "socket.io";
import {
  Tile,
  CardInfo,
  CardUnity,
  createInitialBoard,
  canAddCardToPosition,
  mapPawns,
  shuffleDeck,
  drawCards,
  findAllValidMoves,
  deckCards,
} from "@queens-blood/shared";

const app = fastify();

const io = new SocketIOServer(app.server, {
  cors: {
    origin: "*",
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
  isBot: boolean;
  botId: string | null;
  botTimeoutId: ReturnType<typeof setTimeout> | null;
};

let currentGames: Record<string, ServerGameState> = {};

function getPlayerIndex(game: ServerGameState, socketId: string): number {
  return game.playerIds.indexOf(socketId);
}

function isPlayerOne(game: ServerGameState, socketId: string): boolean {
  return getPlayerIndex(game, socketId) === 0;
}

function getOpponentId(game: ServerGameState, socketId: string): string {
  const idx = getPlayerIndex(game, socketId);
  return game.playerIds[idx === 0 ? 1 : 0];
}

function scheduleBotTurn(gameId: string) {
  const game = currentGames[gameId];
  if (!game || !game.isBot || !game.botId) return;
  if (game.currentTurnPlayerId !== game.botId) return;

  const delay = 1000 + Math.random() * 1000; // 1-2s
  game.botTimeoutId = setTimeout(() => executeBotTurn(gameId), delay);
}

function executeBotTurn(gameId: string) {
  const game = currentGames[gameId];
  if (!game || !game.botId) return;

  const botId = game.botId;
  const humanId = game.playerIds[0];
  const botHand = game.hands[botId];
  const isBotP1 = isPlayerOne(game, botId);

  const moves = findAllValidMoves(game.board, botHand, isBotP1);

  if (moves.length === 0) {
    // Bot skips
    if (game.playerSkippedTurn) {
      // Both skipped — game over
      io.to(humanId).emit("game-end");
      return;
    }

    game.playerSkippedTurn = true;
    game.currentTurnPlayerId = humanId;

    // Draw card for human
    const humanDeck = game.decks[humanId];
    let drawnCard: CardUnity | null = null;
    if (humanDeck.length > 0) {
      const result = drawCards(humanDeck, 1, game.cardIdCounter);
      game.decks[humanId] = result.remaining;
      game.cardIdCounter = result.nextId;
      drawnCard = result.drawn[0];
      game.hands[humanId].push(drawnCard);
    }

    io.to(humanId).emit("new-turn", {
      tiles: game.board,
      playerSkippedTurn: game.playerSkippedTurn,
      drawnCard,
    });
    return;
  }

  // Pick a random valid move
  const move = moves[Math.floor(Math.random() * moves.length)];
  const cardIndex = botHand.findIndex((c) => c.id === move.card.id);

  // Apply move
  game.board = mapPawns(game.board, move.card, move.row, move.col, isBotP1);
  botHand.splice(cardIndex, 1);
  game.playerSkippedTurn = false;
  game.currentTurnPlayerId = humanId;

  // Draw card for human
  const humanDeck = game.decks[humanId];
  let drawnCard: CardUnity | null = null;
  if (humanDeck.length > 0) {
    const result = drawCards(humanDeck, 1, game.cardIdCounter);
    game.decks[humanId] = result.remaining;
    game.cardIdCounter = result.nextId;
    drawnCard = result.drawn[0];
    game.hands[humanId].push(drawnCard);
  }

  io.to(humanId).emit("new-turn", {
    tiles: game.board,
    playerSkippedTurn: game.playerSkippedTurn,
    drawnCard,
  });
}

io.on("connection", (socket) => {
  console.log("A Player with id", socket.id, "connected");

  socket.on(
    "place-card",
    (data: { cardId: number; row: number; col: number; gameId: string }) => {
      const game = currentGames[data.gameId];
      if (!game) return;

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
      const cardIndex = hand.findIndex((c) => c.id === data.cardId);
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
      const position = game.board[data.row]?.[data.col];
      if (!position || !canAddCardToPosition(card, position, isP1)) {
        io.to(socket.id).emit("move-rejected", {
          reason: "Invalid placement",
          board: game.board,
          hand: game.hands[socket.id],
        });
        return;
      }

      // Compute new board state
      const newBoard = mapPawns(game.board, card, data.row, data.col, isP1);
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

      // Schedule bot turn if applicable
      scheduleBotTurn(data.gameId);
    }
  );

  socket.on("skip-turn", (data: { gameId: string }) => {
    const game = currentGames[data.gameId];
    if (!game) return;

    // Validate it's this player's turn
    if (game.currentTurnPlayerId !== socket.id) return;

    if (game.playerSkippedTurn) {
      // Both players skipped — game over
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

    // Schedule bot turn if applicable
    scheduleBotTurn(data.gameId);
  });

  socket.on("disconnect", () => {
    console.log("A Player with id", socket.id, "disconnected");
    const gameIdForDcedPlayer = Object.keys(currentGames).find((gameId) =>
      currentGames[gameId].playerIds.includes(socket.id)
    );

    if (gameIdForDcedPlayer) {
      const dcGame = currentGames[gameIdForDcedPlayer];
      if (dcGame.botTimeoutId) clearTimeout(dcGame.botTimeoutId);
      io.to(dcGame.playerIds).emit("game-end", {
        playerDisconnected: true,
      });
      delete currentGames[gameIdForDcedPlayer];
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
        board: createInitialBoard(),
        currentTurnPlayerId: socket.id, // P1 goes first
        decks: {},
        hands: {},
        cardIdCounter: 0,
        isBot: false,
        botId: null,
        botTimeoutId: null,
      };
      io.to(socket.id).emit("player-connected", {
        firstPlayer: true,
      });
    }
  );

  socket.on("join-game", (data: { playerName: string; gameId: string }) => {
    const game = currentGames[data.gameId];
    if (!game) return;

    if (game.playerIds.includes(socket.id)) {
      game.playerNames.push(data.playerName);
      io.to(socket.id).emit("player-connected", {
        firstPlayer: game.playerNames.length === 1,
      });

      // Both players are in — initialize decks and hands
      const p1Id = game.playerIds[0];
      const p2Id = game.playerIds[1];

      // Shuffle separate decks for each player
      game.decks[p1Id] = shuffleDeck([...deckCards]);
      game.decks[p2Id] = shuffleDeck([...deckCards]);

      // Draw initial hands (5 cards each)
      const p1Draw = drawCards(game.decks[p1Id], 5, game.cardIdCounter);
      game.decks[p1Id] = p1Draw.remaining;
      game.hands[p1Id] = p1Draw.drawn;
      game.cardIdCounter = p1Draw.nextId;

      const p2Draw = drawCards(game.decks[p2Id], 5, game.cardIdCounter);
      game.decks[p2Id] = p2Draw.remaining;
      game.hands[p2Id] = p2Draw.drawn;
      game.cardIdCounter = p2Draw.nextId;

      // Send game-start to each player individually with their hand
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
    if (game.playerIds.length >= 2) {
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
      currentGames[data.gameId].playerIds.push(socket.id);
      return;
    }
    io.to(socket.id).emit("game-not-found");
  });

  socket.on(
    "start-bot-game",
    (data: { playerName: string; gameId: string }) => {
      const botId = "bot-" + data.gameId;
      const board = createInitialBoard();

      const game: ServerGameState = {
        playerIds: [socket.id, botId],
        playerNames: [data.playerName, "Bot"],
        playerSkippedTurn: false,
        board,
        currentTurnPlayerId: socket.id, // Human (P1) goes first
        decks: {},
        hands: {},
        cardIdCounter: 0,
        isBot: true,
        botId,
        botTimeoutId: null,
      };

      // Shuffle separate decks for each player
      game.decks[socket.id] = shuffleDeck([...deckCards]);
      game.decks[botId] = shuffleDeck([...deckCards]);

      // Draw initial hands (5 cards each)
      const p1Draw = drawCards(game.decks[socket.id], 5, game.cardIdCounter);
      game.decks[socket.id] = p1Draw.remaining;
      game.hands[socket.id] = p1Draw.drawn;
      game.cardIdCounter = p1Draw.nextId;

      const botDraw = drawCards(game.decks[botId], 5, game.cardIdCounter);
      game.decks[botId] = botDraw.remaining;
      game.hands[botId] = botDraw.drawn;
      game.cardIdCounter = botDraw.nextId;

      currentGames[data.gameId] = game;

      // Send game-start to human player immediately
      io.to(socket.id).emit("game-start", {
        playerNames: game.playerNames,
        initialHand: game.hands[socket.id],
        isPlayerOne: true,
      });
    }
  );
});

app.listen({ port: 4000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
