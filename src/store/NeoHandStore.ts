import { create } from 'zustand'
import { CardInfo, CardUnity } from '../@types/Card'
import { deckCards } from '../utils/deck'


const deck = deckCards

let index = 0

function drawInitialHand(initialDeck: CardInfo[]) {
  const hand: CardUnity[] = []

  for (; index < 5; index++) {
    const randomIndex = Math.floor(Math.random() * initialDeck.length)
    hand.push({...initialDeck[randomIndex], id: index})
    initialDeck.splice(randomIndex, 1)
  }

  
  return hand
}

type HandStore = {
  playerCards: CardUnity[]
  placeCard: (card: CardUnity) => void
  drawCard: () => void
  drawInitialHand: () => void
  resetStore: () => void
}

const useNeoHandStore = create<HandStore>((set) => ({
  playerCards: [] as CardUnity[],
  placeCard: (card) => {
      set((state) => ({
        playerCards: state.playerCards.filter((c) => c.id !== card.id),
      }))
      return
  },
  drawCard: () => {
    const randomIndex = Math.floor(Math.random() * deck.length)
    set((state) => ({
      playerCards: [...state.playerCards, {...deck[randomIndex], id: index++}],
    }))
    deck.splice(randomIndex, 1)
  },
  drawInitialHand: () => set({ playerCards: drawInitialHand(deck) }),
  resetStore: () => set({ playerCards: drawInitialHand(deck) }),
}))

export default useNeoHandStore
