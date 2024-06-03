import { create } from 'zustand'
import { CardInfo } from '../@types/Card'
import { deckCards } from '../utils/deck'


const deck = deckCards

console.log(deck)

function drawInitialHand(initialDeck: CardInfo[]) {
  const hand: CardInfo[] = []

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * initialDeck.length)
    hand.push(initialDeck[randomIndex])
    initialDeck.splice(randomIndex, 1)
  }

  
  return hand
}

type HandStore = {
  playerCards: CardInfo[]
  placeCard: (card: CardInfo, isMyTurn: boolean) => void
  drawCard: (isPlayerOneTurn: boolean) => void
}

const useNeoHandStore = create<HandStore>((set) => ({
  playerCards: drawInitialHand(deck),
  placeCard: (card, isMyTurn) => {
    if (isMyTurn) {
      set((state) => ({
        playerCards: state.playerCards.filter((c) => c !== card),
      }))
      return
    }
  },
  drawCard: (isMyTurn) => {
    if (isMyTurn) {
      const randomIndex = Math.floor(Math.random() * deck.length)
      set((state) => ({
        playerCards: [...state.playerCards, deck[randomIndex]],
      }))
      deck.splice(randomIndex, 1)
    }
  },
}))

export default useNeoHandStore
