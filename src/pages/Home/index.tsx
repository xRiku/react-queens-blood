import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const handleJoinGameClick = () => {
    navigate('/join')
  }

  return (

    <div className="flex flex-row items-baseline justify-between w-1/3 ">
      <button className="hover:underline text-2xl">Create a game</button>
      <button
        className="hover:underline text-2xl"
        onClick={handleJoinGameClick}
      >
        Join game
      </button>
    </div>

  )
}
