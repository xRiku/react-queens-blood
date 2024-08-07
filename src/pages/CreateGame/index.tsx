import { v4 as uuidv4 } from 'uuid';

const gameCode = uuidv4().split('-')[0]

export default function CreateGame() {

  const selectPlayerOneRole = () => {


  }

  return (
    <div className='flex flex-col items-baseline justify-center w-1/3 mt-44 gap-10'>
      <div className="flex flex-col">
        <h2 className='font-medium text-xl'>Game Code</h2>
        <h1 className='font-semibold text-6xl' >{gameCode}</h1>
      </div>
      <div>
        <h1>Select your role in this game:</h1>
        <h1 onClick={selectPlayerOneRole}>Player One</h1>
        <h1>Player Two</h1>
        <h1>Spectator</h1>
      </div>
    </div>
  )
}