import { Outlet, useNavigate } from "react-router-dom";
import socket from "../socket";
import useBoardStore from "../store/BoardStore";
import { useGameStore } from "../store/GameStore";
import { useModalStore } from "../store/ModalStore";
import { usePointStore } from "../store/PointsStore";
import useTurnStore from "../store/TurnStore";
import useNeoHandStore from "../store/NeoHandStore";
import useSoundStore from "../store/SoundStore";
import { Volume2, VolumeOff } from "lucide-react";



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
    <div className="h-full overflow-x-hidden overflow-y-hidden relative">
      <button
        onClick={toggleMute}
        className="absolute top-4 right-6 z-50 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
        title={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeOff size={24} /> : <Volume2 size={24} />}
      </button>
      <div className="flex flex-col justify-center items-center mt-2 h-full w-full">
        <h1 className="font-light z-50 text-5xl xl:text-6xl 2xl:text-7xl hover:cursor-pointer font-title" onClick={handleTitleClick}>Queen's Blood</h1>
        <Outlet />
      </div>
    </div>
  )
}