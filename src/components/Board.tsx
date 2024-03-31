import { useState } from 'react'

type Card = {
  name: string
  pawnsPositions: number[]
  points: number
  pawnsCost: number
}

type Tile = {
  playerOnePoints: number
  playerTwoPoints: number
  playerOnePawns: number
  playerTwoPawns: number
}

export default function Board() {
  const rows = 3
  const cols = 7
  const tilesElements = new Array(rows)
    .fill(0)
    .map(() => new Array(cols).fill(0))
  const matrix = new Array(rows).fill(0).map(() => new Array(cols - 2).fill(0))
  const [tiles, setTiles] = useState<Tile[][]>(
    matrix.map((value, index) => {
      return value.map((value, columnIndex: number) => {
        if (columnIndex === 0) {
          return {
            playerOnePoints: 0,
            playerTwoPoints: 0,
            playerOnePawns: 1,
            playerTwoPawns: 0,
          }
        }
        if (columnIndex === cols - 3) {
          return {
            playerOnePoints: 0,
            playerTwoPoints: 0,
            playerOnePawns: 0,
            playerTwoPawns: 1,
          }
        }
        return {
          playerOnePoints: 0,
          playerTwoPoints: 0,
          playerOnePawns: 0,
          playerTwoPawns: 0,
        }
      })
    }),
  )
  const playerOnePoints = new Array(3).fill(0)
  const playerTwoPoints = new Array(3).fill(0)
  const [isPlayerOneTurn, setIsPlayerOneTurn] = useState(true)

  console.log(tiles)

  function canAddCardToPosition(
    card: Card,
    playerOnePoints: number[],
    playerTwoPoints: number[],
    position: Tile,
  ) {
    if (isPlayerOneTurn && position.playerOnePawns === 0) {
      return false
    }

    if (!isPlayerOneTurn && position.playerTwoPawns === 0) {
      return false
    }

    if (isPlayerOneTurn && position.playerOnePawns < card.pawnsCost) {
      return false
    }

    if (!isPlayerOneTurn && position.playerTwoPawns < card.pawnsCost) {
      return false
    }

    return true
  }

  // function addCardToBoard(card: Card, playerOnePoints: number[], playerTwoPoints: number[], position: Tile) {
  //   if (canAddCardToPosition(card, playerOnePoints, playerTwoPoints, position)) {
  //     if (isPlayerOneTurn) {

  //     }
  //   }
  // }

  for (let i = 0; i < rows; i++) {
    tilesElements[i][0] = (
      <div
        className={`bg-white h-60 w-full flex items-center justify-center border-solid border-2 border-black`}
        key={`${i}-${0}`}
      >
        <div className="h-28 w-28 border-solid border-4 text-3xl border-green-300 rounded-full flex justify-center items-center">
          {playerOnePoints[i]}
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
          className={`${color} h-60 w-full border-solid border-2 flex justify-center items-center border-black`}
          key={`${i}-${j}`}
        >
          <div className="text-5xl font-bold text-center">
            {tiles[i][j - 1] && '♟'.repeat(tiles[i][j - 1].playerOnePawns)}
            {tiles[i][j - 1] && '♟'.repeat(tiles[i][j - 1].playerTwoPawns)}
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
