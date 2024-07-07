import { Outlet, useNavigate } from "react-router-dom";
import socket from "../socket";
import useBoardStore from "../store/BoardStore";
import { useGameStore } from "../store/GameStore";
import { useModalStore } from "../store/ModalStore";
import { usePointStore } from "../store/PointsStore";
import useTurnStore from "../store/TurnStore";



export default function DefaultLayout() {

  const navigate = useNavigate()
  const [resetBoardStore] = useBoardStore((state) => [state.resetStore])
  const [resetGameStore] = useGameStore((state) => [state.resetStore])
  const [resetPointsStore] = usePointStore((state) => [state.resetStore])
  const [resetTurnStore] = useTurnStore((state) => [state.resetStore])
  const [resetModalStore] = useModalStore((state) => [state.resetStore])


  const resetAllStores = () => {
    resetBoardStore()
    resetGameStore()
    resetPointsStore()
    resetTurnStore()
    resetModalStore()
  }


  const handleTitleClick = () => {
    socket.disconnect()
    resetAllStores()
    navigate('/')
  }




  return (
    <div className="h-full overflow-x-hidden overflow-y-hidden">
      <div className="flex flex-col justify-center items-center mt-2 h-full w-full">
        <h1 className="font-light z-50 text-5xl hover:cursor-pointer font-title" onClick={handleTitleClick}>Queen's Blood</h1>
        <Outlet />
      </div>
    </div>
  )
}