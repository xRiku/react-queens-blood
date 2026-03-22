import useCardStore from '../store/CardStore'
import { useGameStore } from '../store/GameStore'
import { AnimatePresence, motion } from 'framer-motion'
import useTurnStore from '../store/TurnStore'
import { usePlaceCard } from '../hooks/usePlaceCard'
import { useIsMobile } from '../hooks/useIsMobile'

export default function PlaceCardButton() {
  const [isMyTurn] = useTurnStore((state) => [state.isMyTurn])
  const [selectedCard, previewTile] = useCardStore((state) => [
    state.selectedCard,
    state.previewTile,
  ])
  const [gameOver] = useGameStore((state) => [state.gameOver])
  const { confirmPlacement } = usePlaceCard()
  const isMobile = useIsMobile()

  const shouldShow = isMobile && isMyTurn && !gameOver && selectedCard && previewTile

  function handlePlaceCard() {
    if (!previewTile) return
    confirmPlacement(previewTile[0], previewTile[1])
  }

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-lg md:text-2xl rounded-full bg-green-500 hover:bg-green-600 transition duration-200
            shadow-xl cursor-pointer text-white border-4 border-yellow-400 py-1 px-6"
          onClick={handlePlaceCard}
        >
          Place card
        </motion.span>
      )}
    </AnimatePresence>
  )
}
