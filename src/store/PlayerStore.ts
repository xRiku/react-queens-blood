import { create } from "zustand"

type PlayerStore = {
  isClientPlayerOne: boolean
  setIsClientPlayerOne: (option: boolean) => void
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  isClientPlayerOne: true,
  setIsClientPlayerOne: (option: boolean) =>
    set((state) => ({ isClientPlayerOne: option }))
}))