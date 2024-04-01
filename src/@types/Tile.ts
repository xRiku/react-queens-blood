import { CardInfo } from './Card'

export type Tile = {
  playerOnePoints: number
  playerTwoPoints: number
  playerOnePawns: number
  playerTwoPawns: number
  card: CardInfo | null
}
