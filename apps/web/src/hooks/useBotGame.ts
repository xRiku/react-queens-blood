import { useEffect, useRef, useCallback } from 'react'
import {
  createInitialBoard,
  shuffleDeck,
  drawCards,
  deckCards,
  findAllValidMoves,
  mapPawns,
  canAddCardToPosition,
} from '@queens-blood/shared'
import type { CardInfo, CardUnity, Tile } from '@queens-blood/shared'
import useBoardStore from '../store/BoardStore'
import useDeckStore from '../store/DeckStore'
import { useGameStore } from '../store/GameStore'
import { usePointStore } from '../store/PointsStore'
import useTurnStore from '../store/TurnStore'
import useNeoHandStore from '../store/NeoHandStore'
import { useModalStore } from '../store/ModalStore'
import useCardStore from '../store/CardStore'
import type { BotGameActions } from '../contexts/BotGameContext'
import { trackEvent, trackSessionMatchStarted } from '../lib/analytics'

type BotGameState = {
  board: Tile[][];
  humanDeck: CardInfo[];
  botDeck: CardInfo[];
  botHand: CardUnity[];
  cardIdCounter: number;
  playerSkippedTurn: boolean;
  botTimeoutId: ReturnType<typeof setTimeout> | null;
}

function drawFromDeck(
  state: BotGameState,
  deckKey: 'humanDeck' | 'botDeck',
): CardUnity | null {
  const deck = state[deckKey]
  if (deck.length === 0) return null
  const result = drawCards(deck, 1, state.cardIdCounter)
  state[deckKey] = result.remaining
  state.cardIdCounter = result.nextId
  return result.drawn[0]
}

export function useBotGame(
  enabled: boolean,
  playerName: string,
  setShowEndGame?: (show: boolean) => void,
  onNewMatchStart?: () => void,
): BotGameActions | null {
  const stateRef = useRef<BotGameState | null>(null)

  const setBoard = useBoardStore((s) => s.setBoard)
  const resetBoardStore = useBoardStore((s) => s.resetStore)
  const setPoints = usePointStore((s) => s.setPoints)
  const resetPointsStore = usePointStore((s) => s.resetStore)
  const toggleTurn = useTurnStore((s) => s.toggleTurn)
  const setPlayerSkippedTurn = useTurnStore((s) => s.setPlayerSkippedTurn)
  const resetTurnStore = useTurnStore((s) => s.resetStore)
  const setHand = useNeoHandStore((s) => s.setHand)
  const addCard = useNeoHandStore((s) => s.addCard)
  const resetNeoHandStore = useNeoHandStore((s) => s.resetStore)
  const setAmIP1 = useGameStore((s) => s.setAmIP1)
  const setGameOver = useGameStore((s) => s.setGameOver)
  const setPlayerOneName = useGameStore((s) => s.setPlayerOneName)
  const setPlayerTwoName = useGameStore((s) => s.setPlayerTwoName)
  const setRematchStatuses = useGameStore((s) => s.setRematchStatuses)
  const resetModalStore = useModalStore((s) => s.resetStore)
  const resetCardStore = useCardStore((s) => s.resetSelectedCard)
  const toggleGameStartModal = useModalStore((s) => s.toggleGameStartModal)
  const toggleTurnModal = useModalStore((s) => s.toggleTurnModal)
  const showRematchDialog = useModalStore((s) => s.showRematchDialog)
  const hideRematchDialog = useModalStore((s) => s.hideRematchDialog)

  const initGame = useCallback(() => {
    resetBoardStore()
    resetPointsStore()
    resetTurnStore()
    resetNeoHandStore()
    resetModalStore()
    resetCardStore()
    setGameOver(false)
    setRematchStatuses('waiting', 'waiting')

    const board = createInitialBoard()
    const storedDeck = useDeckStore.getState().deck
    const humanDeck = shuffleDeck([...(storedDeck.length === 15 ? storedDeck : deckCards)])
    const botDeck = shuffleDeck([...deckCards])
    let cardIdCounter = 0

    const humanDraw = drawCards(humanDeck, 5, cardIdCounter)
    cardIdCounter = humanDraw.nextId

    const botDraw = drawCards(botDeck, 5, cardIdCounter)
    cardIdCounter = botDraw.nextId

    stateRef.current = {
      board,
      humanDeck: humanDraw.remaining,
      botDeck: botDraw.remaining,
      botHand: botDraw.drawn,
      cardIdCounter,
      playerSkippedTurn: false,
      botTimeoutId: null,
    }

    setAmIP1(true)
    setPlayerOneName(playerName)
    setPlayerTwoName('Bot')
    setHand(humanDraw.drawn)
    trackSessionMatchStarted('bot')
    trackEvent('bot_game_started', { mode: 'bot' })
    onNewMatchStart?.()
    setBoard(board)
    setPoints(board)
    toggleGameStartModal()
    toggleTurn() // human goes first
  }, [])

  const triggerGameEnd = useCallback(() => {
    trackEvent('bot_game_completed', { mode: 'bot' })
    setGameOver(true)
    setShowEndGame?.(true)
    setTimeout(() => {
      setShowEndGame?.(false)
      showRematchDialog()
    }, 4000)
  }, [])

  const scheduleBotTurn = useCallback(() => {
    const state = stateRef.current
    if (!state) return

    const delay = 1000 + Math.random() * 1000
    state.botTimeoutId = setTimeout(() => {
      executeBotTurn()
    }, delay)
  }, [])

  const executeBotTurn = useCallback(() => {
    const state = stateRef.current
    if (!state) return

    const moves = findAllValidMoves(state.board, state.botHand, false)

    if (moves.length === 0) {
      // Bot skips
      if (state.playerSkippedTurn) {
        // Both skipped — game over
        triggerGameEnd()
        return
      }

      state.playerSkippedTurn = true

      const drawnCard = drawFromDeck(state, 'humanDeck')

      setPlayerSkippedTurn(true)
      setPoints(state.board)
      setBoard(state.board)
      if (drawnCard) addCard(drawnCard)
      toggleTurnModal()
      toggleTurn()
      return
    }

    // Pick a random valid move
    const move = moves[Math.floor(Math.random() * moves.length)]
    const cardIndex = state.botHand.findIndex((c) => c.id === move.card.id)

    state.board = mapPawns(state.board, move.card, move.row, move.col, false)
    state.botHand.splice(cardIndex, 1)
    state.playerSkippedTurn = false

    const drawnCard = drawFromDeck(state, 'humanDeck')

    setPlayerSkippedTurn(false)
    setPoints(state.board)
    setBoard(state.board)
    if (drawnCard) addCard(drawnCard)
    toggleTurnModal()
    toggleTurn()
  }, [])

  const placeCard = useCallback(
    (cardId: number, row: number, col: number) => {
      const state = stateRef.current
      if (!state) return

      const humanHand = useNeoHandStore.getState().playerCards
      const card = humanHand.find((c) => c.id === cardId)
      if (!card) return

      const position = state.board[row]?.[col]
      if (!position || !canAddCardToPosition(card, position, true)) return

      // Apply move
      state.board = mapPawns(state.board, card, row, col, true)
      state.playerSkippedTurn = false

      // Remove card from hand
      useNeoHandStore.getState().placeCard(card)

      const botDrawn = drawFromDeck(state, 'botDeck')
      if (botDrawn) state.botHand.push(botDrawn)

      // Update UI
      setBoard(state.board)
      setPoints(state.board)

      // Toggle to bot's turn, then schedule bot
      toggleTurnModal()
      toggleTurn()
      scheduleBotTurn()
    },
    [],
  )

  const skipTurn = useCallback(() => {
    const state = stateRef.current
    if (!state) return

    if (state.playerSkippedTurn) {
      // Both skipped — game over
      triggerGameEnd()
      return
    }

    state.playerSkippedTurn = true

    const botDrawn = drawFromDeck(state, 'botDeck')
    if (botDrawn) state.botHand.push(botDrawn)

    // Toggle to bot's turn
    toggleTurnModal()
    toggleTurn()
    scheduleBotTurn()
  }, [])

  const rematchRespond = useCallback(
    (response: 'confirmed' | 'refused') => {
      if (response === 'confirmed') {
        setShowEndGame?.(false)
        hideRematchDialog()
        initGame()
      }
      // "refused" is handled by the component (navigate away)
    },
    [],
  )

  // Initialize on mount
  useEffect(() => {
    if (!enabled) return

    initGame()

    return () => {
      if (stateRef.current?.botTimeoutId) {
        clearTimeout(stateRef.current.botTimeoutId)
      }
    }
  }, [enabled])

  if (!enabled) return null

  return { placeCard, skipTurn, rematchRespond }
}
