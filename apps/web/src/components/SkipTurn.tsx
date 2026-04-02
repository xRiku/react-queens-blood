import socket from '../socket'
import useCardStore from '../store/CardStore'
import { useGameStore } from '../store/GameStore'
import { AnimatePresence, m } from 'framer-motion'
import useTurnStore from '../store/TurnStore'
import { useParams } from 'react-router-dom'
import { useBotGameActions } from '../contexts/BotGameContext'
import { useShallow } from 'zustand/react/shallow'
import { useHaptics } from '../hooks/useHaptics'

export default function SkipTurn() {
  const { isMyTurn, playerSkippedTurn } = useTurnStore(useShallow((state) => ({ isMyTurn: state.isMyTurn, playerSkippedTurn: state.playerSkippedTurn })))
  const botActions = useBotGameActions()
  const haptics = useHaptics()

  const resetSelectedCard = useCardStore((state) => state.resetSelectedCard)

  const gameOver = useGameStore((state) => state.gameOver)

  const { id: gameId } = useParams<{ id: string }>()

  function handleSkipTurn() {
    haptics.impactMedium()
    resetSelectedCard()
    if (botActions) {
      botActions.skipTurn()
      return
    }
    socket.emit('skip-turn', { gameId })
  }

  return (
    <AnimatePresence>
      {isMyTurn && !gameOver && (
        <m.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`text-lg md:text-2xl xl:text-3xl 2xl:text-4xl rounded-full bg-gray-50 hover:bg-gray-200
        shadow-xl cursor-pointer text-black border-4 border-yellow-400 py-1 px-4 md:px-8 xl:px-10 2xl:px-12`}
          onClick={handleSkipTurn}
        >
          {playerSkippedTurn
            ? 'End game'
            : 'Skip turn'}
        </m.span>
      )}
    </AnimatePresence>
  )
}
