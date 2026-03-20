import { Tile } from '../@types/Tile'
import { canAddCardToPosition, mapPawns } from '@queens-blood/shared'
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
import { useBotGameActions } from '../contexts/BotGameContext'
import { playSynthSound } from '../store/SoundStore'


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
  const botActions = useBotGameActions()

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

  function canPlace(position: Tile) {
    return isMyTurn && canAddCardToPosition(selectedCard, position, amIP1)
  }

  function handleCellClick(position: Tile, rowIndex: number, colIndex: number) {
    if (!selectedCard) return

    if (!canPlace(position)) {
      playSynthSound('invalid')
      return
    }

    const correctColIndex = isMyTurn ? colIndex : Math.abs(colIndex - 4)

    playSynthSound('place')

    if (botActions) {
      botActions.placeCard(selectedCard.id, rowIndex, correctColIndex)
      resetSelectedCard()
      return
    }

    // Optimistic update — apply locally for instant feedback
    const newTiles = mapPawns(tiles, selectedCard, rowIndex, correctColIndex, amIP1)
    placeCard(selectedCard)
    setTiles(newTiles)
    resetSelectedCard()

    // Send action to server for validation
    socket.emit('place-card', {
      cardId: selectedCard.id,
      row: rowIndex,
      col: correctColIndex,
      gameId,
    })
  }




  for (let i = 0; i < rows; i++) {
    tilesElements[i][0] = (
      <div
        className={`bg-gray-800 h-28 xl:h-36 2xl:h-44 w-full flex items-center justify-center border-solid border-2 border-black`}
        key={`${i}-${0}`}
      >
        <div
          className={`h-16 w-16 xl:h-20 xl:w-20 2xl:h-24 2xl:w-24 outline outline-offset-2 outline-yellow-400 text-3xl xl:text-4xl 2xl:text-5xl font-medium
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
        className={`bg-gray-800 h-28 xl:h-36 2xl:h-44 w-full flex items-center justify-center border-solid border-2 border-black`}
        key={`${i}-${cols - 1}`}
      >
        <div
          className={`h-16 w-16 xl:h-20 xl:w-20 2xl:h-24 2xl:w-24 outline outline-offset-2 outline-yellow-400 
            ${amIP1 ? playerTwoPointsArray[i] > playerOnePointsArray[i]
              ? 'bg-red-400 drop-shadow-glow'
              : 'bg-red-400 brightness-75 ' : playerTwoPointsArray[i] > playerOnePointsArray[i]
              ? 'bg-green-400  drop-shadow-glow'
              : 'bg-green-400 brightness-75 '
            } text-3xl xl:text-4xl 2xl:text-5xl text-white font-medium shadow-xl rounded-full
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
          className={`${color} h-28 xl:h-36 2xl:h-44 w-full border-solid border-4 hover:border-4 ${!tiles[i][j - 1].card ? 'flex justify-center items-center' : ''}  border-black
           ${selectedCard ? (canPlace(tiles[i][j - 1]) ? 'cursor-pointer ring-2 ring-green-400 ring-inset hover:ring-4' : 'cursor-not-allowed hover:border-red-400') : ''}
           transition duration-300 ease-out`}
          onClick={() => handleCellClick(tiles[i][j - 1], i, j - 1)}
          key={`${i}-${j}`}
        >
          {!tiles[i][j - 1].card ? (
            <div className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-center ">
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
          <div className="flex flex-col items-center justify-center gap-3 w-24 xl:w-28 2xl:w-32">
            <span className={`text-5xl xl:text-6xl 2xl:text-8xl ${gameOver ? 'visible' : 'invisible'}`}>{sumOfPlayersPoints[0]}</span>
            <span className={`text-5xl xl:text-6xl 2xl:text-8xl scale-x-[-1] `}>🐉</span>
            <h1 className="text-2xl xl:text-3xl 2xl:text-4xl">
              {amIP1 ? playerOneName : playerTwoName} {' '}
            </h1>
            <h2 className='text-lg xl:text-xl 2xl:text-2xl'>
              {amIP1 ? '(Player 1)' : '(Player 2)'}
            </h2>
          </div>
          <div className="grid grid-cols-7 gap-1 w-8/12">
            {amIP1 ? tilesElements : transformMatrix(tilesElements)}
          </div>
          <div className="flex flex-col items-center justify-center gap-3 w-24 xl:w-28 2xl:w-32">
            <span className={`text-5xl xl:text-6xl 2xl:text-8xl ${gameOver ? 'visible' : 'invisible'}`}>{sumOfPlayersPoints[1]}</span>
            <span className={`text-5xl xl:text-6xl 2xl:text-8xl`}>🐉</span>
            <h1 className="text-2xl xl:text-3xl 2xl:text-4xl">
              {amIP1 ? playerTwoName : playerOneName} {' '}
            </h1>
            <h2 className='text-lg xl:text-xl 2xl:text-2xl'>
              {amIP1 ? '(Player 2)' : '(Player 1)'}
            </h2>
          </div>
        </div>
      </div>
    </>
  )
}
