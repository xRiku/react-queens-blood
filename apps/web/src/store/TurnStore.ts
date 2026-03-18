import { create } from "zustand";

type useTurnStore = {
  isMyTurn: boolean;
  toggleTurn: () => void;
  playerSkippedTurn: boolean;
  setPlayerSkippedTurn: (playerSkippedTurn: boolean) => void;
  resetStore: () => void;
};

const useTurnStore = create<useTurnStore>((set) => ({
  isMyTurn: false,
  toggleTurn: () => set((state) => ({ isMyTurn: !state.isMyTurn })),
  playerSkippedTurn: false,
  setPlayerSkippedTurn: (playerSkippedTurn: boolean) =>
    set(() => ({ playerSkippedTurn: playerSkippedTurn })),
  resetStore: () =>
    set({ isMyTurn: false, playerSkippedTurn: false }),
}));

export default useTurnStore;
