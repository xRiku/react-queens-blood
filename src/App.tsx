import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import DefaultLayout from './layout/DefaultLayout'
import CreateGame from './pages/CreateGame'
import Game from './pages/Game'

function App() {
  return (

    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/creating-game" element={<CreateGame />} />
        <Route path='/game' element={<Game />} />
      </Route>
    </Routes>
  )
}

export default App
