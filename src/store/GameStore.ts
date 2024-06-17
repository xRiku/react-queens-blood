import { create } from "zustand"

export enum Result {
  WIN = 'win',
  LOSE = 'lose',
  DRAW = 'draw'
}

type GameStore = {
  gameOver: boolean
  setGameOver: (value: boolean) => void
  gameResult: Result
  setGameResult: (value: Result) => void
  playerOneName: string
  setPlayerOneName: (value: string) => void
  playerTwoName: string
  setPlayerTwoName: (value: string) => void
}

export const useGameStore = create<GameStore>((set) => ({
  gameOver: false,
  setGameOver: (value) => set({ gameOver: value }),
  gameResult: Result.DRAW,
  setGameResult: (value) => set({ gameResult: value }),
  playerOneName: '',
  setPlayerOneName: (value) => set({ playerOneName: value }),
  playerTwoName: '',
  setPlayerTwoName: (value) => set({ playerTwoName: value }),
}))