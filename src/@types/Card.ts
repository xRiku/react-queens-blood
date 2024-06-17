export type CardInfo = {
  name: string
  pawnsPositions: number[][]
  points: number
  pawnsCost: number
  placedByPlayerOne?: boolean
}

export type CardUnity = CardInfo & {id: number}
