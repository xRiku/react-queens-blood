import { CardInfo } from '../@types/Card'
import useCardStore from '../store/CardStore'
import Card from './Card'
import useNeoHandStore from '../store/NeoHandStore'
import { AnimatePresence, motion } from 'framer-motion'

type Hand = {
  cards: CardInfo[]
}

export default function Hand() {
  const [playerCards] = useNeoHandStore((state) => [
    state.playerCards
  ])
  const [selectedCard, setSelectedCard] = useCardStore((state) => [
    state.selectedCard,
    state.setSelectedCard,
  ])

  return (
    <ul className="flex flex-wrap flex-row h-auto items-start justify-start w-full pt-2 pb-5 px-[4rem] gap-3" >
      <AnimatePresence initial={false}>
        {
          playerCards.map((card, index) => (
            <motion.li
              key={card.id}
              initial={{ opacity: 0, x: -200, y: 0 }}
              animate={{ x: 0, opacity: 1, y: selectedCard?.id === card?.id ? -32 : 0, transition: { duration: 0.0 } }}
              exit={{ opacity: 0, transition: { duration: 1 } }}
              className={`border-2 border-solid shadow-lg rounded-lg cursor-pointer ${selectedCard?.id === card?.id
                ? 'border-green-400 -translate-y-8 transform '
                : 'border-black'
                } h-60 w-52
                  transition duration-300 ease-in-out hover:-translate-y-8 hover:transform`}
              onClick={
                selectedCard?.name === card?.name
                  ? () => setSelectedCard(null)
                  : () => setSelectedCard(card)
              }
            >
              <Card card={card} />
            </motion.li>
          ))
        }
      </AnimatePresence>
    </ul>
  )
}
