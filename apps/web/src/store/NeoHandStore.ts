import { create } from "zustand";
import { CardInfo, CardUnity } from "../@types/Card";
import { deckCards } from "../utils/deck";

let index = 0;

function drawInitialHand(initialDeck: CardInfo[]) {
  const hand: CardUnity[] = [];

  for (; index < 5; index++) {
    const randomIndex = Math.floor(Math.random() * initialDeck.length);
    hand.push({ ...initialDeck[randomIndex], id: index });
    initialDeck.splice(randomIndex, 1);
  }

  return hand;
}

type HandStore = {
  deck: CardInfo[];
  playerCards: CardUnity[];
  placeCard: (card: CardUnity) => void;
  drawCard: () => void;
  drawInitialHand: () => void;
  resetStore: () => void;
};

const useNeoHandStore = create<HandStore>((set) => ({
  deck: [...deckCards],
  playerCards: [] as CardUnity[],
  placeCard: (card) => {
    set((state) => ({
      playerCards: state.playerCards.filter((c) => c.id !== card.id),
    }));
    return;
  },
  drawCard: () => {
    set((state) => {
      const randomIndex = Math.floor(Math.random() * state.deck.length);
      const [drawnCard] = state.deck.splice(randomIndex, 1);
      return {
        playerCards: [...state.playerCards, { ...drawnCard, id: index++ }],
      };
    });
  },
  drawInitialHand: () =>
    set((state) => ({ playerCards: drawInitialHand(state.deck) })),
  resetStore: () => {
    index = 0;
    return set({ playerCards: [] as CardUnity[], deck: [...deckCards] });
  },
}));

export default useNeoHandStore;
