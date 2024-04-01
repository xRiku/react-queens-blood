import { create } from 'zustand'

type PointStore = {
  playerOnePoints: number[]
  playerTwoPoints: number[]
  addPlayerOnePoints: (points: number, index: number) => void
  addPlayerTwoPoints: (points: number, index: number) => void
}

export const usePointStore = create<PointStore>((set) => ({
  playerOnePoints: [0, 0, 0],
  playerTwoPoints: [0, 0, 0],
  addPlayerOnePoints: (points, index) =>
    set((state) => ({
      playerOnePoints: state.playerOnePoints.map((point, i) => {
        if (index === i) {
          return points + point
        }
        return point
      }),
    })),
  addPlayerTwoPoints(points, index) {
    set((state) => ({
      playerTwoPoints: state.playerTwoPoints.map((point, i) => {
        if (index === i) {
          return points + point
        }
        return point
      }),
    }))
  },
}))
