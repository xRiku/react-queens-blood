import { create } from "zustand";

type useTurnStore = {
  isMyTurn: boolean;
  isMyFirstTurn: boolean;
  toggleTurn: () => void;
  setIsMyFirstTurn: (value: boolean) => void;
  playerSkippedTurn: boolean;
  togglePlayerSkippedTurn: () => void;
  resetStore: () => void;
};

const useTurnStore = create<useTurnStore>((set) => ({
  isMyTurn: false,
  isMyFirstTurn: true,
  toggleTurn: () => set((state) => ({ isMyTurn: !state.isMyTurn })),
  setIsMyFirstTurn: (value) => set({ isMyFirstTurn: value }),
  playerSkippedTurn: false,
  togglePlayerSkippedTurn: () =>
    set((state) => ({ playerSkippedTurn: !state.playerSkippedTurn })),
  resetStore: () => set({ isMyTurn: false, isMyFirstTurn: true }),
}));

export default useTurnStore;
