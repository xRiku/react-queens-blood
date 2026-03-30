import { m } from 'framer-motion'
import { Result, useGameStore, RematchStatus } from '../../store/GameStore'
import { useModalStore } from '../../store/ModalStore'
import { usePointStore } from '../../store/PointsStore'
import socket from '../../socket'
import { useNavigate, useParams } from 'react-router-dom'
import Hourglass from '../Hourglass'
import { useBotGameActions } from '../../contexts/BotGameContext'
import { cn } from '../../utils/cn'
import { useMemo } from 'react'
import { useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { calcPlayerScores } from '../../utils/calcPlayerScores'
import { Fireworks } from '@fireworks-js/react'
import type { FireworksHandlers } from '@fireworks-js/react'
import explosion0 from '../../assets/sounds/explosion0.mp3'
import explosion1 from '../../assets/sounds/explosion1.mp3'
import explosion2 from '../../assets/sounds/explosion2.mp3'
import useSoundStore from '../../store/SoundStore'

function OpponentStatus({ status }: { status: RematchStatus }) {
  if (status === 'waiting') {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <Hourglass />
        <span>Waiting...</span>
      </div>
    )
  }
  if (status === 'confirmed') { return <span className="text-green-600 text-sm font-medium">Accepted!</span> }
  return <span className="text-red-500 text-sm font-medium">Declined</span>
}

export function RematchDialog() {
  const navigate = useNavigate()
  const { id: gameId } = useParams<{ id: string }>()
  const botActions = useBotGameActions()
  const [
    playerOneName,
    playerTwoName,
    playerOneRematchStatus,
    playerTwoRematchStatus,
    amIP1,
  ] = useGameStore((state) => [
    state.playerOneName,
    state.playerTwoName,
    state.playerOneRematchStatus,
    state.playerTwoRematchStatus,
    state.amIP1,
  ])
  const gameResult = useGameStore((state) => state.gameResult)
  const [muted] = useSoundStore((state) => [state.muted])
  const [hideRematchDialog] = useModalStore((state) => [
    state.hideRematchDialog,
  ])
  const fireworksRef = useRef<FireworksHandlers>(null)
  const { playerOnePointsArray, playerTwoPointsArray } = usePointStore(useShallow(state => ({ playerOnePointsArray: state.playerOnePoints, playerTwoPointsArray: state.playerTwoPoints })))

  const scores = useMemo(
    () => calcPlayerScores(playerOnePointsArray, playerTwoPointsArray, amIP1),
    [playerOnePointsArray, playerTwoPointsArray, amIP1],
  )

  const myName = amIP1
    ? playerOneName || 'Player 1'
    : playerTwoName || 'Player 2'

  const myStatus = amIP1
    ? playerOneRematchStatus
    : playerTwoRematchStatus
  const opponentStatus = amIP1
    ? playerTwoRematchStatus
    : playerOneRematchStatus
  const opponentName = amIP1
    ? playerTwoName || 'Player 2'
    : playerOneName || 'Player 1'

  const handleRematch = () => {
    if (botActions) {
      botActions.rematchRespond('confirmed')
      return
    }
    socket.emit('rematch-respond', { gameId, response: 'confirmed' })
  }

  const handleQuit = () => {
    if (botActions) {
      hideRematchDialog()
      navigate('/')
      return
    }
    socket.emit('rematch-respond', { gameId, response: 'refused' })
    hideRematchDialog()
    socket.disconnect()
    navigate('/')
  }

  const rematchButtonClass =
    myStatus === 'confirmed'
      ? 'rounded-md w-full px-4 py-2 bg-green-600 border border-green-600 text-white cursor-default'
      : myStatus === 'refused'
        ? 'rounded-md w-full px-4 py-2 bg-red-500 border border-red-500 text-white cursor-default'
        : 'rounded-md w-full px-4 py-2 border text-black border-black hover:bg-gray-700 hover:border-gray-700 group active:translate-y-0.5'

  const rematchButtonLabel =
    myStatus === 'confirmed'
      ? '\u2713 Rematch'
      : myStatus === 'refused'
        ? '\u2717 Declined'
        : 'Rematch'

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[2px]">
      {gameResult === Result.WIN ? (
        <Fireworks
          ref={fireworksRef}
          options={{
            opacity: 0.5,
            acceleration: 1.0,
            intensity: 20,
            particles: 100,
            sound: { enabled: !muted, files: [explosion0, explosion1, explosion2], volume: { min: 0, max: 4 } },
          }}
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'fixed',
            pointerEvents: 'none',
          }}
        />
      ) : null}
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 bg-white border border-black rounded-lg p-8 w-80"
      >
        <div className="flex flex-col items-center mb-4">
          <m.h2
            initial={{ opacity: 0, translateY: -40 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
              'text-3xl font-semibold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]',
              gameResult === Result.WIN && 'text-yellow-300',
              gameResult === Result.LOSE && 'text-red-500',
              gameResult === Result.DRAW && 'bg-gradient-to-t text-transparent bg-clip-text from-blue-600 via-blue-500 to-white inline-block',
            )}
          >
            {gameResult === Result.WIN ? 'You Win!' : gameResult === Result.LOSE ? 'You Lose!' : 'Tie'}
          </m.h2>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center gap-3 mt-2 text-sm text-gray-700"
          >
            <span className="font-medium">{myName}</span>
            <span className="text-xl font-bold text-black">{scores[0]}</span>
            <span className="text-gray-400">-</span>
            <span className="text-xl font-bold text-black">{scores[1]}</span>
            <span className="font-medium">{opponentName}</span>
          </m.div>
        </div>

        <h2 className="text-2xl font-medium text-center mb-6">
          Rematch?
        </h2>

        {!botActions && (
          <div className="flex items-center justify-between mb-6">
            <span className="text-base">{opponentName}</span>
            <OpponentStatus status={opponentStatus} />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={myStatus === 'waiting'
              ? handleRematch
              : undefined}
            disabled={myStatus !== 'waiting'}
            className={rematchButtonClass}
          >
            <span className={cn(
              'text-lg font-medium',
              myStatus === 'waiting' && 'text-black group-hover:text-white',
            )}
            >
              {rematchButtonLabel}
            </span>
          </button>
          <button
            onClick={handleQuit}
            className="text-sm text-gray-500 hover:text-black underline underline-offset-2"
          >
            Quit
          </button>
        </div>
      </m.div>
    </div>
  )
}
