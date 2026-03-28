import { useNavigate } from 'react-router-dom'
import socket, { connectSocket } from '../../socket'
import { useEffect, useState } from 'react'
import { useServerHealth } from '../../hooks/useServerHealth'

export default function Home() {
  const navigate = useNavigate()
  const [playerName, setPlayerName] = useState<string>('')
  const [gameId, setGameId] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [connecting, setConnecting] = useState(false)
  const { isOnline } = useServerHealth()
  const multiplayerDisabled = connecting || !isOnline

  useEffect(() => {
    socket.on('game-busy', () => {
      setErrorMessage('Game is busy')
    })

    socket.on('game-not-found', () => {
      setErrorMessage('Game not found')
    })

    socket.on('game-found', (data: { gameIdFound: string }) => {
      navigate(`/waiting-room/${data.gameIdFound}`)
    })

    socket.on('game-created', (data: { gameId: string }) => {
      navigate(`/game/${data.gameId}`)
    })

    return () => {
      socket.off('game-found')
      socket.off('game-not-found')
      socket.off('game-busy')
      socket.off('game-created')
    }
  }, [])

  const handleStartGame = async () => {
    if (!playerName.trim()) {
      setErrorMessage('Please enter your name')
      return
    }
    setErrorMessage('')
    setConnecting(true)
    try {
      await connectSocket()
      socket.emit('create-game', { playerName: playerName.trim() })
    } catch {
      setErrorMessage('Could not connect to server. Please try again.')
    } finally {
      setConnecting(false)
    }
  }

  const handleStartBotGame = () => {
    navigate('/game/bot', {
      state: { playerName: playerName || 'Player' },
    })
  }

  const handleJoinGame = async () => {
    setErrorMessage('')
    setConnecting(true)
    try {
      await connectSocket()
      socket.emit('attempt-to-join-game', { gameId })
    } catch {
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] md:min-h-0 md:mt-24 xl:mt-36 2xl:mt-48 gap-6 px-6 sm:px-0 w-full sm:w-96 mx-auto">
      <div className="flex gap-2 w-full">
        <input
          value={playerName}
          onChange={handleChangePlayerNameInput}
          className="text-sm xl:text-base flex-1 py-2 px-3 text-center border border-gray-400 rounded-md"
          placeholder="Your name"
        />
        <button
          onClick={handleStartGame}
          disabled={multiplayerDisabled}
          className="rounded-md px-5 py-2 border text-black border-black hover:bg-gray-700 hover:border-gray-700 group active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
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

      <div className="flex gap-2 w-full">
        <input
          value={gameId}
          onChange={handleChangeGameIdInput}
          className="text-sm flex-1 py-2 px-3 text-center border border-gray-400 rounded-md"
          placeholder="Game Code"
          maxLength={6}
          inputMode="numeric"
        />
        <button
          onClick={handleJoinGame}
          disabled={multiplayerDisabled}
          className="rounded-md px-5 py-2 border text-black border-black hover:bg-gray-700 hover:border-gray-700 group active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
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

      <div className="flex gap-4 mt-2">
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
      </div>
    </div>
  )
}
