import { CardUnity } from '../@types/Card'
import { useState } from 'react'
import useCardStore from '../store/CardStore'
import Card from './Card'
import CardDetailPanel from './CardDetailPanel'
import useNeoHandStore from '../store/NeoHandStore'
import { AnimatePresence, m } from 'framer-motion'
import hoverSound from '../assets/sounds/hover.wav'
import flickSound from '../assets/sounds/cardflick.mp3'
import { playSound } from '../store/SoundStore'
import { cn } from '../utils/cn'
import { useIsMobile } from '../hooks/useIsMobile'
import { useHaptics } from '../hooks/useHaptics'

const flickAudio = new Audio(flickSound)
const hoverAudio = new Audio(hoverSound)

export default function Hand() {
  const playerCards = useNeoHandStore((state) => state.playerCards)
  const selectedCard = useCardStore((state) => state.selectedCard)
  const setSelectedCard = useCardStore((state) => state.setSelectedCard)
  const isMobile = useIsMobile()
  const haptics = useHaptics()
  const [hoveredCard, setHoveredCard] = useState<CardUnity | null>(null)
  const inspectedCard = isMobile
    ? null
    : hoveredCard

  const handleCardClick = (card: CardUnity) => {
    setHoveredCard(null)

    if (selectedCard?.id === card.id) {
      haptics.impactLight()
      setSelectedCard(null)
      return
    }

    haptics.impactLight()
    setSelectedCard(card)
    playSound(flickAudio, 0.4)
  }

  const handleHoverStart = (card: CardUnity) => {
    if (selectedCard?.id === card.id) {
      setHoveredCard(null)
      return
    }

    setHoveredCard(card)
    playSound(hoverAudio, 0.2)
  }

  const handleHoverEnd = (card: CardUnity) => {
    setHoveredCard((current) => current?.id === card.id
      ? null
      : current)
  }

  return (
    <div className="relative w-full">
      <AnimatePresence>
        {inspectedCard
          ? (
            <m.div
              key={inspectedCard.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className={cn(
                'pointer-events-none z-30 px-4 md:px-8 xl:px-12 2xl:px-16',
                isMobile
                  ? 'mb-2'
                  : 'absolute bottom-full left-0 mb-3 max-w-md',
              )}
            >
              <CardDetailPanel card={inspectedCard} compact />
            </m.div>
            )
          : null}
      </AnimatePresence>

      <m.ul
        className={cn(
          'h-auto w-full gap-3',
          isMobile
            ? 'grid grid-cols-4 px-4 pb-5 pt-0'
            : 'flex flex-row flex-wrap items-start justify-start px-8 xl:px-12 2xl:px-16 pt-2 pb-5',
        )}
        animate={{ transition: { staggerChildren: 0.5 } }}
      >
        <AnimatePresence>
          {
            playerCards.map((card) => (
              <m.li
                key={card.id}
                initial={{
                  opacity: 0,
                  x: isMobile
                    ? 0
                    : -200,
                  y: isMobile
                    ? -50
                    : 0,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  y: !isMobile && selectedCard?.id === card?.id
                    ? -32
                    : 0,
                  scale: isMobile && selectedCard?.id === card?.id
                    ? 1.05
                    : 1,
                  transition: { duration: 0.0 },
                }}
                exit={{ opacity: 0, transition: { duration: 1 } }}
                className={cn(
                  'border-2 border-solid shadow-lg rounded-lg cursor-pointer md:transition md:duration-300 md:ease-in-out',
                  isMobile
                    ? 'h-36 w-full'
                    : 'h-44 w-36 xl:h-52 xl:w-44 2xl:h-60 2xl:w-52 hover:-translate-y-8 hover:transform',
                  selectedCard?.id === card?.id
                    ? cn('border-green-400', !isMobile && '-translate-y-8 transform')
                    : 'border-black hover:scale-105 hover:duration-100 hover:border-blue-500',
                )}
                role="button"
                tabIndex={0}
                aria-label={`${card.name}. ${card.description}`}
                onHoverStart={() => handleHoverStart(card)}
                onHoverEnd={() => handleHoverEnd(card)}
                onFocus={() => handleHoverStart(card)}
                onBlur={() => handleHoverEnd(card)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleCardClick(card)
                  }
                }}
                onClick={
                  () => handleCardClick(card)
                }
              >
                <Card card={card} />
              </m.li>
            ))
          }
        </AnimatePresence>
      </m.ul>
    </div>
  )
}
