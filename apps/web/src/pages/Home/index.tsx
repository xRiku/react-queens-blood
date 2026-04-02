import { useNavigate } from 'react-router-dom'
import socket, { connectSocket } from '../../socket'
import { useEffect, useState } from 'react'
import { useServerHealth } from '../../hooks/useServerHealth'
import { trackEvent } from '../../lib/analytics'
import { useHaptics } from '../../hooks/useHaptics'

export default function Home() {
  const navigate = useNavigate()
  const [playerName, setPlayerName] = useState<string>('')
  const [gameId, setGameId] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [connecting, setConnecting] = useState(false)
  const { isOnline } = useServerHealth()
  const multiplayerDisabled = connecting || !isOnline
  const haptics = useHaptics()

  useEffect(() => {
    socket.on('game-busy', () => {
      haptics.error()
      setErrorMessage('Game is busy')
    })

    socket.on('game-not-found', () => {
      haptics.error()
      setErrorMessage('Game not found')
    })

    socket.on('game-found', (data: { gameIdFound: string }) => {
      haptics.success()
      navigate(`/waiting-room/${data.gameIdFound}`)
    })

    socket.on('game-created', (data: { gameId: string }) => {
      haptics.success()
      navigate(`/game/${data.gameId}`)
    })

    return () => {
      socket.off('game-found')
      socket.off('game-not-found')
      socket.off('game-busy')
      socket.off('game-created')
    }
  }, [haptics, navigate])

  const handleStartGame = async () => {
    if (!playerName.trim()) {
      haptics.error()
      setErrorMessage('Please enter your name')
      return
    }
    setErrorMessage('')
    setConnecting(true)
    try {
      await connectSocket()
      trackEvent('room_created')
      socket.emit('create-game', { playerName: playerName.trim() })
    } catch {
      haptics.error()
      setErrorMessage('Could not connect to server. Please try again.')
    } finally {
      setConnecting(false)
    }
  }

  const handleStartBotGame = () => {
    haptics.impactMedium()
    navigate('/game/bot', {
      state: { playerName: playerName || 'Player' },
    })
  }

  const handleJoinGame = async () => {
    setErrorMessage('')
    setConnecting(true)
    try {
      await connectSocket()
      trackEvent('room_join_attempted', { game_id_length: gameId.trim().length })
      socket.emit('attempt-to-join-game', { gameId })
    } catch {
      haptics.error()
      setErrorMessage('Could not connect to server. Please try again.')
    } finally {
      setConnecting(false)
    }
  }

  const handleChangePlayerNameInput = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPlayerName(e.target.value)
  }

  const handleChangeGameIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameId(e.target.value)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] min-[480px]:min-h-0 min-[480px]:mt-24 xl:mt-36 2xl:mt-48 gap-6 px-4 min-[480px]:px-0 w-full max-w-sm mx-auto">
      <div className="flex flex-row max-[479px]:flex-col gap-2 w-full">
        <input
          value={playerName}
          onChange={handleChangePlayerNameInput}
          className="text-sm xl:text-base flex-1 min-w-0 w-full py-2 px-3 text-center border border-gray-400 rounded-md"
          placeholder="Your name"
        />
        <button
          onClick={handleStartGame}
          disabled={multiplayerDisabled}
          className="rounded-md px-5 py-2 border text-black border-black hover:bg-gray-700 hover:border-gray-700 group active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed w-auto max-[479px]:w-full shrink-0"
        >
          <span className="text-base font-medium text-black group-hover:text-white whitespace-nowrap">
            Create Room
          </span>
        </button>
      </div>

      <button
        onClick={handleStartBotGame}
        className="rounded-md w-full px-4 py-2 border text-black border-black hover:bg-gray-700 hover:border-gray-700 group active:translate-y-0.5"
      >
        <span className="text-base font-medium text-black group-hover:text-white">
          Play vs Bot
        </span>
      </button>

      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-xs text-gray-400 uppercase tracking-wider">
          or join
        </span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      <div className="flex flex-row max-[479px]:flex-col gap-2 w-full">
        <input
          value={gameId}
          onChange={handleChangeGameIdInput}
          className="text-sm flex-1 min-w-0 w-full py-2 px-3 text-center border border-gray-400 rounded-md"
          placeholder="Game Code"
          maxLength={6}
          inputMode="numeric"
        />
        <button
          onClick={handleJoinGame}
          disabled={multiplayerDisabled}
          className="rounded-md px-5 py-2 border text-black border-black hover:bg-gray-700 hover:border-gray-700 group active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed w-auto max-[479px]:w-full shrink-0"
        >
          <span className="text-base font-medium text-black group-hover:text-white">
            Join
          </span>
        </button>
      </div>
      <span className="text-sm h-5">
        {connecting && (
          <span className="text-gray-500 animate-pulse">
            Connecting to server...
          </span>
        )}
        {!!errorMessage && !connecting && (
          <span className="text-red-500">{errorMessage}</span>
        )}
      </span>

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-2 w-full">
        <button
          onClick={() => navigate('/rules')}
          className="text-sm xl:text-base text-gray-500 hover:text-black underline underline-offset-2"
        >
          How to Play
        </button>
        <button
          onClick={() => navigate('/cards')}
          className="text-sm xl:text-base text-gray-500 hover:text-black underline underline-offset-2"
        >
          All Cards
        </button>
        <button
          onClick={() => navigate('/deck-builder')}
          className="text-sm xl:text-base text-gray-500 hover:text-black underline underline-offset-2"
        >
          Deck Builder
        </button>
        <button
          onClick={() => navigate('/patch-notes')}
          className="text-sm xl:text-base text-gray-500 hover:text-black underline underline-offset-2"
        >
          Patch Notes
        </button>
      </div>
    </div>
  )
}
