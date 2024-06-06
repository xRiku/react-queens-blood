import { useEffect, useState } from "react";
import Board from "../../components/Board";
import Hand from "../../components/Hand";
import socket from "../../socket";
import TurnedCard from "../../components/TurnedCard";
import { Tile } from "../../@types/Tile";
import useBoardStore from "../../store/BoardStore";




export default function Game() {
  const [loading, setLoading] = useState(true)

  const [amIP1, setAmIP1] = useState<boolean>(false);
  const [myTurn, setMyTurn] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [setBoard] = useBoardStore((state) => [state.setBoard])



  useEffect(() => {
    socket.on('playerConnected', (data: { firstPlayer: boolean }) => {
      setAmIP1(data.firstPlayer)
      console.log(data)
    })


    socket.on('gameStart', () => {
      setLoading(false)
      console.log('amIP1', amIP1)
      if (amIP1) {
        setMyTurn(true)
      }
    })

    socket.on('newTurn', (data: Tile[][]) => {
      if (!myTurn) {
        setBoard(data)
      }
      setMyTurn(!myTurn)
    })

    socket.on('gameEnd', () => {
      setGameOver(true)
    })

    return () => {
      socket.off('playerConnected');
      socket.off('gameStart');
      socket.off('newTurn');
      socket.off('gameEnd');
    }
  }, [myTurn, amIP1]);


  return (
    <div className="vh-100 vw-100 overflow-x-hidden w-full">
      {
        loading ? <h1 className="text-center">Waiting for another player...</h1> :
          gameOver ? <h1 className="text-center">Game Over</h1> :
            <>
              {/* <Hand isMyTurn={myTurn} /> */}
              <div className="flex w-full items-center justify-center py-2">
                <div className="flex flex-row gap-3 w-8/12 justify-end">
                  <TurnedCard />
                  <TurnedCard />
                  <TurnedCard />
                </div>
              </div>
              <Board isMyTurn={myTurn} amIP1={amIP1} />
              <Hand isMyTurn={myTurn} />
            </>
      }
    </div>
  )
}
