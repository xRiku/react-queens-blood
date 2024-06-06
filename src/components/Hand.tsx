import { CardInfo } from '../@types/Card'
import useCardStore from '../store/CardStore'
import Card from './Card'
import useNeoHandStore from '../store/NeoHandStore'

type Hand = {
  cards: CardInfo[]
}

export default function Hand({
  isMyTurn
}: {
  isMyTurn: boolean
}) {
  const [playerCards] = useNeoHandStore((state) => [
    state.playerCards
  ])
  const [selectedCard, setSelectedCard] = useCardStore((state) => [
    state.selectedCard,
    state.setSelectedCard,
  ])

  return (
    <div className="flex w-full items-center justify-center py-2">
      <div className="flex flex-row gap-3 w-9/12">
        {
          playerCards.map((card, index) => (
            <div
              className={`border-2 border-solid shadow-lg rounded-lg cursor-pointer ${selectedCard?.name === card?.name
                ? 'border-green-400 -translate-y-8 transform '
                : 'border-black'
                } h-60 w-52
          transition duration-300 ease-in-out hover:-translate-y-8 hover:transform`}
              key={index}
              onClick={
                selectedCard?.name === card?.name
                  ? () => setSelectedCard(null)
                  : () => setSelectedCard(card)
              }
            >
              <Card card={card} />
            </div>
          ))
        }

      </div>
    </div>
  )
}
