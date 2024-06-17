import { useNavigate } from 'react-router-dom'
import socket from '../../socket'
import { useState } from 'react'

export default function Home() {
  const navigate = useNavigate()
  const [playerName, setPlayerName] = useState<string>('')

  const handleStartGame = () => {
    navigate('/game')
    socket.connect()
    socket.emit('player-name', playerName)
  }

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value)
  }


  return (
    <div className="flex flex-row items-center justify-center w-1/3 mt-48">
      <div className="border border-black border-solid-2 rounded-lg ">
        <div className="flex flex-col items-center justify-center gap-6 p-10">
          <input value={playerName} onChange={handleChangeInput} className="text-2xl w-72 py-2 px-3 text-center border border-solid-1 border-gray-400 rounded-md" placeholder="Your name" />
          <button
            onClick={handleStartGame}
            className="rounded-md w-72 px-4 py-2 border text-black border-black hover:bg-gray-700 hover:border-gray-700 group active:translate-y-2"
          >
            <span className="text-2xl font-medium text-black group-hover:text-white" >Start Game</span>
          </button>
        </div>
      </div>
    </div>

  )
}
