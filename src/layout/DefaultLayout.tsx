import { Outlet, useNavigate } from "react-router-dom";


export default function DefaultLayout() {

  const navigate = useNavigate()

  const handleTitleClick = () => {
    navigate('/')
  }

  return (
    <div className="vh-100 vw-100 overflow-x-hidden">
      <div className="flex flex-col justify-center items-center mt-16 h-full w-full gap-96">
        <h1 className="font-semibold text-8xl hover:cursor-pointer" onClick={handleTitleClick}>Queen's Blood</h1>
        <Outlet />
      </div>
    </div>
  )
}