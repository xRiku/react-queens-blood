import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const handleCreateGameClick = () => {
    navigate('/creating-game')
  }

  const handleJoinGameClick = () => {
    navigate('/join')
  }



  return (
    <div className="flex flex-row items-baseline justify-between w-1/3 mt-96">
      <button className="hover:underline text-2xl" onClick={handleCreateGameClick}>Create a game</button>
      <button
        className="hover:underline text-2xl"
        onClick={handleJoinGameClick}
      >
        Join game
      </button>
    </div>

  )
}
