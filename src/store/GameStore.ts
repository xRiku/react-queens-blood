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
  playerDisconnected: boolean
  setPlayerDisconnected: (value: boolean) => void
  resetStore: () => void
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
  playerDisconnected: false,
  setPlayerDisconnected: (value) => set({ playerDisconnected: value }),
  resetStore: () => set({ gameOver: false, gameResult: Result.DRAW, playerOneName: '', playerTwoName: '', playerDisconnected: false })
}))