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
import { useModalStore } from "../../store/useModalStore";
import { GameStartModal } from "../../components/Modals/GameStartModal";
import { TurnModal } from "../../components/Modals/TurnModal";
import useTurnStore from "../../store/TurnStore";
import { EndGameModal } from "../../components/Modals/EndGameModal";





export default function Game() {
  const [loading, setLoading] = useState(true)

  const [amIP1, setAmIP1] = useState<boolean>(false);
  const [isMyTurn, toggleTurn] = useTurnStore((state) => [state.isMyTurn, state.toggleTurn])
  const [setBoard] = useBoardStore((state) => [state.setBoard])
  const [gameOver, setGameOver, setPlayerOneName, setPlayerTwoName] = useGameStore((state) => [state.gameOver, state.setGameOver, state.setPlayerOneName, state.setPlayerTwoName])
  const [setPoints] = usePointStore((state) => [state.setPoints])


  const [gameStartModal, toggleGameStartModal, turnModal, toggleTurnModal] = useModalStore((state) => [state.gameStartModal, state.toggleGameStartModal, state.turnModal, state.toggleTurnModal])




  useEffect(() => {
    socket.on('playerConnected', (data: { firstPlayer: boolean }) => {
      setAmIP1(data.firstPlayer)
      console.log(data)
    })


    socket.on('gameStart', (data) => {
      console.log(data)
      setLoading(false)
      toggleGameStartModal()
      if (amIP1) {
        toggleTurn()
      }
      setPlayerOneName(data[0])
      setPlayerTwoName(data[1])
    })

    socket.on('newTurn', (data: Tile[][]) => {
      setPoints(data)
      toggleTurnModal()
      if (!isMyTurn) {
        setBoard(data)
      }
      toggleTurn()
    })

    socket.on('game-end', () => {
      setGameOver(true)
    })

    return () => {
      socket.off('playerConnected');
      socket.off('gameStart');
      socket.off('newTurn');
      socket.off('game-end');
    }
  }, [isMyTurn, amIP1]);


  return (
    <div className="h-full overflow-x-hidden w-full">
      {
        loading ? <h1 className="text-center">Waiting for another player...</h1> :
          <div className="h-full">
            <div className="flex w-full items-center justify-center py-2">
              <div className="flex flex-row gap-3 w-8/12 justify-end">
                <TurnedCard />
                <TurnedCard />
                <TurnedCard />
              </div>
            </div>
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
