import { create } from 'zustand'
import { Tile } from '../@types/Tile'

type BoardStore = {
  board: Tile[][]
  setBoard: (board: Tile[][]) => void
}

const matrix = new Array(3).fill(0).map(() => new Array(5).fill(0))

const useBoardStore = create<BoardStore>((set) => ({
  board: matrix.map((value) => {
    return value.map((_, columnIndex: number) => {
      if (columnIndex === 0) {
        return {
          playerOnePoints: 0,
          playerTwoPoints: 0,
          playerOnePawns: 1,
          playerTwoPawns: 0,
          card: null,
        }
      }
      if (columnIndex === 4) {
        return {
          playerOnePoints: 0,
          playerTwoPoints: 0,
          playerOnePawns: 0,
          playerTwoPawns: 1,
          card: null,
        }
      }
      return {
        playerOnePoints: 0,
        playerTwoPoints: 0,
        playerOnePawns: 0,
        playerTwoPawns: 0,
        card: null,
      }
    })
  }),
  setBoard: (board) => set({ board }),
}))

export default useBoardStore
