import { useEffect, useState } from "react";
import Board from "../../components/Board";
import Hand from "../../components/Hand";
import socket from "../../socket";
import { Tile } from "../../@types/Tile";
import useBoardStore from "../../store/BoardStore";
import { useGameStore } from "../../store/GameStore";
import { usePointStore } from "../../store/PointsStore";
import SkipTurn from "../../components/SkipTurn";
import { useModalStore } from "../../store/ModalStore";
import { GameStartModal } from "../../components/Modals/GameStartModal";
import { TurnModal } from "../../components/Modals/TurnModal";
import useTurnStore from "../../store/TurnStore";
import { EndGameModal } from "../../components/Modals/EndGameModal";
import { useParams } from "react-router-dom";





export default function Game() {
  const [loading, setLoading] = useState(true)
  const [gameBusy, setGameBusy] = useState(false)

  const [isMyTurn, toggleTurn, setPlayerSkippedTurn] = useTurnStore((state) => [state.isMyTurn, state.toggleTurn, state.setPlayerSkippedTurn])
  const [setBoard] = useBoardStore((state) => [state.setBoard])
  const [amIP1, setAmIP1, gameOver, setGameOver, setPlayerOneName, setPlayerTwoName, setPlayerDisconnected] = useGameStore((state) => [state.amIP1, state.setAmIP1, state.gameOver, state.setGameOver, state.setPlayerOneName, state.setPlayerTwoName, state.setPlayerDisconnected])
  const [setPoints] = usePointStore((state) => [state.setPoints])

  const { id: gameId } = useParams<{ id: string }>()

  const [gameStartModal, toggleGameStartModal, turnModal, toggleTurnModal] = useModalStore((state) => [state.gameStartModal, state.toggleGameStartModal, state.turnModal, state.toggleTurnModal])




  useEffect(() => {
    socket.on('player-connected', (data: { firstPlayer: boolean }) => {
      setAmIP1(data.firstPlayer)
    })


    socket.on('game-start', (data) => {
      setLoading(false)
      toggleGameStartModal()
      if (amIP1) {
        toggleTurn()
      }
      setPlayerOneName(data[0])
      setPlayerTwoName(data[1])
    })

    socket.on('new-turn', (data: { tiles: Tile[][], playerSkippedTurn: boolean }) => {
      setPlayerSkippedTurn(data.playerSkippedTurn)
      setPoints(data.tiles)
      toggleTurnModal()
      if (!isMyTurn) {
        setBoard(data.tiles)
      }
      toggleTurn()
    })

    socket.on('game-end', (data) => {
      if (data?.playerDisconnected) {
        setPlayerDisconnected(true)
      }
      setGameOver(true)
    })

    socket.on('game-busy', () => {
      setLoading(false)
      setGameBusy(true)
    })

    return () => {
      socket.off('player-connected');
      socket.off('game-start');
      socket.off('new-turn');
      socket.off('game-end');
      socket.off('game-busy');
    }
  }, [isMyTurn, amIP1]);

  const shouldShowBoard = !loading && !gameBusy

  return (
    <div className="h-full overflow-x-hidden w-full">
      {
        loading && <div className="flex flex-col items-center gap-10"><p className="text-center">Waiting for another player...</p>
          <h1 className="text-9xl">{gameId}</h1></div>
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
      {gameOver && <EndGameModal />}
    </div>
  )
}
