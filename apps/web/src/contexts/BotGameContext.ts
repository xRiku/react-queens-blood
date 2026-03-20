import { createContext, useContext } from "react";

export type BotGameActions = {
  placeCard: (cardId: number, row: number, col: number) => void;
  skipTurn: () => void;
  rematchRespond: (response: "confirmed" | "refused") => void;
};

export const BotGameContext = createContext<BotGameActions | null>(null);

export function useBotGameActions() {
  return useContext(BotGameContext);
}
