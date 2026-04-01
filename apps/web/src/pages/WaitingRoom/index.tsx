import { useNavigate, useParams } from 'react-router-dom'
import socket from '../../socket'
import { useState } from 'react'
import { trackEvent } from '../../lib/analytics'

export function WaitingRoom() {
  const [playerName, setPlayerName] = useState<string>('')
  const navigate = useNavigate()
  const { id: gameId } = useParams<{ id: string }>()

  const handleJoinGame = () => {
    trackEvent('room_join_submitted')
    navigate(`/game/${gameId}`, { state: { joining: true } })
    socket.emit('join-game', {
      playerName,
      gameId,
    })
  }

  const handleChangePlayerNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value)
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm border border-gray-300 rounded-lg shadow-sm">
        <div className="flex flex-col items-center justify-center gap-6 p-8 sm:p-10">
          <h1 className="text-xl font-semibold text-gray-800">Join Game</h1>
          <input
            value={playerName}
            onChange={handleChangePlayerNameInput}
            className="w-full py-2.5 px-3 text-center text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Your name"
          />
          <button
            onClick={handleJoinGame}
            disabled={!playerName.trim()}
            className="w-full rounded-md px-4 py-2.5 border border-black text-black hover:bg-gray-700 hover:border-gray-700 hover:text-white active:translate-y-0.5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <span className="text-lg font-medium">Join</span>
          </button>
        </div>
      </div>
    </div>
  )
}
