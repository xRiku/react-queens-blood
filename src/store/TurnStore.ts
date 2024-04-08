import { create } from 'zustand'

type useTurnStore = {
  isPlayerOneTurn: boolean
  toggleTurn: () => void
}

const useTurnStore = create<useTurnStore>((set) => ({
  isPlayerOneTurn: true,
  toggleTurn: () =>
    set((state) => ({ isPlayerOneTurn: !state.isPlayerOneTurn })),
}))

export default useTurnStore
