export default function JoinGame() {
  const handleJoinGameClick = () => {
    console.log('Join game clicked')
  }

  return (
    <div className="vh-100 vw-100 overflow-x-hidden">
      <div className="flex flex-col justify-center items-center mt-16 h-full w-full gap-96">
        <h1 className="font-semibold text-8xl">{"Queen's Blood"}</h1>
        <div className="flex flex-row items-baseline justify-center w-1/3 ">
          <div className="border border-black border-solid-2 rounded-lg ">
            <div className="flex flex-col items-center justify-center gap-6 p-10">

              <input className="text-2xl w-72 py-2 px-3 text-center border border-solid-1 border-gray-400 rounded-md" placeholder="Enter game code" />
              <button
                className=" bg-gray-700 rounded-md w-72 px-4 py-2 shadow-join-room-button hover:shadow-transparent hover:translate-y-[5px]
                " onClick={handleJoinGameClick}
              >
                <span className="text-2xl font-semibold text-slate-50">Join game</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
