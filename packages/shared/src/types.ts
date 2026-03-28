export type CardEffect = {
  value: number
  target: 'ally' | 'enemy'
}

export type CardInfo = {
  name: string
  pawnsPositions: number[][]
  points: number
  pawnsCost: number
  description: string
  placedByPlayerOne?: boolean
  effect?: CardEffect
  effectPositions?: number[][]
}

export type CardUnity = CardInfo & { id: number }

export type Tile = {
  playerOnePoints: number
  playerTwoPoints: number
  playerOnePawns: number
  playerTwoPawns: number
  card: CardInfo | null
}
