import { create } from 'zustand'
import { CardUnity } from '../@types/Card'

type HandStore = {
  playerCards: CardUnity[];
  placeCard: (card: CardUnity) => void;
  setHand: (cards: CardUnity[]) => void;
  addCard: (card: CardUnity) => void;
  resetStore: () => void;
}

const useNeoHandStore = create<HandStore>((set) => ({
  playerCards: [] as CardUnity[],
  placeCard: (card) => {
    set((state) => ({
      playerCards: state.playerCards.filter((c) => c.id !== card.id),
    }))
  },
  setHand: (cards) => set({ playerCards: cards }),
  addCard: (card) =>
    set((state) => ({
      playerCards: [...state.playerCards, card],
    })),
  resetStore: () => set({ playerCards: [] as CardUnity[] }),
}))

export default useNeoHandStore
