import { useEffect, useRef, useState } from 'react'
import Board from '../../components/Board'
import Hand from '../../components/Hand'
import socket from '../../socket'
import { Tile } from '../../@types/Tile'
import { CardUnity } from '../../@types/Card'
import useBoardStore from '../../store/BoardStore'
import { useGameStore, RematchStatus } from '../../store/GameStore'
import { usePointStore } from '../../store/PointsStore'
import SkipTurn from '../../components/SkipTurn'
import { useModalStore } from '../../store/ModalStore'
import { GameStartModal } from '../../components/Modals/GameStartModal'
import { TurnModal } from '../../components/Modals/TurnModal'
import useTurnStore from '../../store/TurnStore'
import { EndGameModal } from '../../components/Modals/EndGameModal'
import { RematchDialog } from '../../components/Modals/RematchDialog'
import { ReadyRoomDialog } from '../../components/Modals/ReadyRoomDialog'
import useNeoHandStore from '../../store/NeoHandStore'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Copy } from 'lucide-react'
import { useBotGame } from '../../hooks/useBotGame'
import { BotGameContext } from '../../contexts/BotGameContext'
import useCardStore from '../../store/CardStore'
import PlaceCardButton from '../../components/PlaceCardButton'

export default function Game() {
  const { id: gameId } = useParams<{ id: string }>()
  const location = useLocation()
  const isBotGame = gameId === 'bot'
  const [loading, setLoading] = useState(!isBotGame)
  const [gameBusy, setGameBusy] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const toggleTurn = useTurnStore((s) => s.toggleTurn)
  const setPlayerSkippedTurn = useTurnStore((s) => s.setPlayerSkippedTurn)
  const resetTurnStore = useTurnStore((s) => s.resetStore)
  const setBoard = useBoardStore((s) => s.setBoard)
  const resetBoardStore = useBoardStore((s) => s.resetStore)
  const amIP1 = useGameStore((s) => s.amIP1)
  const setAmIP1 = useGameStore((s) => s.setAmIP1)
  const gameOver = useGameStore((s) => s.gameOver)
  const setGameOver = useGameStore((s) => s.setGameOver)
  const setPlayerOneName = useGameStore((s) => s.setPlayerOneName)
  const setPlayerTwoName = useGameStore((s) => s.setPlayerTwoName)
  const setPlayerDisconnected = useGameStore((s) => s.setPlayerDisconnected)
  const setRematchStatuses = useGameStore((s) => s.setRematchStatuses)
  const setReadyStatuses = useGameStore((s) => s.setReadyStatuses)
  const setPoints = usePointStore((s) => s.setPoints)
  const resetPointsStore = usePointStore((s) => s.resetStore)
  const setHand = useNeoHandStore((s) => s.setHand)
  const addCard = useNeoHandStore((s) => s.addCard)
  const resetNeoHandStore = useNeoHandStore((s) => s.resetStore)
  const resetCardStore = useCardStore((s) => s.resetSelectedCard)
  const resetPreviewTile = useCardStore((s) => s.resetPreviewTile)

  const navigate = useNavigate()
  const [showEndGame, setShowEndGame] = useState(false)
  const endGameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const gameStartModal = useModalStore((s) => s.gameStartModal)
  const toggleGameStartModal = useModalStore((s) => s.toggleGameStartModal)
  const turnModal = useModalStore((s) => s.turnModal)
  const toggleTurnModal = useModalStore((s) => s.toggleTurnModal)
  const rematchDialog = useModalStore((s) => s.rematchDialog)
  const showRematchDialog = useModalStore((s) => s.showRematchDialog)
  const hideRematchDialog = useModalStore((s) => s.hideRematchDialog)
  const readyRoom = useModalStore((s) => s.readyRoom)
  const showReadyRoom = useModalStore((s) => s.showReadyRoom)
  const hideReadyRoom = useModalStore((s) => s.hideReadyRoom)

  const botPlayerName = location.state?.playerName || 'Player'
  const botActions = useBotGame(isBotGame, botPlayerName, setShowEndGame)

  useEffect(() => {
    if (isBotGame) return

    socket.on('player-connected', (data: { firstPlayer: boolean }) => {
      setAmIP1(data.firstPlayer)
    })

    socket.on('game-start', (data: {
      playerNames: string[];
      initialHand: CardUnity[];
      isPlayerOne: boolean;
    }) => {
      // Reset for rematch if game was over
      if (endGameTimerRef.current) {
        clearTimeout(endGameTimerRef.current)
        endGameTimerRef.current = null
      }
      setShowEndGame(false)
      hideRematchDialog()
      hideReadyRoom()
      setGameOver(false)
      resetBoardStore()
      resetPointsStore()
      resetTurnStore()
      resetNeoHandStore()
      resetCardStore()
      setRematchStatuses('waiting', 'waiting')

      setLoading(false)
      setAmIP1(data.isPlayerOne)
      setHand(data.initialHand)
      toggleGameStartModal()
      if (data.isPlayerOne) {
        toggleTurn()
      }
      setPlayerOneName(data.playerNames[0])
      setPlayerTwoName(data.playerNames[1])
    })

    socket.on('new-turn', (data: {
      tiles: Tile[][],
      playerSkippedTurn: boolean,
      drawnCard: CardUnity | null,
    }) => {
      setPlayerSkippedTurn(data.playerSkippedTurn)
      setPoints(data.tiles)
      setBoard(data.tiles)
      resetPreviewTile()
      if (data.drawnCard) {
        addCard(data.drawnCard)
      }
      toggleTurnModal()
      toggleTurn()
    })

    socket.on('move-rejected', (data: {
      reason: string;
      board: Tile[][];
      hand: CardUnity[];
    }) => {
      console.warn('Move rejected:', data.reason)
      setBoard(data.board)
      setPoints(data.board)
      setHand(data.hand)
    })

    socket.on('game-end', (data) => {
      if (data?.playerDisconnected) {
        setPlayerDisconnected(true)
        setGameOver(true)
        setShowEndGame(true)
        return
      }
      setGameOver(true)
      setShowEndGame(true)
      endGameTimerRef.current = setTimeout(() => {
        setShowEndGame(false)
        showRematchDialog()
      }, 4000)
    })

    socket.on('rematch-status-update', (data: {
      playerOneStatus: RematchStatus;
      playerTwoStatus: RematchStatus;
    }) => {
      setRematchStatuses(data.playerOneStatus, data.playerTwoStatus)
    })

    socket.on('rematch-cancelled', () => {
      hideRematchDialog()
      socket.disconnect()
      navigate('/')
    })

    socket.on('game-busy', () => {
      setLoading(false)
      setGameBusy(true)
    })

    socket.on('ready-room', (data: { playerNames: string[], isPlayerOne: boolean }) => {
      setPlayerOneName(data.playerNames[0])
      setPlayerTwoName(data.playerNames[1])
      setAmIP1(data.isPlayerOne)
      setLoading(false)
      showReadyRoom()
    })

    socket.on('ready-status-update', (data: {
      playerOneStatus: RematchStatus;
      playerTwoStatus: RematchStatus;
    }) => {
      setReadyStatuses(data.playerOneStatus, data.playerTwoStatus)
    })

    socket.on('ready-cancelled', () => {
      hideReadyRoom()
      socket.disconnect()
      navigate('/')
    })

    socket.on('ready-player-left', () => {
      hideReadyRoom()
      setReadyStatuses('waiting', 'waiting')
      setLoading(true)
    })

    return () => {
      socket.off('player-connected')
      socket.off('game-start')
      socket.off('new-turn')
      socket.off('move-rejected')
      socket.off('game-end')
      socket.off('game-busy')
      socket.off('rematch-status-update')
      socket.off('rematch-cancelled')
      socket.off('ready-room')
      socket.off('ready-status-update')
      socket.off('ready-cancelled')
      socket.off('ready-player-left')
      if (endGameTimerRef.current) clearTimeout(endGameTimerRef.current)
    }
  }, [])

  const handleGameIdClick = async (gameId?: string) => {
    try {
      if (!gameId) return
      await navigator.clipboard.writeText(gameId)
      setIsCopied(true)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const shouldShowBoard = !loading && !gameBusy

  return (
    <BotGameContext.Provider value={botActions}>
      <div className="md:h-full overflow-x-hidden w-full">
        {loading ? (
          <div className="flex flex-col items-center gap-10">
            <p className="text-center">Waiting for another player...</p>
            <div
              className="flex gap-6" title={isCopied ? 'Copied!' : 'Copy'}
            >
              <h1 className="text-5xl ">{gameId}</h1>
              <button className="cursor-pointer" onClick={() => handleGameIdClick(gameId)}><Copy size={24} /></button>
            </div>
          </div>
        ) : null}
        {shouldShowBoard ? (
          <div className="md:h-full flex flex-col">
            <div className="flex-shrink-0">
              <Board amIP1={amIP1} />
            </div>
            <div className="flex items-center justify-start md:justify-end gap-2 flex-shrink-0 px-4 md:px-0 md:w-11/12 md:mx-auto h-12 md:h-14 xl:h-16 2xl:h-20 py-1.5 md:py-1 my-2 md:my-0">
              <SkipTurn />
              <PlaceCardButton />
            </div>
            <div className="min-h-0">
              <Hand />
            </div>
          </div>
        ) : null}
        {gameBusy ? (
          <h1 className="text-center">Game is busy. Please try again later.</h1>
        ) : null}
        {gameStartModal && !gameOver ? <GameStartModal /> : null}
        {turnModal && !gameOver ? <TurnModal /> : null}
        <AnimatePresence>
          {gameOver && showEndGame ? <EndGameModal /> : null}
        </AnimatePresence>
        {rematchDialog ? <RematchDialog /> : null}
        {readyRoom ? <ReadyRoomDialog /> : null}
      </div>
    </BotGameContext.Provider>
  )
}
