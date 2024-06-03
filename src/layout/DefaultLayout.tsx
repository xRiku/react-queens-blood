import { Outlet, useNavigate } from "react-router-dom";



export default function DefaultLayout() {

  const navigate = useNavigate()

  const handleTitleClick = () => {
    navigate('/')
  }




  return (
    <div className="vh-100 vw-100 overflow-x-hidden">
      <div className="flex flex-col justify-center items-center mt-2 h-full w-full">
        <h1 className="font-light text-7xl hover:cursor-pointer font-title" onClick={handleTitleClick}>Queen's Blood</h1>
        <Outlet />
      </div>
    </div>
  )
}