import { Route, Routes } from 'react-router-dom'
import Board from './components/Board'
import Hand from './components/Hand'
import Home from './pages/Home'
import JoinGame from './pages/JoinGame'
import DefaultLayout from './layout/DefaultLayout'
import CreateGame from './pages/CreateGame'

function App() {

  function Game() {
    return (
      <div className="vh-100 vw-100 overflow-x-hidden w-full">
        <Board />
        <Hand />
      </div>
    )
  }

  return (

    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<JoinGame />} />
        <Route path="/creating-game" element={<CreateGame />} />
        <Route path='/game' element={<Game />} />
      </Route>
    </Routes>
  )
}

export default App
