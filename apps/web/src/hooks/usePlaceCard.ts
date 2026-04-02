import useCardStore from '../store/CardStore'
import useNeoHandStore from '../store/NeoHandStore'
import useTurnStore from '../store/TurnStore'
import { useBotGameActions } from '../contexts/BotGameContext'
import socket from '../socket'
import { useParams } from 'react-router-dom'
import { useHaptics } from './useHaptics'

export function usePlaceCard() {
  const selectedCard = useCardStore((state) => state.selectedCard)
  const resetSelectedCard = useCardStore((state) => state.resetSelectedCard)
  const resetPreviewTile = useCardStore((state) => state.resetPreviewTile)
  const placeCard = useNeoHandStore((state) => state.placeCard)
  const isMyTurn = useTurnStore((state) => state.isMyTurn)
  const botActions = useBotGameActions()
  const { id: gameId } = useParams<{ id: string }>()
  const haptics = useHaptics()

  function confirmPlacement(rowIndex: number, colIndex: number) {
    if (!selectedCard) return

    const correctColIndex = isMyTurn
      ? colIndex
      : Math.abs(colIndex - 4)

    if (botActions) {
      botActions.placeCard(selectedCard.id, rowIndex, correctColIndex)
      haptics.impactMedium()
      resetSelectedCard()
      return
    }

    placeCard(selectedCard)
    haptics.impactMedium()
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
