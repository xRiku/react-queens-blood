import socket from "../socket"
import useBoardStore from "../store/BoardStore"
import useCardStore from "../store/CardStore"
import { useGameStore } from "../store/GameStore"
import { AnimatePresence, motion } from 'framer-motion'
import useTurnStore from "../store/TurnStore"


export default function SkipTurn() {
  const [tiles] = useBoardStore((state) => [
    state.board,
  ])

  const [isMyTurn, playerSkippedTurn] = useTurnStore((state) => [state.isMyTurn, state.playerSkippedTurn])

  const [resetSelectedCard] = useCardStore((state) => [
    state.resetSelectedCard,
  ])

  const [gameOver] = useGameStore((state) => [state.gameOver, state.amIP1])


  function handleSkipTurn() {
    resetSelectedCard()
    socket.emit('skip-turn', tiles)
  }

  return (
    <div className="flex w-11/12 items-center justify-end p-2 h-20">
      <AnimatePresence>
        {isMyTurn && !gameOver && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`mr-8 text-4xl rounded-full bg-gray-50 hover:bg-gray-200 transition duration-200
        shadow-xl cursor-pointer  text-black border-4 border-yellow-400 py-1 px-12`}
            onClick={handleSkipTurn}
          >
            {playerSkippedTurn ? 'End game' : 'Skip turn'}
          </motion.span>
        )
        }
      </AnimatePresence>
    </div>
  )
}