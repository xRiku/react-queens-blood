export type CardInfo = {
  name: string
  pawnsPositions: number[][]
  points: number
  pawnsCost: number
  placedByPlayerOne?: boolean
}

export type CardUnity = CardInfo & { id: number }

export type Tile = {
  playerOnePoints: number
  playerTwoPoints: number
  playerOnePawns: number
  playerTwoPawns: number
  card: CardInfo | null
}
