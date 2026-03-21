import { Tile } from '../@types/Tile'
import { canAddCardToPosition, mapPawns } from '@queens-blood/shared'
import useCardStore from '../store/CardStore'
import useBoardStore from '../store/BoardStore'
import Card from './Card'
import socket from '../socket'
import { Result, useGameStore } from '../store/GameStore'
import { usePointStore } from '../store/PointsStore'
import { useEffect, useMemo, useState } from 'react'
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
  const [tiles] = useBoardStore((state) => [
    state.board,
  ])


  const [isMyTurn] = useTurnStore((state) => [state.isMyTurn])
  const botActions = useBotGameActions()

  const [gameOver, setGameResult, playerOneName, playerTwoName, playerDisconnected] = useGameStore((state) => [state.gameOver, state.setGameResult, state.playerOneName, state.playerTwoName, state.playerDisconnected])
  const [playerOnePointsArray, playerTwoPointsArray] = usePointStore(state => [state.playerOnePoints, state.playerTwoPoints])
  const [sumOfPlayersPoints, setSumOfPlayersPoints] = useState<number[]>([0, 0])
  const [placeCard] = useNeoHandStore(state => [state.placeCard])

  const { id: gameId } = useParams<{ id: string }>()

  const [hoveredTile, setHoveredTile] = useState<[number, number] | null>(null)

  useEffect(() => {
    setHoveredTile(null)
  }, [selectedCard])

  const previewData = useMemo(() => {
    if (!hoveredTile || !selectedCard) return null

    const [row, col] = hoveredTile
    const previewBoard = mapPawns(tiles, selectedCard, row, col, amIP1)

    const previewP1Points = [0, 0, 0]
    const previewP2Points = [0, 0, 0]
    previewBoard.forEach((boardRow, idx) => {
      previewP1Points[idx] = boardRow.reduce((sum, t) => sum + t.playerOnePoints, 0)
      previewP2Points[idx] = boardRow.reduce((sum, t) => sum + t.playerTwoPoints, 0)
    })

    const affectedTiles = new Set<string>()
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        const cur = tiles[r][c]
        const prev = previewBoard[r][c]
        if (
          !cur.card && (
            cur.playerOnePawns !== prev.playerOnePawns ||
            cur.playerTwoPawns !== prev.playerTwoPawns ||
            cur.playerOnePoints !== prev.playerOnePoints ||
            cur.playerTwoPoints !== prev.playerTwoPoints ||
            cur.card !== prev.card
          )
        ) {
          affectedTiles.add(`${r}-${c}`)
        }
      }
    }

    return { previewBoard, previewP1Points, previewP2Points, affectedTiles }
  }, [hoveredTile, tiles, selectedCard, amIP1])

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

    if (botActions) {
      botActions.placeCard(selectedCard.id, rowIndex, correctColIndex)
      resetSelectedCard()
      return
    }

    // Remove card from hand for UI feedback, board updates from server's new-turn event
    placeCard(selectedCard)
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
    const p1Score = previewData ? previewData.previewP1Points[i] : playerOnePointsArray[i]
    const p2Score = previewData ? previewData.previewP2Points[i] : playerTwoPointsArray[i]
    const p1ScoreChanged = previewData && previewData.previewP1Points[i] !== playerOnePointsArray[i]
    const p2ScoreChanged = previewData && previewData.previewP2Points[i] !== playerTwoPointsArray[i]

    tilesElements[i][0] = (
      <div
        className={`bg-gray-800 h-28 xl:h-36 2xl:h-44 w-full flex items-center justify-center border-solid border-2 border-black`}
        key={`${i}-${0}`}
      >
        <div
          className={`h-16 w-16 xl:h-20 xl:w-20 2xl:h-24 2xl:w-24 outline outline-offset-2 outline-yellow-400 text-3xl xl:text-4xl 2xl:text-5xl font-medium
             ${(amIP1 ? p1ScoreChanged : p1ScoreChanged) ? 'text-yellow-300 animate-pulse' : 'text-white'} ${amIP1 ? p1Score > p2Score
              ? 'bg-green-400  drop-shadow-glow'
              : 'bg-green-400 brightness-75 '
              : p1Score > p2Score
                ? 'bg-red-400 drop-shadow-glow'
                : 'bg-red-400 brightness-75 '} shadow-xl
             rounded-full flex justify-center items-center`}
        >
          {p1Score}
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
            ${amIP1 ? p2Score > p1Score
              ? 'bg-red-400 drop-shadow-glow'
              : 'bg-red-400 brightness-75 ' : p2Score > p1Score
              ? 'bg-green-400  drop-shadow-glow'
              : 'bg-green-400 brightness-75 '
            } text-3xl xl:text-4xl 2xl:text-5xl ${(amIP1 ? p2ScoreChanged : p2ScoreChanged) ? 'text-yellow-300 animate-pulse' : 'text-white'} font-medium shadow-xl rounded-full
             flex justify-center items-center`}
        >
          {p2Score}
        </div>
      </div>
    )
  }


  for (let i = 0; i < rows; i++) {
    for (let j = 1; j < cols - 1; j++) {
      const boardCol = j - 1
      const color = (i + j) % 2 === 0 ? 'bg-white' : 'bg-gray-800'
      const isAffected = previewData?.affectedTiles.has(`${i}-${boardCol}`)
      const previewTile = isAffected ? previewData!.previewBoard[i][boardCol] : null
      const isPlacementTile = previewTile !== null && previewTile.card !== null && !tiles[i][boardCol].card

      tilesElements[i][j] = (
        <div
          className={`${color} h-28 xl:h-36 2xl:h-44 w-full border-solid border-4 hover:border-4 ${!tiles[i][boardCol].card && !isPlacementTile ? 'flex justify-center items-center' : ''}  border-black
           ${selectedCard ? (canPlace(tiles[i][boardCol]) ? 'cursor-pointer border-green-400 hover:border-green-300' : 'cursor-not-allowed hover:border-red-400') : ''}
           ${isAffected && !isPlacementTile ? 'border-blue-400' : ''}
           transition duration-300 ease-out relative`}
          onClick={() => handleCellClick(tiles[i][boardCol], i, boardCol)}
          onMouseEnter={() => {
            if (selectedCard && canPlace(tiles[i][boardCol])) {
              setHoveredTile([i, boardCol])
            }
          }}
          onMouseLeave={() => setHoveredTile(null)}
          key={`${i}-${j}`}
        >
          {isPlacementTile ? (
            <div className="flex justify-center p-1 h-full items-center opacity-50">
              <Card placed={true} card={previewTile!.card} amIP1={amIP1} />
            </div>
          ) : !tiles[i][boardCol].card ? (
            <div className={`text-2xl xl:text-3xl 2xl:text-4xl font-bold text-center ${isAffected ? 'opacity-60' : ''}`}>
              {(() => {
                const displayTile = isAffected && previewTile ? previewTile : tiles[i][boardCol]
                return (
                  <>
                    {displayTile.playerOnePawns > 0 && (
                      <>
                        <p>{'♟'.repeat(displayTile.playerOnePawns)}</p>
                        <hr className={`rounded mt-4 border-2 ${amIP1 ? 'border-green-400' : 'border-red-400'}`} />
                      </>
                    )}
                    {displayTile.playerTwoPawns > 0 && (
                      <>
                        <p>{'♟'.repeat(displayTile.playerTwoPawns)}</p>
                        <hr className={`rounded mt-4 border-2 ${!amIP1 ? 'border-green-400' : 'border-red-400'}`} />
                      </>
                    )}
                  </>
                )
              })()}
            </div>
          ) : (
            <div className="flex justify-center p-1 h-full items-center">
              <Card placed={true} card={tiles[i][boardCol].card} amIP1={amIP1} />
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
