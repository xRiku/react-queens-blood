import { create } from 'zustand'
import { Card } from '../@types/Card'

type CardStore = {
  selectedCard: Card | null
  setSelectedCard: (card: Card | null) => void
  resetSelectedCard: () => void
}

const useCardStore = create<CardStore>((set) => ({
  selectedCard: null,
  setSelectedCard: (card) => set({ selectedCard: card }),
  resetSelectedCard: () => set({ selectedCard: null }),
}))

export default useCardStore
