import { useState } from 'react'
import { Tile } from '../@types/Tile'
import { Card } from '../@types/Card'
import useCardStore from '../store/CardStore'
import useBoardStore from '../store/BoardStore'

export default function Board() {
  const selectedCard = useCardStore((state) => state.selectedCard)
  const rows = 3
  const cols = 7
  const tilesElements = new Array(rows)
    .fill(0)
    .map(() => new Array(cols).fill(0))
  const [tiles, setTiles] = useBoardStore((state) => [
    state.board,
    state.setBoard,
  ])
  // const [tiles, setTiles] = useState<Tile[][]>(
  //   matrix.map((value, index) => {
  //     return value.map((value, columnIndex: number) => {
  //       if (columnIndex === 0) {
  //         return {
  //           playerOnePoints: 0,
  //           playerTwoPoints: 0,
  //           playerOnePawns: 1,
  //           playerTwoPawns: 0,
  //         }
  //       }
  //       if (columnIndex === cols - 3) {
  //         return {
  //           playerOnePoints: 0,
  //           playerTwoPoints: 0,
  //           playerOnePawns: 0,
  //           playerTwoPawns: 1,
  //         }
  //       }
  //       return {
  //         playerOnePoints: 0,
  //         playerTwoPoints: 0,
  //         playerOnePawns: 0,
  //         playerTwoPawns: 0,
  //       }
  //     })
  //   }),
  // )
  const playerOnePoints = new Array(3).fill(0)
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

  function mapPawns(
    card: Card,

    rowIndex: number,
    colIndex: number,
  ) {
    // for (let i = 0; i < card.pawnsPositions.length; i++) {
    //   tiles[rowIndex + card.pawnsPositions[i][0]][
    //     colIndex + card.pawnsPositions[i][1]
    //   ] = {
    //     playerOnePoints: card.points,
    //     playerTwoPoints: 0,
    //     playerOnePawns: isPlayerOneTurn
    //       ? position.playerOnePawns - card.pawnsCost
    //       : position.playerOnePawns,
    //     playerTwoPawns: 0,
    //   }
    // }
    const newTiles = [...tiles]
    console.log(newTiles)
    for (let i = 0; i < card.pawnsPositions.length - 1; i++) {
      const newCol = colIndex + card.pawnsPositions[i][0]
      const newRow = rowIndex + card.pawnsPositions[i][1]

      if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols - 2) {
        continue
      }

      newTiles[newRow][newCol] = {
        playerOnePoints: 0,
        playerTwoPoints: 0,
        playerOnePawns: tiles[newRow][newCol].playerOnePawns + 1,
        playerTwoPawns: 0,
      }
    }

    newTiles[rowIndex][colIndex] = {
      playerOnePoints: card.points,
      playerTwoPoints: 0,
      playerOnePawns: 0,
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
      console.log('aa')
      return
    }

    if (!selectedCard) {
      console.log('bb')
      return
    }

    const newTiles = mapPawns(selectedCard, rowIndex, colIndex)

    setTiles(newTiles)
  }

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
          className={`${color} h-60 w-full border-solid border-4 hover:border-4 flex justify-center items-center border-black
           ${canAddCardToPosition(selectedCard, tiles[i][j - 1]) ? 'cursor-pointer  hover:border-green-400' : 'cursor-not-allowed hover:border-red-400'}
           transition duration-300 ease-out`}
          // onMouseEnter={() => canAddCardToPosition(selectedCard, tiles[i][j])}
          onClick={() => handleCellClick(tiles[i][j - 1], i, j - 1)}
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
