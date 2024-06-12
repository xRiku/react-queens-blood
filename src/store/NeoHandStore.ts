import { create } from 'zustand'
import { CardInfo } from '../@types/Card'
import { deckCards } from '../utils/deck'


const deck = deckCards

console.log(deck)

let index = 0

type Hand = CardInfo & {id: number}

function drawInitialHand(initialDeck: CardInfo[]) {
  const hand: Hand[] = []

  for (; index < 4; index++) {
    const randomIndex = Math.floor(Math.random() * initialDeck.length)
    hand.push({...initialDeck[randomIndex], id: index})
    initialDeck.splice(randomIndex, 1)
  }

  
  return hand
}

type HandStore = {
  playerCards: Hand[]
  placeCard: (card: Hand) => void
  drawCard: () => void
}

const useNeoHandStore = create<HandStore>((set) => ({
  playerCards: drawInitialHand(deck),
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
}))

export default useNeoHandStore
