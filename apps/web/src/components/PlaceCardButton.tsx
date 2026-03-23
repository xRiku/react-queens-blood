import useCardStore from '../store/CardStore'
import { useGameStore } from '../store/GameStore'
import { AnimatePresence, m } from 'framer-motion'
import useTurnStore from '../store/TurnStore'
import { usePlaceCard } from '../hooks/usePlaceCard'
import { useIsMobile } from '../hooks/useIsMobile'
import { useShallow } from 'zustand/react/shallow'

export default function PlaceCardButton() {
  const isMyTurn = useTurnStore((state) => state.isMyTurn)
  const { selectedCard, previewTile } = useCardStore(useShallow((state) => ({
    selectedCard: state.selectedCard,
    previewTile: state.previewTile,
  })))
  const gameOver = useGameStore((state) => state.gameOver)
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
        <m.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-lg md:text-2xl rounded-full bg-green-500 hover:bg-green-600
            shadow-xl cursor-pointer text-white border-4 border-yellow-400 py-1 px-6"
          onClick={handlePlaceCard}
        >
          Place card
        </m.span>
      )}
    </AnimatePresence>
  )
}
