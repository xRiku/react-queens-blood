import { CardInfo } from '../@types/Card'
import useCardStore from '../store/CardStore'
import Card from './Card'
import useHandStore from '../store/HandStore'
import useTurnStore from '../store/TurnStore'

type Hand = {
  cards: CardInfo[]
}

export default function Hand() {
  const [playerOneCards, playerTwoCards] = useHandStore((state) => [
    state.playerOneCards,
    state.playerTwoCards,
  ])
  const [selectedCard, setSelectedCard] = useCardStore((state) => [
    state.selectedCard,
    state.setSelectedCard,
  ])

  const [isPlayerOneTurn] = useTurnStore((state) => [state.isPlayerOneTurn])

  return (
    <div className="flex w-full items-center justify-center py-8">
      <div></div>
      <div className="flex flex-row gap-3 w-10/12">
        {isPlayerOneTurn
          ? playerOneCards.map((card, index) => (
              <div
                className={`border-2 border-solid shadow-lg rounded-lg cursor-pointer ${
                  selectedCard?.name === card.name
                    ? 'border-green-400 -translate-y-8 transform '
                    : 'border-black'
                } h-72 w-60
             transition duration-300 ease-in-out hover:-translate-y-8 hover:transform`}
                key={index}
                onClick={
                  selectedCard?.name === card.name
                    ? () => setSelectedCard(null)
                    : () => setSelectedCard(card)
                }
              >
                <Card card={card} />
              </div>
            ))
          : playerTwoCards.map((card, index) => (
              <div
                className={`border-2 border-solid shadow-lg rounded-lg cursor-pointer ${
                  selectedCard?.name === card.name
                    ? 'border-green-400 -translate-y-8 transform '
                    : 'border-black'
                } h-72 w-60
             transition duration-300 ease-in-out hover:-translate-y-8 hover:transform`}
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
