import { useNavigate } from 'react-router-dom'
import socket from '../../socket'
import { useEffect, useState } from 'react'
export default function Home() {
  const navigate = useNavigate()
  const [playerName, setPlayerName] = useState<string>('')
  const [gameId, setGameId] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    socket.on('game-busy', () => {
      setErrorMessage('Game is busy')
    })

    socket.on('game-not-found', () => {
      setErrorMessage('Game not found')
    })

    socket.on('game-found', (data: {
      gameIdFound: string
    }) => {
      navigate(`/waiting-room/${data.gameIdFound}`)
    })

    return () => {
      socket.off('game-found')
      socket.off('game-not-found')
      socket.off('game-busy')
    }
  }, [])

  const handleStartGame = () => {
    const randomGameId = window.crypto.randomUUID()
    navigate(`/game/${randomGameId}`)
    socket.connect()
    socket.emit('start-game-info', {
      playerName,
      gameId: randomGameId
    })
  }

  const handleStartBotGame = () => {
    const randomGameId = window.crypto.randomUUID()
    navigate(`/game/${randomGameId}?bot=true`)
    socket.connect()
    socket.emit('start-bot-game', {
      playerName: playerName || 'Player',
      gameId: randomGameId
    })
  }

  const handleJoinGame = () => {
    socket.connect()
    socket.emit('attempt-to-join-game', {
      gameId
    })
  }

  const handleChangePlayerNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value)
  }


  const handleChangeGameIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameId(e.target.value)
  }


  return (
    <div className="flex flex-col items-center justify-center mt-24 xl:mt-36 2xl:mt-48 gap-5">
      <div className="flex flex-row items-stretch justify-center w-1/3 gap-5">
      <div className="border border-black border-solid-2 rounded-lg">
        <div className="flex flex-col items-center justify-center gap-6 p-10 ">
          <input value={gameId} onChange={handleChangeGameIdInput} className="text-sm w-72 py-2 px-1 text-center border border-solid-1 border-gray-400 rounded-md" placeholder="Game ID" />


          <button
            onClick={handleJoinGame}
            className="rounded-md w-72 px-4 py-2 border text-black border-black hover:bg-gray-700 hover:border-gray-700 group active:translate-y-2"
          >
            <span className="text-2xl font-medium text-black group-hover:text-white">Join Game {true}</span>
          </button>
        </div>
        {!!errorMessage && <span className='text-red-500'>
          {errorMessage}
        </span>
        }
      </div>
      <div className="border border-black border-solid-2 rounded-lg ">
        <div className="flex flex-col items-center justify-center gap-6 p-10">
          <input value={playerName} onChange={handleChangePlayerNameInput} className="text-sm w-72 py-2 px-1 text-center border border-solid-1 border-gray-400 rounded-md" placeholder="Your name" />
          <button
            onClick={handleStartGame}
            className="rounded-md w-72 px-4 py-2 border text-black border-black hover:bg-gray-700 hover:border-gray-700 group active:translate-y-2"
          >
            <span className="text-2xl font-medium text-black group-hover:text-white">Start Game</span>
          </button>
          <button
            onClick={handleStartBotGame}
            className="rounded-md w-72 px-4 py-2 border text-black border-black hover:bg-gray-700 hover:border-gray-700 group active:translate-y-2"
          >
            <span className="text-2xl font-medium text-black group-hover:text-white">Play vs Bot</span>
          </button>
        </div>
      </div>
      </div>
      <div className="flex gap-4 mt-2">
        <button
          onClick={() => navigate('/rules')}
          className="text-sm xl:text-base text-gray-500 hover:text-black underline underline-offset-2"
        >
          How to Play
        </button>
        <button
          onClick={() => navigate('/deck')}
          className="text-sm xl:text-base text-gray-500 hover:text-black underline underline-offset-2"
        >
          View Deck
        </button>
      </div>
    </div>

  )
}
