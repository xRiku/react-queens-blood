import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import DefaultLayout from './layout/DefaultLayout'
import CreateGame from './pages/CreateGame'
import Game from './pages/Game'
import { WaitingRoom } from './pages/WaitingRoom'
import Rules from './pages/Rules'
import Cards from './pages/Cards'
import DeckBuilder from './pages/DeckBuilder'

function App() {
  return (

    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/deck-builder" element={<DeckBuilder />} />
        <Route path="/creating-game" element={<CreateGame />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/waiting-room/:id" element={<WaitingRoom />} />
      </Route>
    </Routes>
  )
}

export default App
