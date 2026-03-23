import { CardUnity } from '../@types/Card'
import useCardStore from '../store/CardStore'
import Card from './Card'
import useNeoHandStore from '../store/NeoHandStore'
import { AnimatePresence, m } from 'framer-motion'
import hoverSound from '../assets/sounds/hover.wav'
import flickSound from '../assets/sounds/cardflick.mp3'
import { playSound } from '../store/SoundStore'
import { cn } from '../utils/cn'
import { useIsMobile } from '../hooks/useIsMobile'

const flickAudio = new Audio(flickSound)
const hoverAudio = new Audio(hoverSound)

export default function Hand() {
  const playerCards = useNeoHandStore((state) => state.playerCards)
  const selectedCard = useCardStore((state) => state.selectedCard)
  const setSelectedCard = useCardStore((state) => state.setSelectedCard)
  const isMobile = useIsMobile()

  const handleCardClick = (card: CardUnity) => {
    if (selectedCard?.id === card.id) {
      setSelectedCard(null)
      return
    }

    setSelectedCard(card)
    playSound(flickAudio, 0.4)
  }

  const handleHoverStart = (card: CardUnity) => {
    if (selectedCard?.id !== card.id) {
      playSound(hoverAudio, 0.2)
    }
  }

  return (
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
              initial={{ opacity: 0, x: isMobile ? 0 : -200, y: isMobile ? -50 : 0 }}
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
              onHoverStart={() => handleHoverStart(card)}
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
  )
}
