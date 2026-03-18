import { create } from 'zustand'
import { Tile } from '../@types/Tile'
import { createInitialBoard } from '@queens-blood/shared'

type BoardStore = {
  board: Tile[][]
  setBoard: (board: Tile[][]) => void
  resetStore: () => void
}

const useBoardStore = create<BoardStore>((set) => ({
  board: createInitialBoard(),
  setBoard: (board) => set({ board }),
  resetStore: () => set({ board: createInitialBoard() }),
}))

export default useBoardStore
