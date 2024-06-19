import { create } from 'zustand'
import { Tile } from '../@types/Tile'

type PointStore = {
  playerOnePoints: number[]
  playerTwoPoints: number[]
  setPoints: (data: Tile[][]) => void
  resetStore: () => void
}

export const usePointStore = create<PointStore>((set) => ({
  playerOnePoints: [0, 0, 0],
  playerTwoPoints: [0, 0, 0],

  setPoints: (data: Tile[][]) => {
    let newPlayerOnePoints = [0, 0, 0]
    let newPlayerTwoPoints = [0, 0, 0]
    data.forEach((row, index) => {
      newPlayerOnePoints[index] = data[index]
      .map((tile) => tile.playerOnePoints)
      .reduce((acc, curr) => acc + curr, 0)
    newPlayerTwoPoints[index] = data[index]
      .map((tile) => tile.playerTwoPoints)
      .reduce((acc, curr) => acc + curr, 0)
    })

    set({
      playerOnePoints: newPlayerOnePoints,
      playerTwoPoints: newPlayerTwoPoints,
    })
  },
  resetStore: () => set({ playerOnePoints: [0, 0, 0], playerTwoPoints: [0, 0, 0] }),
}))
