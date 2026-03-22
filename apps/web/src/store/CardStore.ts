import { create } from 'zustand'
import { CardUnity } from '../@types/Card'

type CardStore = {
  selectedCard: CardUnity | null
  setSelectedCard: (card: CardUnity | null) => void
  resetSelectedCard: () => void
  previewTile: [number, number] | null
  setPreviewTile: (tile: [number, number] | null) => void
  resetPreviewTile: () => void
}

const useCardStore = create<CardStore>((set) => ({
  selectedCard: null,
  setSelectedCard: (card) => set({ selectedCard: card, previewTile: null }),
  resetSelectedCard: () => set({ selectedCard: null, previewTile: null }),
  resetStore: () => set({ selectedCard: null, previewTile: null }),
  previewTile: null,
  setPreviewTile: (tile) => set({ previewTile: tile }),
  resetPreviewTile: () => set({ previewTile: null }),
}))

export default useCardStore
