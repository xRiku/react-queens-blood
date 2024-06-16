import { create } from 'zustand'

type useTurnStore = {
  isMyTurn: boolean
  toggleTurn: () => void
}

const useTurnStore = create<useTurnStore>((set) => ({
  isMyTurn: false,
  toggleTurn: () =>
    set((state) => ({ isMyTurn: !state.isMyTurn })),
}))

export default useTurnStore
