import { useEffect, useRef, useState } from "react";
import Board from "../../components/Board";
import Hand from "../../components/Hand";
import socket from "../../socket";
import TurnedCard from "../../components/TurnedCard";
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





export default function Game() {
  const [loading, setLoading] = useState(true)

  const [isMyTurn, toggleTurn] = useTurnStore((state) => [state.isMyTurn, state.toggleTurn])
  const [setBoard] = useBoardStore((state) => [state.setBoard])
  const [amIP1, setAmIP1, gameOver, setGameOver, setPlayerOneName, setPlayerTwoName, setPlayerDisconnected] = useGameStore((state) => [state.amIP1, state.setAmIP1, state.gameOver, state.setGameOver, state.setPlayerOneName, state.setPlayerTwoName, state.setPlayerDisconnected])
  const [setPoints] = usePointStore((state) => [state.setPoints])


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

    socket.on('new-turn', (data: Tile[][]) => {
      setPoints(data)
      toggleTurnModal()
      if (!isMyTurn) {
        setBoard(data)
      }
      toggleTurn()
    })

    socket.on('game-end', (data) => {
      if (data?.playerDisconnected) {
        setPlayerDisconnected(true)
      }
      setGameOver(true)
    })

    return () => {
      socket.off('player-connected');
      socket.off('game-start');
      socket.off('new-turn');
      socket.off('game-end');
    }
  }, [isMyTurn, amIP1]);


  return (
    <div className="h-full overflow-x-hidden w-full">
      {
        loading ? <h1 className="text-center">Waiting for another player...</h1> :
          <div className="h-full">
            {/* <div className="flex w-full items-center justify-center py-2">
              <div className="flex flex-row gap-3 w-8/12 justify-end">
                <TurnedCard />
                <TurnedCard />
                <TurnedCard />
              </div>
            </div> */}
            <Board amIP1={amIP1} />
            <SkipTurn />
            <Hand />
          </div>
      }
      {gameStartModal && !gameOver && <GameStartModal />}
      {turnModal && !gameOver && <TurnModal />}
      {gameOver && <EndGameModal />}
    </div>
  )
}
