import { z } from "zod";

const playerNameSchema = z.string().min(1).max(30).regex(/^[a-zA-Z0-9 _-]+$/);
const gameIdSchema = z.string().regex(/^\d{6}$/);

export const placeCardSchema = z.object({
  cardId: z.number().int().nonnegative(),
  row: z.number().int().min(0).max(2),
  col: z.number().int().min(0).max(4),
  gameId: gameIdSchema,
});

export const skipTurnSchema = z.object({
  gameId: gameIdSchema,
});

export const createGameSchema = z.object({
  playerName: playerNameSchema,
});

export const joinGameSchema = z.object({
  playerName: playerNameSchema,
  gameId: gameIdSchema,
});

export const attemptToJoinGameSchema = z.object({
  gameId: gameIdSchema,
});

export const rematchRespondSchema = z.object({
  gameId: gameIdSchema,
  response: z.enum(["confirmed", "refused"]),
});

export const readyRespondSchema = z.object({
  gameId: gameIdSchema,
  response: z.enum(["confirmed", "refused"]),
});
