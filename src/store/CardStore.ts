import { create } from 'zustand'
import { CardUnity } from '../@types/Card'

type CardStore = {
  selectedCard: CardUnity | null
  setSelectedCard: (card: CardUnity | null) => void
  resetSelectedCard: () => void
}

const useCardStore = create<CardStore>((set) => ({
  selectedCard: null,
  setSelectedCard: (card) => set({ selectedCard: card }),
  resetSelectedCard: () => set({ selectedCard: null }),
}))

export default useCardStore
