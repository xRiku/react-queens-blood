import { Route, Routes } from 'react-router-dom'
import { LazyMotion, MotionConfig } from 'framer-motion'
import Home from './pages/Home'
import DefaultLayout from './layout/DefaultLayout'
import Game from './pages/Game'
import { WaitingRoom } from './pages/WaitingRoom'
import Rules from './pages/Rules'
import Cards from './pages/Cards'
import DeckBuilder from './pages/DeckBuilder'
import PatchNotes from './pages/PatchNotes'

const loadFeatures = () => import('framer-motion').then(mod => mod.domAnimation)

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/deck-builder" element={<DeckBuilder />} />
            <Route path="/patch-notes" element={<PatchNotes />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="/waiting-room/:id" element={<WaitingRoom />} />
          </Route>
        </Routes>
      </LazyMotion>
    </MotionConfig>
  )
}

export default App
