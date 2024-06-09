import { Tile } from '../@types/Tile'
import { CardInfo } from '../@types/Card'
import useCardStore from '../store/CardStore'
import useBoardStore from '../store/BoardStore'
import Card from './Card'
import socket from '../socket'
import { useGameStore } from '../store/GameStore'
import { usePointStore } from '../store/PointsStore'
import { useEffect, useState } from 'react'


export default function Board({
  amIP1,
  isMyTurn,
}: {
  amIP1: boolean
  isMyTurn: boolean
}) {
  const [selectedCard, resetSelectedCard] = useCardStore((state) => [
    state.selectedCard,
    state.resetSelectedCard,
  ])
  const [tiles, setTiles] = useBoardStore((state) => [
    state.board,
    state.setBoard,
  ])

  const [gameOver] = useGameStore((state) => [state.gameOver])
  const [playerOnePointsArray, playerTwoPointsArray] = usePointStore(state => [state.playerOnePoints, state.playerTwoPoints])
  const [sumOfPlayersPoints, setSumOfPlayersPoints] = useState<number[]>([0, 0])

  useEffect(() => {
    if (gameOver) {
      const newSumOfPlayersPoints = [0, 0]
      Array(3).fill(0).forEach((_, index) => {
        if (amIP1) {
          if (playerOnePointsArray[index] > playerTwoPointsArray[index]) {
            newSumOfPlayersPoints[0] += playerOnePointsArray[index]
          }
          if (playerOnePointsArray[index] < playerTwoPointsArray[index]) {
            newSumOfPlayersPoints[1] += playerTwoPointsArray[index]
          }
          return
        }
        if (playerOnePointsArray[index] > playerTwoPointsArray[index]) {
          newSumOfPlayersPoints[1] += playerOnePointsArray[index]
        }
        if (playerOnePointsArray[index] < playerTwoPointsArray[index]) {
          newSumOfPlayersPoints[0] += playerTwoPointsArray[index]
        }
      })
      setSumOfPlayersPoints(newSumOfPlayersPoints)
    }
  }, [gameOver])

  const rows = 3
  const cols = 7
  const tilesElements = new Array(rows)
    .fill(0)
    .map(() => new Array(cols).fill(0))

  function canAddCardToPosition(card: CardInfo | null, position: Tile) {
    if (!card) {
      return false
    }

    if (!isMyTurn) {
      return false
    }

    if (amIP1 && position?.playerOnePawns === 0) {
      return false
    }

    if (!amIP1 && position?.playerTwoPawns === 0) {
      return false
    }

    if (amIP1 && position?.playerOnePawns < card.pawnsCost) {
      return false
    }

    if (!amIP1 && position?.playerTwoPawns < card.pawnsCost) {
      return false
    }

    return true
  }

  function mapPawns(card: CardInfo, rowIndex: number, colIndex: number) {
    const correctColIndex = isMyTurn ? colIndex : Math.abs(colIndex - 4)
    const transformedRowIndex = correctColIndex
    const transformedColIndex = -rowIndex
    const newTiles = [...tiles]
    for (let i = 0; i < card.pawnsPositions.length; i++) {
      const newRow = -(transformedColIndex + card.pawnsPositions[i][1])
      const newCol = transformedRowIndex + card.pawnsPositions[i][0]

      if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols - 2) {
        continue
      }

      if (amIP1) {
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

    if (amIP1) {
      newTiles[rowIndex][correctColIndex] = {
        playerOnePoints: card.points,
        playerTwoPoints: 0,
        playerOnePawns: -1,
        playerTwoPawns: -1,
        card: {
          ...card,
          placedByPlayerOne: true,
        },
      }
      console.log(newTiles)
      return newTiles
    }

    newTiles[rowIndex][correctColIndex] = {
      playerOnePoints: 0,
      playerTwoPoints: card.points,
      playerOnePawns: -1,
      playerTwoPawns: -1,
      card: {
        ...card,
        placedByPlayerOne: false,
      },
    }

    console.log(transformMatrix(newTiles))

    return newTiles
  }

  function transformMatrix(matrix) {
    return matrix.map((row) => row.toReversed())
  }

  function handleCellClick(position: Tile, rowIndex: number, colIndex: number) {
    if (!canAddCardToPosition(selectedCard, position)) {
      return
    }

    if (!selectedCard) {
      return
    }

    const newTiles = mapPawns(selectedCard, rowIndex, colIndex)

    setTiles(newTiles)
    resetSelectedCard()
    socket.emit('place-card', newTiles)
  }

  function handleSkipTurn() {
    resetSelectedCard()
    socket.emit('skip-turn', tiles)
  }


  for (let i = 0; i < rows; i++) {
    tilesElements[i][0] = (
      <div
        className={`bg-gray-800 h-48 w-full flex items-center justify-center border-solid border-2 border-black`}
        key={`${i}-${0}`}
      >
        <div
          className={`h-24 w-24 outline outline-offset-2 outline-yellow-400 text-5xl font-medium
             text-white ${amIP1 ? playerOnePointsArray[i] > playerTwoPointsArray[i]
              ? 'bg-green-400  drop-shadow-glow'
              : 'bg-green-400 brightness-75 '
              : playerOnePointsArray[i] > playerTwoPointsArray[i]
                ? 'bg-red-400 drop-shadow-glow'
                : 'bg-red-400 brightness-75 '} shadow-xl
             rounded-full flex justify-center items-center`}
        >
          {playerOnePointsArray[i]}
        </div>
      </div>
    )
    tilesElements[i][cols - 1] = (
      <div
        className={`bg-gray-800 h-48 w-full flex items-center justify-center border-solid border-2 border-black`}
        key={`${i}-${cols - 1}`}
      >
        <div
          className={`h-24 w-24 outline outline-offset-2 outline-yellow-400 
            ${amIP1 ? playerTwoPointsArray[i] > playerOnePointsArray[i]
              ? 'bg-red-400 drop-shadow-glow'
              : 'bg-red-400 brightness-75 ' : playerTwoPointsArray[i] > playerOnePointsArray[i]
              ? 'bg-green-400  drop-shadow-glow'
              : 'bg-green-400 brightness-75 '
            } text-5xl text-white font-medium shadow-xl rounded-full
             flex justify-center items-center`}
        >
          {playerTwoPointsArray[i]}
        </div>
      </div>
    )
  }


  for (let i = 0; i < rows; i++) {
    for (let j = 1; j < cols - 1; j++) {
      const color = (i + j) % 2 === 0 ? 'bg-white' : 'bg-gray-800'
      tilesElements[i][j] = (
        <div
          className={`${color} h-48 w-full border-solid border-4 hover:border-4 ${!tiles[i][j - 1].card ? 'flex justify-center items-center' : ''}  border-black
           ${selectedCard ? (canAddCardToPosition(selectedCard, tiles[i][j - 1]) ? 'cursor-pointer  hover:border-green-400' : 'cursor-not-allowed hover:border-red-400') : ''}
           transition duration-300 ease-out`}
          onClick={() => handleCellClick(tiles[i][j - 1], i, j - 1)}
          key={`${i}-${j}`}
        >
          {!tiles[i][j - 1].card ? (
            <div className="text-5xl font-bold text-center ">
              {tiles[i][j - 1] && tiles[i][j - 1].playerOnePawns > 0 && (
                <>
                  <p>{'♟'.repeat(tiles[i][j - 1].playerOnePawns)}</p>
                  <hr className={`rounded mt-4 border-2 ${amIP1 ? 'border-green-400' : 'border-red-400'}`} />
                </>
              )}
              {tiles[i][j - 1] && tiles[i][j - 1].playerTwoPawns > 0 && (
                <>
                  <p>{'♟'.repeat(tiles[i][j - 1].playerTwoPawns)}</p>
                  <hr className={`rounded mt-4 border-2 ${!amIP1 ? 'border-green-400' : 'border-red-400'}`} />
                </>
              )}
            </div>
          ) : (
            <div className="flex justify-center p-1 h-full items-center">
              <Card placed={true} card={tiles[i][j - 1].card} amIP1={amIP1} />
            </div>
          )}
        </div>
      )
    }
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex w-full items-center justify-evenly">
          <div className="flex flex-col items-center justify-center gap-3">
            <span className={`text-8xl ${gameOver ? 'visible' : 'invisible'}`}>{sumOfPlayersPoints[0]}</span>
            <span className={`text-8xl scale-x-[-1] `}>🐉</span>
            <h1 className="text-5xl">
              {amIP1 ? 'Player 1' : 'Player 2'}
            </h1>
          </div>
          <div className="grid grid-cols-7 gap-1 w-8/12">
            {amIP1 ? tilesElements : transformMatrix(tilesElements)}
          </div>
          <div className="flex flex-col items-center justify-center gap-3">
            <span className={`text-8xl ${gameOver ? 'visible' : 'invisible'}`}>{sumOfPlayersPoints[1]}</span>
            <span className={`text-8xl`}>🐉</span>
            <h1 className="text-5xl">
              {!amIP1 ? 'Player 1' : 'Player 2'}
            </h1>
          </div>
        </div>
        <div className="flex w-10/12 items-center justify-end p-2">
          <span
            className={`mr-8 text-4xl rounded-full bg-gray-50 hover:bg-gray-200 transition duration-200
         shadow-xl cursor-pointer  text-black border-4 border-yellow-400 py-1 px-12 ${isMyTurn && !gameOver ? 'visible' : 'invisible'}`}
            onClick={handleSkipTurn}
          >
            Skip turn
          </span>
        </div>
      </div>
    </>
  )
}
