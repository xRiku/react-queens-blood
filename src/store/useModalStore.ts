import { create } from "zustand";



type useModalStoreType = {
  gameStartModal: boolean;
  toggleGameStartModal: () => void;
  endGameModal: boolean;
  toggleEndGameModal: () => void;
  turnModal: boolean;
  toggleTurnModal: () => void;
}

export const useModalStore = create<useModalStoreType>((set) => ({
  gameStartModal: false,
  toggleGameStartModal: () => set((state) => ({ gameStartModal: !state.gameStartModal })),
  endGameModal: false,
  toggleEndGameModal: () => set((state) => ({ endGameModal: !state.endGameModal })),
  turnModal: false,
  toggleTurnModal: () => set((state) => ({ turnModal: !state.turnModal })),
}));