import { useState } from 'react'
import { Tile } from '../@types/Tile'
import { Card } from '../@types/Card'
import useCardStore from '../store/CardStore'
import useBoardStore from '../store/BoardStore'

export default function Board() {
  const [selectedCard, resetSelectedCard] = useCardStore((state) => [
    state.selectedCard,
    state.resetSelectedCard,
  ])
  const rows = 3
  const cols = 7
  const tilesElements = new Array(rows)
    .fill(0)
    .map(() => new Array(cols).fill(0))
  const [tiles, setTiles] = useBoardStore((state) => [
    state.board,
    state.setBoard,
  ])

  const playerTwoPoints = new Array(3).fill(0)
  const [isPlayerOneTurn, setIsPlayerOneTurn] = useState(true)

  console.log(tiles)

  function canAddCardToPosition(card: Card | null, position: Tile) {
    if (!card) {
      return false
    }

    if (isPlayerOneTurn && position?.playerOnePawns === 0) {
      return false
    }

    if (!isPlayerOneTurn && position?.playerTwoPawns === 0) {
      return false
    }

    if (isPlayerOneTurn && position?.playerOnePawns < card.pawnsCost) {
      return false
    }

    if (!isPlayerOneTurn && position?.playerTwoPawns < card.pawnsCost) {
      return false
    }

    return true
  }

  function mapPawns(card: Card, rowIndex: number, colIndex: number) {
    const transformedRowIndex = colIndex
    const transformedColIndex = -rowIndex
    const newTiles = [...tiles]
    for (let i = 0; i < card.pawnsPositions.length; i++) {
      const newRow = -(transformedColIndex + card.pawnsPositions[i][1])
      const newCol = transformedRowIndex + card.pawnsPositions[i][0]

      if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols - 2) {
        continue
      }

      newTiles[newRow][newCol] = {
        playerOnePoints:
          tiles[newRow][newCol].playerOnePawns === -1
            ? tiles[newRow][newCol].playerOnePoints
            : 0,
        playerTwoPoints: 0,
        playerOnePawns:
          tiles[newRow][newCol].playerOnePawns !== -1 &&
          tiles[newRow][newCol].playerOnePawns < 3
            ? tiles[newRow][newCol].playerOnePawns + 1
            : tiles[newRow][newCol].playerOnePawns,
        playerTwoPawns: 0,
      }
    }

    newTiles[rowIndex][colIndex] = {
      playerOnePoints: card.points,
      playerTwoPoints: 0,
      playerOnePawns: -1,
      playerTwoPawns: 0,
    }

    return newTiles
  }

  const handleCellClick = (
    position: Tile,
    rowIndex: number,
    colIndex: number,
  ) => {
    if (!canAddCardToPosition(selectedCard, position)) {
      return
    }

    if (!selectedCard) {
      return
    }

    const newTiles = mapPawns(selectedCard, rowIndex, colIndex)

    setTiles(newTiles)
    resetSelectedCard()
  }

  for (let i = 0; i < rows; i++) {
    const playerOnePoints = tiles[i]
      .map((tile) => tile.playerOnePoints)
      .reduce((acc, curr) => acc + curr, 0)
    tilesElements[i][0] = (
      <div
        className={`bg-white h-60 w-full flex items-center justify-center border-solid border-2 border-black`}
        key={`${i}-${0}`}
      >
        <div className="h-28 w-28 border-solid border-4 text-3xl border-green-300 rounded-full flex justify-center items-center">
          {playerOnePoints}
        </div>
      </div>
    )
    tilesElements[i][cols - 1] = (
      <div
        className={`bg-white h-60 w-full flex items-center justify-center border-solid border-2 border-black`}
        key={`${i}-${cols - 1}`}
      >
        <div className="h-28 w-28 border-solid border-4 text-3xl border-red-300 rounded-full flex justify-center items-center">
          {playerTwoPoints[i]}
        </div>
      </div>
    )
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 1; j < cols - 1; j++) {
      const color = (i + j) % 2 === 0 ? 'bg-white' : 'bg-black'
      tilesElements[i][j] = (
        <div
          className={`${color} h-60 w-full border-solid border-4 hover:border-4 flex justify-center items-center border-black
           ${canAddCardToPosition(selectedCard, tiles[i][j - 1]) ? 'cursor-pointer  hover:border-green-400' : 'cursor-not-allowed hover:border-red-400'}
           transition duration-300 ease-out`}
          onClick={() => handleCellClick(tiles[i][j - 1], i, j - 1)}
          key={`${i}-${j}`}
        >
          <div className="text-5xl font-bold text-center">
            {tiles[i][j - 1] &&
              tiles[i][j - 1].playerOnePawns >= 0 &&
              '♟'.repeat(tiles[i][j - 1].playerOnePawns)}
            {tiles[i][j - 1] &&
              tiles[i][j - 1].playerTwoPawns >= 0 &&
              '♟'.repeat(tiles[i][j - 1].playerTwoPawns)}
          </div>
        </div>
      )
    }
  }
  return (
    <div className="flex w-full items-center justify-center mt-10">
      <div className="grid grid-cols-7 gap-1 w-10/12">{tilesElements}</div>
    </div>
  )
}
