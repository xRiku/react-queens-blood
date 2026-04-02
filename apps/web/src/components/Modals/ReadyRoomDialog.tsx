import { m } from 'framer-motion'
import { useGameStore, RematchStatus } from '../../store/GameStore'
import { useModalStore } from '../../store/ModalStore'
import socket from '../../socket'
import { useNavigate, useParams } from 'react-router-dom'
import Hourglass from '../Hourglass'
import { cn } from '../../utils/cn'
import { trackEvent } from '../../lib/analytics'
import { useHaptics } from '../../hooks/useHaptics'

function OpponentStatus({ status }: { status: RematchStatus }) {
  if (status === 'waiting') {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <Hourglass />
        <span>Waiting...</span>
      </div>
    )
  }
  if (status === 'confirmed') {
    return <span className="text-green-600 text-sm font-medium">Ready!</span>
  }
  return <span className="text-red-500 text-sm font-medium">Quit</span>
}

export function ReadyRoomDialog() {
  const navigate = useNavigate()
  const { id: gameId } = useParams<{ id: string }>()
  const [
    playerOneName,
    playerTwoName,
    playerOneReadyStatus,
    playerTwoReadyStatus,
    amIP1,
  ] = useGameStore((state) => [
    state.playerOneName,
    state.playerTwoName,
    state.playerOneReadyStatus,
    state.playerTwoReadyStatus,
    state.amIP1,
  ])
  const [hideReadyRoom] = useModalStore((state) => [state.hideReadyRoom])
  const haptics = useHaptics()

  const myName = amIP1
    ? playerOneName || 'Player 1'
    : playerTwoName || 'Player 2'
  const opponentName = amIP1
    ? playerTwoName || 'Player 2'
    : playerOneName || 'Player 1'

  const myStatus = amIP1 ? playerOneReadyStatus : playerTwoReadyStatus
  const opponentStatus = amIP1 ? playerTwoReadyStatus : playerOneReadyStatus

  const handleReady = () => {
    const response = myStatus === 'confirmed' ? 'waiting' : 'confirmed'
    if (response === 'confirmed') {
      haptics.success()
    } else {
      haptics.impactLight()
    }
    trackEvent('ready_room_response', { response })
    socket.emit('ready-respond', { gameId, response })
  }

  const handleQuit = () => {
    haptics.warning()
    trackEvent('ready_room_response', { response: 'refused' })
    socket.emit('ready-respond', { gameId, response: 'refused' })
    hideReadyRoom()
    socket.disconnect()
    navigate('/')
  }

  const readyButtonClass =
    myStatus === 'confirmed'
      ? 'rounded-md w-full px-4 py-2 bg-green-600 border border-green-600 text-white hover:bg-green-700 hover:border-green-700 active:translate-y-0.5 cursor-pointer'
      : 'rounded-md w-full px-4 py-2 border text-black border-black hover:bg-gray-700 hover:border-gray-700 group active:translate-y-0.5 cursor-pointer'

  const readyButtonLabel = myStatus === 'confirmed' ? '\u2713 Ready' : 'Ready'

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-black rounded-lg p-8 w-80"
      >
        <m.div
          initial={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col items-center mb-6"
        >
          <span className="text-lg font-medium">{myName}</span>
          <span className="text-gray-400 text-sm my-1">vs</span>
          <span className="text-lg font-medium">{opponentName}</span>
        </m.div>

        <div className="flex items-center justify-between mb-6">
          <span className="text-base">{opponentName}</span>
          <OpponentStatus status={opponentStatus} />
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleReady}
            className={readyButtonClass}
          >
            <span className={cn(
              'text-lg font-medium',
              myStatus === 'waiting' && 'text-black group-hover:text-white',
            )}>
              {readyButtonLabel}
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
