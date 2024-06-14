import { Outlet, useNavigate } from "react-router-dom";
import socket from "../socket";



export default function DefaultLayout() {

  const navigate = useNavigate()

  const handleTitleClick = () => {
    socket.disconnect()
    navigate('/')
  }




  return (
    <div className="h-full overflow-x-hidden overflow-y-hidden">
      <div className="flex flex-col justify-center items-center mt-2 h-full w-full">
        <h1 className="font-light text-7xl hover:cursor-pointer font-title" onClick={handleTitleClick}>Queen's Blood</h1>
        <Outlet />
      </div>
    </div>
  )
}