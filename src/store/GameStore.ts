import { create } from "zustand"


type GameStore = {
  gameOver: boolean
  setGameOver: (value: boolean) => void
}

export const useGameStore = create<GameStore>((set) => ({
  gameOver: false,
  setGameOver: (value) => set({ gameOver: value }),
}))