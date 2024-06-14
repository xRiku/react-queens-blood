import { create } from "zustand";



type useModalStoreType = {
  gameStartModal: boolean;
  toggleGameStartModal: () => void;
  winModal: boolean;
  toggleWinModal: () => void;
  loseModal: boolean;
  toggleLoseModal: () => void;
  P1TurnModal: boolean;
  toggleP1TurnModal: () => void;
  P2TurnModal: boolean;
  toggleP2TurnModal: () => void;
}

export const useModalStore = create<useModalStoreType>((set) => ({
  gameStartModal: false,
  toggleGameStartModal: () => set((state) => ({ gameStartModal: !state.gameStartModal })),
  winModal: false,
  toggleWinModal: () => set((state) => ({ winModal: !state.winModal })),
  loseModal: false,
  toggleLoseModal: () => set((state) => ({ loseModal: !state.loseModal })),
  P1TurnModal: false,
  toggleP1TurnModal: () => set((state) => ({ P1TurnModal: !state.P1TurnModal })),
  P2TurnModal: false,
  toggleP2TurnModal: () => set((state) => ({ P2TurnModal: !state.P2TurnModal })),
}));