import type { CardInfo, CardUnity, Tile } from './types'

const BOARD_ROWS = 3
const BOARD_COLS = 5

export function createInitialBoard(): Tile[][] {
  return Array.from({ length: BOARD_ROWS }, () =>
    Array.from({ length: BOARD_COLS }, (_, colIndex) => ({
      playerOnePoints: 0,
      playerTwoPoints: 0,
      playerOnePawns: colIndex === 0 ? 1 : 0,
      playerTwoPawns: colIndex === BOARD_COLS - 1 ? 1 : 0,
      card: null,
    }))
  )
}

export function canAddCardToPosition(
  card: CardInfo | null,
  position: Tile,
  isPlayerOne: boolean
): boolean {
  if (!card) return false

  const pawns = isPlayerOne ? position.playerOnePawns : position.playerTwoPawns
  if (pawns <= 0) return false
  if (pawns < card.pawnsCost) return false

  return true
}

function deepCopyBoard(board: Tile[][]): Tile[][] {
  return board.map(row => row.map(tile => ({ ...tile })))
}

export function mapPawns(
  board: Tile[][],
  card: CardInfo,
  rowIndex: number,
  colIndex: number,
  isPlayerOne: boolean
): Tile[][] {
  const newTiles = deepCopyBoard(board)
  const correctColIndex = colIndex
  const transformedRowIndex = correctColIndex
  const transformedColIndex = -rowIndex

  for (let i = 0; i < card.pawnsPositions.length; i++) {
    const newRow = -(transformedColIndex + card.pawnsPositions[i][1])
    const newCol = isPlayerOne
      ? transformedRowIndex + card.pawnsPositions[i][0]
      : Math.abs(-transformedRowIndex + card.pawnsPositions[i][0])

    if (newRow < 0 || newRow >= BOARD_ROWS || newCol < 0 || newCol >= BOARD_COLS) {
      continue
    }

    if (isPlayerOne) {
      newTiles[newRow][newCol] = {
        playerOnePoints:
          newTiles[newRow][newCol].playerOnePawns === -1
            ? newTiles[newRow][newCol].playerOnePoints
            : 0,
        playerTwoPoints:
          newTiles[newRow][newCol].playerTwoPawns === -1
            ? newTiles[newRow][newCol].playerTwoPoints
            : 0,
        playerOnePawns:
          newTiles[newRow][newCol].playerOnePawns !== -1 &&
            newTiles[newRow][newCol].playerOnePawns < 3
            ? newTiles[newRow][newCol].playerTwoPawns !== 0
              ? newTiles[newRow][newCol].playerTwoPawns
              : newTiles[newRow][newCol].playerOnePawns + 1
            : newTiles[newRow][newCol].playerOnePawns,
        playerTwoPawns: 0,
        card:
          newTiles[newRow][newCol].playerOnePawns === -1
            ? newTiles[newRow][newCol].card
            : newTiles[newRow][newCol].playerTwoPawns === -1
              ? newTiles[newRow][newCol].card
              : null,
      }
      continue
    }

    newTiles[newRow][newCol] = {
      playerOnePoints:
        newTiles[newRow][newCol].playerOnePawns === -1
          ? newTiles[newRow][newCol].playerOnePoints
          : 0,
      playerTwoPoints:
        newTiles[newRow][newCol].playerTwoPawns === -1
          ? newTiles[newRow][newCol].playerTwoPoints
          : 0,
      playerOnePawns: 0,
      playerTwoPawns:
        newTiles[newRow][newCol].playerTwoPawns !== -1 &&
          newTiles[newRow][newCol].playerTwoPawns < 3
          ? newTiles[newRow][newCol].playerOnePawns !== 0
            ? newTiles[newRow][newCol].playerOnePawns
            : newTiles[newRow][newCol].playerTwoPawns + 1
          : newTiles[newRow][newCol].playerTwoPawns,
      card:
        newTiles[newRow][newCol].playerOnePawns === -1
          ? newTiles[newRow][newCol].card
          : newTiles[newRow][newCol].playerTwoPawns === -1
            ? newTiles[newRow][newCol].card
            : null,
    }
  }

  if (isPlayerOne) {
    newTiles[rowIndex][correctColIndex] = {
      playerOnePoints: card.points,
      playerTwoPoints: 0,
      playerOnePawns: -1,
      playerTwoPawns: -1,
      card: { ...card, placedByPlayerOne: true },
    }
  } else {
    newTiles[rowIndex][correctColIndex] = {
      playerOnePoints: 0,
      playerTwoPoints: card.points,
      playerOnePawns: -1,
      playerTwoPawns: -1,
      card: { ...card, placedByPlayerOne: false },
    }
  }

  applyCardEffects(newTiles, card, rowIndex, correctColIndex, isPlayerOne)

  return newTiles
}

const ADJACENT_OFFSETS = [[0, 1], [0, -1], [1, 0], [-1, 0]] as const

function applyCardEffects(
  board: Tile[][],
  card: CardInfo,
  rowIndex: number,
  colIndex: number,
  isPlayerOne: boolean
): void {
  if (!card.effect) return

  for (const [dr, dc] of ADJACENT_OFFSETS) {
    const r = rowIndex + dr
    const c = colIndex + dc
    if (r < 0 || r >= BOARD_ROWS || c < 0 || c >= BOARD_COLS) continue

    const tile = board[r][c]
    if (!tile.card) continue

    const isAlliedCard = tile.card.placedByPlayerOne === isPlayerOne

    if (card.effect.target === 'ally' && isAlliedCard) {
      if (isPlayerOne) {
        tile.playerOnePoints = Math.max(0, tile.playerOnePoints + card.effect.value)
      } else {
        tile.playerTwoPoints = Math.max(0, tile.playerTwoPoints + card.effect.value)
      }
    } else if (card.effect.target === 'enemy' && !isAlliedCard) {
      if (isPlayerOne) {
        tile.playerTwoPoints = Math.max(0, tile.playerTwoPoints + card.effect.value)
      } else {
        tile.playerOnePoints = Math.max(0, tile.playerOnePoints + card.effect.value)
      }
    }
  }
}

export function findAllValidMoves(
  board: Tile[][],
  hand: CardUnity[],
  isPlayerOne: boolean
): { card: CardUnity; row: number; col: number }[] {
  const moves: { card: CardUnity; row: number; col: number }[] = []
  for (const card of hand) {
    for (let row = 0; row < BOARD_ROWS; row++) {
      for (let col = 0; col < BOARD_COLS; col++) {
        if (canAddCardToPosition(card, board[row][col], isPlayerOne)) {
          moves.push({ card, row, col })
        }
      }
    }
  }
  return moves
}

export function shuffleDeck(deck: CardInfo[]): CardInfo[] {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function drawCards(
  deck: CardInfo[],
  count: number,
  startId: number
): { drawn: CardUnity[]; remaining: CardInfo[]; nextId: number } {
  const remaining = [...deck]
  const drawn: CardUnity[] = []
  let id = startId

  for (let i = 0; i < count && remaining.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * remaining.length)
    const [card] = remaining.splice(randomIndex, 1)
    drawn.push({ ...card, id: id++ })
  }

  return { drawn, remaining, nextId: id }
}
