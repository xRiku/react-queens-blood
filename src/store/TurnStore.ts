import { create } from 'zustand'

type useTurnStore = {
  isMyTurn: boolean
  isMyFirstTurn: boolean
  toggleTurn: () => void
  setIsMyFirstTurn: (value: boolean) => void
  resetStore: () => void
}

const useTurnStore = create<useTurnStore>((set) => ({
  isMyTurn: false,
  isMyFirstTurn: true,
  toggleTurn: () =>
    set((state) => ({ isMyTurn: !state.isMyTurn })),
  setIsMyFirstTurn: (value) => set({ isMyFirstTurn: value }),
  resetStore: () => set({ isMyTurn: false, isMyFirstTurn: true}),
}))

export default useTurnStore
