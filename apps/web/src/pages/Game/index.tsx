import { useEffect, useRef, useState } from "react";
import Board from "../../components/Board";
import Hand from "../../components/Hand";
import socket from "../../socket";
import { Tile } from "../../@types/Tile";
import { CardUnity } from "../../@types/Card";
import useBoardStore from "../../store/BoardStore";
import { useGameStore, RematchStatus } from "../../store/GameStore";
import { usePointStore } from "../../store/PointsStore";
import SkipTurn from "../../components/SkipTurn";
import { useModalStore } from "../../store/ModalStore";
import { GameStartModal } from "../../components/Modals/GameStartModal";
import { TurnModal } from "../../components/Modals/TurnModal";
import useTurnStore from "../../store/TurnStore";
import { EndGameModal } from "../../components/Modals/EndGameModal";
import { RematchDialog } from "../../components/Modals/RematchDialog";
import useNeoHandStore from "../../store/NeoHandStore";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { useBotGame } from "../../hooks/useBotGame";
import { BotGameContext } from "../../contexts/BotGameContext";
import useCardStore from "../../store/CardStore";


export default function Game() {
  const { id: gameId } = useParams<{ id: string }>()
  const location = useLocation()
  const isBotGame = gameId === 'bot';
  const [loading, setLoading] = useState(!isBotGame)
  const [gameBusy, setGameBusy] = useState(false)
  const [isCopied, setIsCopied] = useState(false);

  const [isMyTurn, toggleTurn, setPlayerSkippedTurn] = useTurnStore((state) => [state.isMyTurn, state.toggleTurn, state.setPlayerSkippedTurn])
  const [setBoard] = useBoardStore((state) => [state.setBoard])
  const [amIP1, setAmIP1, gameOver, setGameOver, setPlayerOneName, setPlayerTwoName, setPlayerDisconnected, setRematchStatuses] = useGameStore((state) => [state.amIP1, state.setAmIP1, state.gameOver, state.setGameOver, state.setPlayerOneName, state.setPlayerTwoName, state.setPlayerDisconnected, state.setRematchStatuses])
  const [setPoints] = usePointStore((state) => [state.setPoints])
  const [setHand, addCard] = useNeoHandStore((state) => [state.setHand, state.addCard])
  const [resetBoardStore] = useBoardStore((state) => [state.resetStore])
  const [resetPointsStore] = usePointStore((state) => [state.resetStore])
  const [resetTurnStore] = useTurnStore((state) => [state.resetStore])
  const [resetNeoHandStore] = useNeoHandStore((state) => [state.resetStore])
  const resetCardStore = useCardStore((state) => state.resetSelectedCard)

  const navigate = useNavigate()
  const [showEndGame, setShowEndGame] = useState(false)
  const endGameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [gameStartModal, toggleGameStartModal, turnModal, toggleTurnModal, rematchDialog, showRematchDialog, hideRematchDialog] = useModalStore((state) => [state.gameStartModal, state.toggleGameStartModal, state.turnModal, state.toggleTurnModal, state.rematchDialog, state.showRematchDialog, state.hideRematchDialog])

  const botPlayerName = location.state?.playerName || 'Player'
  const botActions = useBotGame(isBotGame, botPlayerName, setShowEndGame)

  useEffect(() => {
    if (isBotGame) return;

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

    return () => {
      socket.off('player-connected');
      socket.off('game-start');
      socket.off('new-turn');
      socket.off('move-rejected');
      socket.off('game-end');
      socket.off('game-busy');
      socket.off('rematch-status-update');
      socket.off('rematch-cancelled');
      if (endGameTimerRef.current) clearTimeout(endGameTimerRef.current)
    }
  }, [isMyTurn, amIP1]);

  const handleGameIdClick = async (gameId?: string) => {
    try {
      if (!gameId) return;
      await navigator.clipboard.writeText(gameId);
      setIsCopied(true);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  const shouldShowBoard = !loading && !gameBusy

  return (
    <BotGameContext.Provider value={botActions}>
      <div className="h-full overflow-x-hidden w-full">
        {
          loading && <div className="flex flex-col items-center gap-10">
            <p className="text-center">Waiting for another player...</p>
            <div className="flex gap-6" title={`${isCopied ? 'Copied!' : 'Copy'}`}>
              <h1 className="text-5xl " >{gameId}</h1>
              <button className="cursor-pointer" onClick={() => handleGameIdClick(gameId)}><FontAwesomeIcon icon={faCopy} size={"xl"} /></button>
            </div>
          </div>
        }
        {
          shouldShowBoard && <div className="h-full">
            <Board amIP1={amIP1} />
            <SkipTurn />
            <Hand />
          </div>
        }
        {
          gameBusy && <h1 className="text-center">Game is busy. Please try again later.</h1>
        }
        {gameStartModal && !gameOver && <GameStartModal />}
        {turnModal && !gameOver && <TurnModal />}
        <AnimatePresence>
          {gameOver && showEndGame && <EndGameModal />}
        </AnimatePresence>
        {rematchDialog && <RematchDialog />}
      </div>
    </BotGameContext.Provider>
  )
}
