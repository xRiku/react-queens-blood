import { Outlet, useNavigate } from "react-router-dom";
import socket from "../socket";
import useBoardStore from "../store/BoardStore";
import { useGameStore } from "../store/GameStore";
import { useModalStore } from "../store/ModalStore";
import { usePointStore } from "../store/PointsStore";
import useTurnStore from "../store/TurnStore";
import useNeoHandStore from "../store/NeoHandStore";
import useSoundStore from "../store/SoundStore";



export default function DefaultLayout() {

  const navigate = useNavigate()
  const [resetBoardStore] = useBoardStore((state) => [state.resetStore])
  const [resetGameStore] = useGameStore((state) => [state.resetStore])
  const [resetPointsStore] = usePointStore((state) => [state.resetStore])
  const [resetTurnStore] = useTurnStore((state) => [state.resetStore])
  const [resetModalStore] = useModalStore((state) => [state.resetStore])
  const [resetNeoHandStore] = useNeoHandStore((state) => [state.resetStore])
  const [muted, toggleMute] = useSoundStore((state) => [state.muted, state.toggleMute])


  const resetAllStores = () => {
    resetBoardStore()
    resetGameStore()
    resetPointsStore()
    resetTurnStore()
    resetModalStore()
    resetNeoHandStore()
  }


  const handleTitleClick = () => {
    socket.disconnect()
    resetAllStores()
    navigate('/')
  }




  return (
    <div className="h-full overflow-x-hidden overflow-y-hidden">
      <div className="flex flex-col justify-center items-center mt-2 h-full w-full">
        <div className="flex items-center gap-4 z-50">
          <h1 className="font-light text-5xl xl:text-6xl 2xl:text-7xl hover:cursor-pointer font-title" onClick={handleTitleClick}>Queen's Blood</h1>
          <button
            onClick={toggleMute}
            className="text-3xl xl:text-4xl 2xl:text-5xl hover:cursor-pointer hover:scale-110 transition-transform"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  )
}