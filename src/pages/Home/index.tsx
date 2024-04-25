import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const handleJoinGameClick = () => {
    navigate('/join')
  }

  return (
    <div className="vh-100 vw-100 overflow-x-hidden">
      <div className="flex flex-col justify-center items-center mt-16 h-full w-full gap-44">
        <h1 className="font-semibold text-8xl">Queen's Blood</h1>
        <div className="flex flex-row items-baseline justify-between w-1/3 ">
          <button className="hover:underline text-2xl">Create a game</button>
          <button
            className="hover:underline text-2xl"
            onClick={handleJoinGameClick}
          >
            Join game
          </button>
        </div>
      </div>
    </div>
  )
}
