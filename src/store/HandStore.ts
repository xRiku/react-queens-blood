import { create } from 'zustand'
import { Deck } from '../utils/deck'
import { CardInfo } from '../@types/Card'

const deck1 = Deck
const deck2 = [...Deck]

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
  playerOneCards: CardInfo[]
  playerTwoCards: CardInfo[]
  placeCard: (card: CardInfo, isPlayerOneTurn: boolean) => void
  drawCard: (isPlayerOneTurn: boolean) => void
}

const useHandStore = create<HandStore>((set) => ({
  playerOneCards: drawInitialHand(deck1),
  playerTwoCards: drawInitialHand(deck2),
  placeCard: (card, isPlayerOneTurn) => {
    if (isPlayerOneTurn) {
      set((state) => ({
        playerOneCards: state.playerOneCards.filter((c) => c !== card),
      }))
      return
    }
    set((state) => ({
      playerTwoCards: state.playerTwoCards.filter((c) => c !== card),
    }))
  },
  drawCard: (isPlayerOneTurn: boolean) => {
    if (isPlayerOneTurn) {
      const randomIndex = Math.floor(Math.random() * deck1.length)
      set((state) => ({
        playerOneCards: [...state.playerOneCards, deck1[randomIndex]],
      }))
      deck1.splice(randomIndex, 1)
    }
  },
}))

export default useHandStore
