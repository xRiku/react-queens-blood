import useCardStore from '../store/CardStore'
import useNeoHandStore from '../store/NeoHandStore'
import useTurnStore from '../store/TurnStore'
import { useBotGameActions } from '../contexts/BotGameContext'
import socket from '../socket'
import { useParams } from 'react-router-dom'

export function usePlaceCard() {
  const [selectedCard, resetSelectedCard, resetPreviewTile] = useCardStore((state) => [
    state.selectedCard,
    state.resetSelectedCard,
    state.resetPreviewTile,
  ])
  const [placeCard] = useNeoHandStore((state) => [state.placeCard])
  const [isMyTurn] = useTurnStore((state) => [state.isMyTurn])
  const botActions = useBotGameActions()
  const { id: gameId } = useParams<{ id: string }>()

  function confirmPlacement(rowIndex: number, colIndex: number) {
    if (!selectedCard) return

    const correctColIndex = isMyTurn
      ? colIndex
      : Math.abs(colIndex - 4)

    if (botActions) {
      botActions.placeCard(selectedCard.id, rowIndex, correctColIndex)
      resetSelectedCard()
      return
    }

    placeCard(selectedCard)
    resetSelectedCard()

    socket.emit('place-card', {
      cardId: selectedCard.id,
      row: rowIndex,
      col: correctColIndex,
      gameId,
    })
  }

  return { confirmPlacement, resetPreviewTile }
}
