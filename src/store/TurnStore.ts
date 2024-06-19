import { create } from 'zustand'

type useTurnStore = {
  isMyTurn: boolean
  toggleTurn: () => void
  resetStore: () => void
}

const useTurnStore = create<useTurnStore>((set) => ({
  isMyTurn: false,
  toggleTurn: () =>
    set((state) => ({ isMyTurn: !state.isMyTurn })),
  resetStore: () => set({ isMyTurn: false }),
}))

export default useTurnStore
