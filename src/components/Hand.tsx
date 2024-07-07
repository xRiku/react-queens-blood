import { CardInfo, CardUnity } from '../@types/Card'
import useCardStore from '../store/CardStore'
import Card from './Card'
import useNeoHandStore from '../store/NeoHandStore'
import { AnimatePresence, motion } from 'framer-motion'
import hoverSound from '../assets/sounds/hover.wav'
import flickSound from '../assets/sounds/cardflick.mp3'

type Hand = {
  cards: CardUnity[]
}

const flickAudio = new Audio(flickSound)
const hoverAudio = new Audio(hoverSound)


export default function Hand() {
  const [playerCards] = useNeoHandStore((state) => [
    state.playerCards
  ])
  const [selectedCard, setSelectedCard] = useCardStore((state) => [
    state.selectedCard,
    state.setSelectedCard,
  ])


  const handleCardClick = (card: CardUnity) => {
    if (selectedCard?.id === card.id) {
      setSelectedCard(null)
      return;
    }

    setSelectedCard(card)
    flickAudio.pause()
    flickAudio.currentTime = 0
    flickAudio.volume = 0.4
    flickAudio.play()
  }

  const handleHoverStart = (card: CardUnity) => {
    if (selectedCard?.id !== card.id) {
      hoverAudio.pause()
      hoverAudio.currentTime = 0
      hoverAudio.volume = 0.2
      hoverAudio.play()

    }
  }


  return (
    <motion.ul className="flex flex-wrap flex-row h-auto items-start justify-start w-full pt-2 pb-5 px-[4rem] gap-3" animate={{ transition: { staggerChildren: 0.5 } }}>
      <AnimatePresence>
        {
          playerCards.map((card, index) => (
            <motion.li
              key={card.id}
              initial={{ opacity: 0, x: -200, y: 0 }}
              animate={{ x: 0, opacity: 1, y: selectedCard?.id === card?.id ? -32 : 0, transition: { duration: 0.0 } }}
              exit={{ opacity: 0, transition: { duration: 1 } }}
              className={`border-2 border-solid shadow-lg rounded-lg cursor-pointer ${selectedCard?.id === card?.id
                ? 'border-green-400 -translate-y-8 transform '
                : 'border-black hover:scale-105 hover:duration-100 hover:border-blue-500'
                } h-60 w-52
                  transition duration-300 ease-in-out hover:-translate-y-8 hover:transform`}
              onHoverStart={() => handleHoverStart(card)}
              onClick={
                () => handleCardClick(card)
              }
            >
              <Card card={card} />
            </motion.li>
          ))
        }
      </AnimatePresence>
    </motion.ul>
  )
}
