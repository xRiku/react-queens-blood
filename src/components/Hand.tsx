import { CardInfo } from '../@types/Card'
import useCardStore from '../store/CardStore'
import Card from './Card'

type Hand = {
  cards: CardInfo[]
}

export default function Hand() {
  const [selectedCard, setSelectedCard] = useCardStore((state) => [
    state.selectedCard,
    state.setSelectedCard,
  ])

  const hand: Hand = {
    cards: [
      {
        name: 'Monster',
        pawnsPositions: [
          [1, 0],
          [0, 1],
        ],
        points: 2,
        pawnsCost: 1,
      },
      {
        name: 'Soldier',
        pawnsPositions: [
          [0, 1],
          [1, 0],
          [-1, 0],
          [0, -1],
        ],
        points: 1,
        pawnsCost: 1,
      },
    ],
  }

  return (
    <div className="flex w-full items-center justify-center mt-10 ">
      <div className="flex flex-row gap-3 w-10/12">
        {hand.cards.map((card, index) => (
          <div
            className={`border-2 border-solid shadow-2xl rounded-lg cursor-pointer ${selectedCard?.name === card.name ? 'border-green-400' : 'border-black'} h-72 w-60
             transition duration-300 ease-in-out hover:-translate-y-4 hover:transform`}
            key={index}
            onClick={
              selectedCard?.name === card.name
                ? () => setSelectedCard(null)
                : () => setSelectedCard(card)
            }
          >
            <Card card={card} />
          </div>
        ))}
      </div>
    </div>
  )
}
