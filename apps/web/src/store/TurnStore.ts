import { create } from "zustand";

type useTurnStore = {
  isMyTurn: boolean;
  isMyFirstTurn: boolean;
  toggleTurn: () => void;
  setIsMyFirstTurn: (value: boolean) => void;
  playerSkippedTurn: boolean;
  setPlayerSkippedTurn: (playerSkippedTurn: boolean) => void;
  resetStore: () => void;
};

const useTurnStore = create<useTurnStore>((set) => ({
  isMyTurn: false,
  isMyFirstTurn: true,
  toggleTurn: () => set((state) => ({ isMyTurn: !state.isMyTurn })),
  setIsMyFirstTurn: (value) => set({ isMyFirstTurn: value }),
  playerSkippedTurn: false,
  setPlayerSkippedTurn: (playerSkippedTurn: boolean) =>
    set(() => ({ playerSkippedTurn: playerSkippedTurn })),
  resetStore: () =>
    set({ isMyTurn: false, isMyFirstTurn: true, playerSkippedTurn: false }),
}));

export default useTurnStore;
