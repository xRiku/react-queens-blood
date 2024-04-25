import { Route, Routes } from 'react-router-dom'
import Board from './components/Board'
import Hand from './components/Hand'
import Home from './pages/Home'
import JoinGame from './pages/JoinGame'

function App() {
  return (
    // <div className="vh-100 vw-100 overflow-x-hidden">
    //   <Board />
    //   <Hand />
    // </div>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/join" element={<JoinGame />} />
    </Routes>
  )
}

export default App
