import { create } from "zustand";

export enum Result {
  WIN = "win",
  LOSE = "lose",
  DRAW = "draw",
}

type GameStore = {
  amIP1: boolean;
  setAmIP1: (value: boolean) => void;
  gameOver: boolean;
  setGameOver: (value: boolean) => void;
  gameResult: Result;
  setGameResult: (value: Result) => void;
  playerOneName: string;
  setPlayerOneName: (value: string) => void;
  playerTwoName: string;
  setPlayerTwoName: (value: string) => void;
  playerDisconnected: boolean;
  setPlayerDisconnected: (value: boolean) => void;
  resetStore: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
  amIP1: false,
  setAmIP1: (value) => set({ amIP1: value }),
  gameOver: false,
  setGameOver: (value) => set({ gameOver: value }),
  gameResult: Result.DRAW,
  setGameResult: (value) => set({ gameResult: value }),
  playerOneName: "",
  setPlayerOneName: (value) => set({ playerOneName: value }),
  playerTwoName: "",
  setPlayerTwoName: (value) => set({ playerTwoName: value }),
  playerDisconnected: false,
  setPlayerDisconnected: (value) => set({ playerDisconnected: value }),
  resetStore: () =>
    set({
      gameOver: false,
      amIP1: false,
      gameResult: Result.DRAW,
      playerOneName: "",
      playerTwoName: "",
      playerDisconnected: false,
    }),
}));
