import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { allCards, deckCards } from '@queens-blood/shared'
import type { CardInfo } from '@queens-blood/shared'

type DeckStoreType = {
  deck: CardInfo[]
  addCard: (card: CardInfo) => void
  removeCard: (cardName: string) => void
  clearDeck: () => void
}

const availableCardNames = new Set(allCards.map(card => card.name))

function sanitizeDeck(deck: CardInfo[]) {
  return deck.filter(card => availableCardNames.has(card.name))
}

const useDeckStore = create<DeckStoreType>()(
  persist(
    (set, get) => ({
      deck: sanitizeDeck([...deckCards]),

      addCard: (card) => {
        if (!availableCardNames.has(card.name)) return
        const { deck } = get()
        if (deck.length >= 15) return
        const count = deck.filter(c => c.name === card.name).length
        if (count >= 2) return
        set({ deck: [...deck, card] })
      },

      removeCard: (cardName: string) => {
        const { deck } = get()
        let index = -1
        for (let i = deck.length - 1; i >= 0; i--) {
          if (deck[i].name === cardName) { index = i; break }
        }
        if (index === -1) return
        const newDeck = [...deck]
        newDeck.splice(index, 1)
        set({ deck: newDeck })
      },

      clearDeck: () => set({ deck: [] }),
    }),
    {
      name: 'queens-blood-deck',
      merge: (persistedState, currentState) => {
        const persistedDeck = (persistedState as Partial<DeckStoreType> | undefined)
          ?.deck

        return {
          ...currentState,
          ...(persistedState as Partial<DeckStoreType> | undefined),
          deck: sanitizeDeck(persistedDeck ?? currentState.deck),
        }
      },
    },
  ),
)

export default useDeckStore
