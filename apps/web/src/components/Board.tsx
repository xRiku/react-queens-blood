import { Tile } from '../@types/Tile'
import { canAddCardToPosition, mapPawns, getActiveEffectPositions } from '@queens-blood/shared'
import useCardStore from '../store/CardStore'
import useBoardStore from '../store/BoardStore'
import Card from './Card'
import { Result, useGameStore } from '../store/GameStore'
import { usePointStore } from '../store/PointsStore'
import { useEffect, useMemo } from 'react'
import useTurnStore from '../store/TurnStore'
import transformMatrix from '../utils/transformMatrix'
import { usePlaceCard } from '../hooks/usePlaceCard'
import { useIsMobile } from '../hooks/useIsMobile'
import { playSynthSound } from '../store/SoundStore'
import Pawn from './Pawn'
import { cn } from '../utils/cn'
import { useShallow } from 'zustand/react/shallow'
import { calcPlayerScores } from '../utils/calcPlayerScores'

function ScoreCell({
  score,
  opponentScore,
  isChanged,
  isMe,
}: {
  score: number
  opponentScore: number
  isChanged: boolean | 0 | null
  isMe: boolean
}) {
  const baseColor = isMe ? 'bg-green-400' : 'bg-red-400'
  return (
    <div
      className="bg-gray-800 h-20 md:h-28 xl:h-36 2xl:h-44 w-full flex items-center justify-center border-solid border-2 border-black"
    >
      <div
        className={cn(
          'h-7 w-7 md:h-16 md:w-16 xl:h-20 xl:w-20 2xl:h-24 2xl:w-24 ring-1 ring-yellow-400 md:outline md:outline-offset-2 md:outline-yellow-400 md:ring-0 text-xs md:text-3xl xl:text-4xl 2xl:text-5xl font-medium shadow-xl rounded-full flex justify-center items-center',
          isChanged ? 'text-yellow-300 animate-pulse' : 'text-white',
          score > opponentScore ? `${baseColor} drop-shadow-glow` : `${baseColor} brightness-75`,
        )}
      >
        {score}
      </div>
    </div>
  )
}

function PawnGroup({
  count,
  color,
}: {
  count: number
  color: 'green' | 'red'
}) {
  if (count === 0) return null
  return (
    <>
      <div className="flex justify-center gap-0.5">
        {Array.from({ length: count }).map((_, idx) => (
          <Pawn
            key={idx}
            color={color}
            className="h-3 w-3 md:h-6 md:w-6 xl:h-8 xl:w-8 2xl:h-10 2xl:w-10"
          />
        ))}
      </div>
      <hr className={cn(
        'rounded mt-0.5 md:mt-4 border md:border-2',
        color === 'green' ? 'border-green-400' : 'border-red-400',
      )}
      />
    </>
  )
}

function PlayerPanel({
  name,
  label,
  score,
  gameOver,
  flipped,
}: {
  name: string
  label: string
  score: number
  gameOver: boolean
  flipped?: boolean
}) {
  return (
    <div className="hidden md:flex flex-col items-center justify-center gap-3 w-24 xl:w-28 2xl:w-32">
      <span className={cn(
        'text-5xl xl:text-6xl 2xl:text-8xl',
        gameOver ? 'visible' : 'invisible',
      )}
      >{score}
      </span>
      <span className={cn('text-5xl xl:text-6xl 2xl:text-8xl', flipped && 'scale-x-[-1]')}>🐉</span>
      <h1 className="text-2xl xl:text-3xl 2xl:text-4xl">
        {name} {' '}
      </h1>
      <h2 className="text-lg xl:text-xl 2xl:text-2xl">
        {label}
      </h2>
    </div>
  )
}

export default function Board({
  amIP1,
}: {
  amIP1: boolean
}) {
  const selectedCard = useCardStore((state) => state.selectedCard)
  const previewTile = useCardStore((state) => state.previewTile)
  const setPreviewTile = useCardStore((state) => state.setPreviewTile)
  const tiles = useBoardStore((state) => state.board)

  const isMyTurn = useTurnStore((state) => state.isMyTurn)
  const isMobile = useIsMobile()
  const { confirmPlacement } = usePlaceCard()

  const { gameOver, setGameResult, playerOneName, playerTwoName, playerDisconnected } = useGameStore(useShallow((state) => ({ gameOver: state.gameOver, setGameResult: state.setGameResult, playerOneName: state.playerOneName, playerTwoName: state.playerTwoName, playerDisconnected: state.playerDisconnected })))
  const { playerOnePointsArray, playerTwoPointsArray } = usePointStore(useShallow(state => ({ playerOnePointsArray: state.playerOnePoints, playerTwoPointsArray: state.playerTwoPoints })))

  const previewData = useMemo(() => {
    if (!previewTile || !selectedCard) return null

    const [row, col] = previewTile
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
          cur.playerOnePawns !== prev.playerOnePawns ||
          cur.playerTwoPawns !== prev.playerTwoPawns ||
          cur.playerOnePoints !== prev.playerOnePoints ||
          cur.playerTwoPoints !== prev.playerTwoPoints ||
          cur.card !== prev.card
        ) {
          affectedTiles.add(`${r}-${c}`)
        }
      }
    }

    return { previewBoard, previewP1Points, previewP2Points, affectedTiles }
  }, [previewTile, tiles, selectedCard, amIP1])

  const activeEffectTiles = useMemo(() => getActiveEffectPositions(tiles), [tiles])

  const sumOfPlayersPoints = useMemo(() => {
    if (!gameOver || playerDisconnected) return [0, 0] as [number, number]
    return calcPlayerScores(playerOnePointsArray, playerTwoPointsArray, amIP1)
  }, [gameOver, playerDisconnected, amIP1, playerOnePointsArray, playerTwoPointsArray])

  useEffect(() => {
    if (!gameOver) return

    if (playerDisconnected) {
      setGameResult(Result.WIN)
      return
    }

    const [myPoints, opponentPoints] = sumOfPlayersPoints
    if (myPoints > opponentPoints) {
      setGameResult(Result.WIN)
    } else if (myPoints < opponentPoints) {
      setGameResult(Result.LOSE)
    } else {
      setGameResult(Result.DRAW)
    }
  }, [gameOver, playerDisconnected, sumOfPlayersPoints, setGameResult])

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

    if (isMobile) {
      setPreviewTile([rowIndex, colIndex])
      return
    }

    confirmPlacement(rowIndex, colIndex)
  }

  for (let i = 0; i < rows; i++) {
    const p1Score = previewData
      ? previewData.previewP1Points[i]
      : playerOnePointsArray[i]
    const p2Score = previewData
      ? previewData.previewP2Points[i]
      : playerTwoPointsArray[i]
    const p1ScoreChanged = previewData && previewData.previewP1Points[i] !== playerOnePointsArray[i]
    const p2ScoreChanged = previewData && previewData.previewP2Points[i] !== playerTwoPointsArray[i]

    tilesElements[i][0] = (
      <ScoreCell
        key={`${i}-${0}`}
        score={p1Score}
        opponentScore={p2Score}
        isChanged={p1ScoreChanged}
        isMe={amIP1}
      />
    )
    tilesElements[i][cols - 1] = (
      <ScoreCell
        key={`${i}-${cols - 1}`}
        score={p2Score}
        opponentScore={p1Score}
        isChanged={p2ScoreChanged}
        isMe={!amIP1}
      />
    )
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 1; j < cols - 1; j++) {
      const boardCol = j - 1
      const color = (i + j) % 2 === 0
        ? 'bg-white'
        : 'bg-gray-800'
      const isAffected = previewData?.affectedTiles.has(`${i}-${boardCol}`)
      const previewTileData = isAffected
        ? previewData!.previewBoard[i][boardCol]
        : null
      const isPlacementTile = previewTileData !== null && previewTileData.card !== null && !tiles[i][boardCol].card
      const isBuffedOrDebuffed = isAffected && tiles[i][boardCol].card !== null
      const isActiveEffect = !previewData && activeEffectTiles.has(`${i}-${boardCol}`)

      tilesElements[i][j] = (
        <div
          className={cn(
            color,
            'h-20 md:h-28 xl:h-36 2xl:h-44 w-full border-solid border-2 md:border-4 hover:border-4 border-black md:transition md:duration-300 md:ease-out relative',
            !tiles[i][boardCol].card && !isPlacementTile && 'flex justify-center items-center',
            selectedCard && (canPlace(tiles[i][boardCol])
              ? 'cursor-pointer border-green-400 hover:border-green-300'
              : 'cursor-not-allowed hover:border-red-400'),
            isAffected && !isPlacementTile && !isBuffedOrDebuffed && 'border-blue-400',
            isBuffedOrDebuffed && 'border-yellow-400',
            isActiveEffect && tiles[i][boardCol].card && 'border-green-400 animate-pulse',
          )}
          role="button"
          tabIndex={0}
          onClick={() => handleCellClick(tiles[i][boardCol], i, boardCol)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleCellClick(tiles[i][boardCol], i, boardCol)
            }
          }}
          onMouseEnter={!isMobile ? () => {
            if (selectedCard && canPlace(tiles[i][boardCol])) {
              setPreviewTile([i, boardCol])
            }
          } : undefined}
          onMouseLeave={!isMobile ? () => setPreviewTile(null) : undefined}
          key={`${i}-${j}`}
        >
          {isPlacementTile
            ? (
              <div className="flex justify-center p-0.5 md:p-1 h-full items-center opacity-50">
                <Card placed card={previewTileData!.card} amIP1={amIP1} />
              </div>
              )
            : !tiles[i][boardCol].card
                ? (
                  <div className={cn(
                    'text-center',
                    isAffected && 'opacity-60',
                    isActiveEffect && 'animate-pulse',
                  )}
                  >
                    {(() => {
                      const displayTile = isAffected && previewTileData
                        ? previewTileData
                        : tiles[i][boardCol]
                      return (
                        <>
                          <PawnGroup count={displayTile.playerOnePawns} color={amIP1 ? 'green' : 'red'} />
                          <PawnGroup count={displayTile.playerTwoPawns} color={amIP1 ? 'red' : 'green'} />
                        </>
                      )
                    })()}
                  </div>
                  )
                : (
                  <div className={cn(
                    'flex justify-center p-0.5 md:p-1 h-full items-center',
                    isBuffedOrDebuffed && 'animate-pulse',
                  )}
                  >
                    <Card
                      placed
                      card={tiles[i][boardCol].card}
                      amIP1={amIP1}
                      effectivePoints={isBuffedOrDebuffed && previewTileData
                        ? (tiles[i][boardCol].card?.placedByPlayerOne
                            ? previewTileData.playerOnePoints
                            : previewTileData.playerTwoPoints)
                        : undefined}
                    />
                  </div>
                  )}
        </div>
      )
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 md:gap-4">
        {/* Mobile player info bar */}
        <div className="flex md:hidden w-full items-center justify-center gap-4 px-4">
          <div className="flex items-center gap-2">
            <span className={cn(
              'h-3 w-3 rounded-full',
              amIP1 ? 'bg-green-400' : 'bg-red-400',
            )}
            />
            <span className="text-sm font-medium truncate max-w-[80px]">
              {amIP1 ? playerOneName : playerTwoName}
            </span>
            {gameOver && (
              <span className="text-sm font-bold">{sumOfPlayersPoints[0]}</span>
            )}
          </div>
          <span className="text-xs text-gray-400">vs</span>
          <div className="flex items-center gap-2">
            {gameOver && (
              <span className="text-sm font-bold">{sumOfPlayersPoints[1]}</span>
            )}
            <span className="text-sm font-medium truncate max-w-[80px]">
              {amIP1 ? playerTwoName : playerOneName}
            </span>
            <span className={cn(
              'h-3 w-3 rounded-full',
              amIP1 ? 'bg-red-400' : 'bg-green-400',
            )}
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-evenly">
          {/* Left player panel — desktop only */}
          <PlayerPanel
            name={amIP1 ? playerOneName : playerTwoName}
            label={amIP1 ? '(Player 1)' : '(Player 2)'}
            score={sumOfPlayersPoints[0]}
            gameOver={gameOver}
            flipped
          />
          <div className="grid grid-cols-7 gap-0.5 md:gap-1 w-full px-2 md:px-0 md:w-8/12">
            {amIP1
              ? tilesElements
              : transformMatrix(tilesElements)}
          </div>
          {/* Right player panel — desktop only */}
          <PlayerPanel
            name={amIP1 ? playerTwoName : playerOneName}
            label={amIP1 ? '(Player 2)' : '(Player 1)'}
            score={sumOfPlayersPoints[1]}
            gameOver={gameOver}
          />
        </div>
      </div>
    </>
  )
}
