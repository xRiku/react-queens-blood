import { Tile } from '../@types/Tile'
import { CardInfo } from '../@types/Card'
import useCardStore from '../store/CardStore'
import useBoardStore from '../store/BoardStore'
import Card from './Card'
import socket from '../socket'
import { Result, useGameStore } from '../store/GameStore'
import { usePointStore } from '../store/PointsStore'
import { useEffect, useState } from 'react'
import useNeoHandStore from '../store/NeoHandStore'
import useTurnStore from '../store/TurnStore'
import transformMatrix from '../utils/transformMatrix'
import { useParams } from 'react-router-dom'


export default function Board({
  amIP1
}: {
  amIP1: boolean
}) {
  const [selectedCard, resetSelectedCard] = useCardStore((state) => [
    state.selectedCard,
    state.resetSelectedCard,
  ])
  const [tiles, setTiles] = useBoardStore((state) => [
    state.board,
    state.setBoard,
  ])


  const [isMyTurn] = useTurnStore((state) => [state.isMyTurn])

  const [gameOver, setGameResult, playerOneName, playerTwoName, playerDisconnected] = useGameStore((state) => [state.gameOver, state.setGameResult, state.playerOneName, state.playerTwoName, state.playerDisconnected])
  const [playerOnePointsArray, playerTwoPointsArray] = usePointStore(state => [state.playerOnePoints, state.playerTwoPoints])
  const [sumOfPlayersPoints, setSumOfPlayersPoints] = useState<number[]>([0, 0])
  const [placeCard] = useNeoHandStore(state => [state.placeCard])

  const { id: gameId } = useParams<{ id: string }>()

  useEffect(() => {
    if (gameOver) {
      if (playerDisconnected) {
        setGameResult(Result.WIN)
        return
      }
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
      if (newSumOfPlayersPoints[0] > newSumOfPlayersPoints[1]) {
        setGameResult(Result.WIN)
      }
      if (newSumOfPlayersPoints[0] < newSumOfPlayersPoints[1]) {
        setGameResult(Result.LOSE)
      }
      if (newSumOfPlayersPoints[0] === newSumOfPlayersPoints[1]) {
        setGameResult(Result.DRAW)
      }
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
      const newCol = amIP1 ? transformedRowIndex + card.pawnsPositions[i][0] : Math.abs(-transformedRowIndex + card.pawnsPositions[i][0])

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

    if (card.affectedPositions) {
      for (let i = 0; i < card.affectedPositions.length; i++) {
        const newRow = -(transformedColIndex + card.affectedPositions[i][1])
        const newCol = amIP1 ? transformedRowIndex + card.affectedPositions[i][0] : Math.abs(-transformedRowIndex + card.pawnsPositions[i][0])

        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols - 2) {
          continue
        }


        if (amIP1) {
          newTiles[newRow][newCol] = {
            ...newTiles[newRow][newCol],
            playerOnePoints:
              card.affectedAllyEffectValue ? newTiles[newRow][newCol].playerOnePoints + card.affectedAllyEffectValue : newTiles[newRow][newCol].playerOnePoints,
            playerTwoPoints:
              card.affectedEnemyEffectValue ? newTiles[newRow][newCol].playerTwoPoints + card.affectedEnemyEffectValue : newTiles[newRow][newCol].playerTwoPoints,
          }
          continue
        }

        newTiles[newRow][newCol] = {
          ...newTiles[newRow][newCol],
          playerOnePoints:
            card.affectedEnemyEffectValue ? newTiles[newRow][newCol].playerOnePoints + card.affectedEnemyEffectValue : newTiles[newRow][newCol].playerOnePoints,
          playerTwoPoints:
            card.affectedAllyEffectValue ? newTiles[newRow][newCol].playerTwoPoints + card.affectedAllyEffectValue : newTiles[newRow][newCol].playerTwoPoints,
        }
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

    return newTiles
  }

  function handleCellClick(position: Tile, rowIndex: number, colIndex: number) {
    if (!canAddCardToPosition(selectedCard, position)) {
      return
    }

    if (!selectedCard) {
      return
    }

    const newTiles = mapPawns(selectedCard, rowIndex, colIndex)

    placeCard(selectedCard)
    setTiles(newTiles)
    resetSelectedCard()
    socket.emit('place-card', { tiles: newTiles, gameId })
  }




  for (let i = 0; i < rows; i++) {
    tilesElements[i][0] = (
      <div
        className={`bg-gray-800 h-44 w-full flex items-center justify-center border-solid border-2 border-black`}
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
        className={`bg-gray-800 h-44 w-full flex items-center justify-center border-solid border-2 border-black`}
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
          className={`${color} h-44 w-full border-solid border-4 hover:border-4 ${!tiles[i][j - 1].card ? 'flex justify-center items-center' : ''}  border-black
           ${selectedCard ? (canAddCardToPosition(selectedCard, tiles[i][j - 1]) ? 'cursor-pointer  hover:border-green-400' : 'cursor-not-allowed hover:border-red-400') : ''}
           transition duration-300 ease-out`}
          onClick={() => handleCellClick(tiles[i][j - 1], i, j - 1)}
          key={`${i}-${j}`}
        >
          {!tiles[i][j - 1].card ? (
            <div className="text-4xl font-bold text-center ">
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
          <div className="flex flex-col items-center justify-center gap-3 w-32">
            <span className={`text-8xl ${gameOver ? 'visible' : 'invisible'}`}>{sumOfPlayersPoints[0]}</span>
            <span className={`text-8xl scale-x-[-1] `}>🐉</span>
            <h1 className="text-4xl">
              {amIP1 ? playerOneName : playerTwoName} {' '}
            </h1>
            <h2 className='text-2xl'>
              {amIP1 ? '(Player 1)' : '(Player 2)'}
            </h2>
          </div>
          <div className="grid grid-cols-7 gap-1 w-8/12">
            {amIP1 ? tilesElements : transformMatrix(tilesElements)}
          </div>
          <div className="flex flex-col items-center justify-center gap-3 w-32">
            <span className={`text-8xl ${gameOver ? 'visible' : 'invisible'}`}>{sumOfPlayersPoints[1]}</span>
            <span className={`text-8xl`}>🐉</span>
            <h1 className="text-4xl">
              {amIP1 ? playerTwoName : playerOneName} {' '}
            </h1>
            <h2 className='text-2xl'>
              {amIP1 ? '(Player 2)' : '(Player 1)'}
            </h2>
          </div>
        </div>
      </div>
    </>
  )
}
