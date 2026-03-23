import { create } from 'zustand'
import turnSound from '../assets/sounds/turn.mp3'
import { playSound } from './SoundStore'
const turnAudio = new Audio(turnSound)

type useModalStoreType = {
  gameStartModal: boolean;
  toggleGameStartModal: () => void;
  endGameModal: boolean;
  toggleEndGameModal: () => void;
  turnModal: boolean;
  toggleTurnModal: () => void;
  rematchDialog: boolean;
  showRematchDialog: () => void;
  hideRematchDialog: () => void;
  readyRoom: boolean;
  showReadyRoom: () => void;
  hideReadyRoom: () => void;
  resetStore: () => void;
}

export const useModalStore = create<useModalStoreType>((set) => ({
  gameStartModal: false,
  toggleGameStartModal: () => {
    return set((state) => ({ gameStartModal: !state.gameStartModal }))
  },
  endGameModal: false,
  toggleEndGameModal: () =>
    set((state) => ({ endGameModal: !state.endGameModal })),
  turnModal: false,
  toggleTurnModal: () => {
    return set((state) => {
      if (!state.turnModal) {
        playSound(turnAudio, 0.4)
      }
      return { turnModal: !state.turnModal }
    })
  },
  rematchDialog: false,
  showRematchDialog: () => set({ rematchDialog: true }),
  hideRematchDialog: () => set({ rematchDialog: false }),
  readyRoom: false,
  showReadyRoom: () => set({ readyRoom: true }),
  hideReadyRoom: () => set({ readyRoom: false }),
  resetStore: () =>
    set({ gameStartModal: false, endGameModal: false, turnModal: false, rematchDialog: false, readyRoom: false }),
}))
