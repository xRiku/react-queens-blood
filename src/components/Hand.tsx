import { CardInfo } from '../@types/Card'
import useCardStore from '../store/CardStore'
import Card from './Card'
import useHandStore from '../store/HandStore'
import useTurnStore from '../store/TurnStore'
import { usePlayerStore } from '../store/PlayerStore'
import TurnedCard from './TurnedCard'
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

  // const [isClientPlayerOne] = usePlayerStore((state) => [state.isClientPlayerOne])

  // const [isPlayerOneTurn] = useTurnStore((state) => [state.isPlayerOneTurn])

  // console.log(isPlayerOneTurn)
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
              {isMyTurn ? <Card card={card} /> : <></>}
            </div>
          ))
        }

      </div>
    </div>
  )
}
