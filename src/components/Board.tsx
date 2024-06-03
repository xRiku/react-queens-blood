import { useEffect, useState } from 'react'
import { Tile } from '../@types/Tile'
import { CardInfo } from '../@types/Card'
import useCardStore from '../store/CardStore'
import useBoardStore from '../store/BoardStore'
import Card from './Card'
// import useHandStore from '../store/HandStore'
import useTurnStore from '../store/TurnStore'
import socket from '../socket'
import { usePlayerStore } from '../store/PlayerStore'

export default function Board({
  amIP1,
  isMyTurn,
}: {
  amIP1: boolean
  isMyTurn: boolean
}) {
  const [numPlayers, setNumPlayers] = useState(0);
  const [selectedCard, resetSelectedCard] = useCardStore((state) => [
    state.selectedCard,
    state.resetSelectedCard,
  ])
  const [tiles, setTiles] = useBoardStore((state) => [
    state.board,
    state.setBoard,
  ])

  // const [placeCard] = useHandStore((state) => [state.placeCard])

  // const [isPlayerOneTurn, toggleTurn] = useTurnStore((state) => [
  //   state.isPlayerOneTurn,
  //   state.toggleTurn,
  // ])

  // const [isClientPlayerOne, setIsClientPlayerOne] = usePlayerStore((state) => [state.isClientPlayerOne, state.setIsClientPlayerOne])
  // const [myTurn, setMyTurn] = useState<boolean>()
  const [playerSkipped, setPlayerSkipped] = useState(false)

  // const [position, setPosition] = useState(0)
  // const [speed, setSpeed] = useState(4) // Change the speed here
  // const [isSlowingDown, setIsSlowingDown] = useState(false)
  // const [showTurnAnimation, setShowTurnAnimation] = useState(true)

  // useEffect(() => {
  //   if (showTurnAnimation) {
  //     const animationFrame = requestAnimationFrame(() => {
  //       const screenWidth = window.innerWidth
  //       const boxWidth = 50 // Width of the box
  //       const centerX = screenWidth / 2 - boxWidth / 2

  //       // Check if the box is near the center
  //       if (
  //         position >= centerX - screenWidth * 0.2 &&
  //         position <= centerX + screenWidth * 0.05
  //       ) {
  //         setIsSlowingDown(true)
  //       } else {
  //         setIsSlowingDown(false)
  //       }

  //       // Adjust speed based on slowing down or speeding up
  //       if (isSlowingDown) {
  //         setSpeed(
  //           (50 * (screenWidth - Math.abs(centerX - position))) /
  //           (screenWidth * 0.2 * 50),
  //         ) // Variable speed for slowing down
  //       } else {
  //         setSpeed(30) // Base speed for speeding up
  //       }

  //       setPosition(position + speed)

  //       if (position >= screenWidth) {
  //         setPosition(0)
  //         setShowTurnAnimation(false)
  //       }
  //     })

  //     return () => cancelAnimationFrame(animationFrame)
  //   }
  // }, [isSlowingDown, position, showTurnAnimation, speed])

  const rows = 3
  const cols = 7
  const tilesElements = new Array(rows)
    .fill(0)
    .map(() => new Array(cols).fill(0))

  function canAddCardToPosition(card: CardInfo | null, position: Tile) {
    if (!card) {
      return false
    }

    // if (isPlayerOneTurn && position?.playerOnePawns === 0) {
    //   return false
    // }

    // if (!isPlayerOneTurn && position?.playerTwoPawns === 0) {
    //   return false
    // }

    // if (isPlayerOneTurn && position?.playerOnePawns < card.pawnsCost) {
    //   return false
    // }

    // if (!isPlayerOneTurn && position?.playerTwoPawns < card.pawnsCost) {
    //   return false
    // }

    return true
  }

  // function mapPawns(card: CardInfo, rowIndex: number, colIndex: number) {
  //   const correctColIndex = isPlayerOneTurn ? colIndex : Math.abs(colIndex - 4)
  //   const transformedRowIndex = correctColIndex
  //   const transformedColIndex = -rowIndex
  //   const newTiles = isPlayerOneTurn ? [...tiles] : transformMatrix([...tiles])
  //   for (let i = 0; i < card.pawnsPositions.length; i++) {
  //     const newRow = -(transformedColIndex + card.pawnsPositions[i][1])
  //     const newCol = transformedRowIndex + card.pawnsPositions[i][0]

  //     if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols - 2) {
  //       continue
  //     }

  //     if (isPlayerOneTurn) {
  //       newTiles[newRow][newCol] = {
  //         playerOnePoints:
  //           newTiles[newRow][newCol].playerOnePawns === -1
  //             ? newTiles[newRow][newCol].playerOnePoints
  //             : 0,
  //         playerTwoPoints:
  //           newTiles[newRow][newCol].playerTwoPawns === -1
  //             ? newTiles[newRow][newCol].playerTwoPoints
  //             : 0,
  //         playerOnePawns:
  //           newTiles[newRow][newCol].playerOnePawns !== -1 &&
  //             newTiles[newRow][newCol].playerOnePawns < 3
  //             ? newTiles[newRow][newCol].playerTwoPawns !== 0
  //               ? newTiles[newRow][newCol].playerTwoPawns
  //               : newTiles[newRow][newCol].playerOnePawns + 1
  //             : newTiles[newRow][newCol].playerOnePawns,
  //         playerTwoPawns: 0,
  //         card:
  //           newTiles[newRow][newCol].playerOnePawns === -1
  //             ? newTiles[newRow][newCol].card
  //             : newTiles[newRow][newCol].playerTwoPawns === -1
  //               ? newTiles[newRow][newCol].card
  //               : null,
  //       }
  //       continue
  //     }
  //     newTiles[newRow][newCol] = {
  //       playerOnePoints:
  //         newTiles[newRow][newCol].playerOnePawns === -1
  //           ? newTiles[newRow][newCol].playerOnePoints
  //           : 0,
  //       playerTwoPoints:
  //         newTiles[newRow][newCol].playerTwoPawns === -1
  //           ? newTiles[newRow][newCol].playerTwoPoints
  //           : 0,
  //       playerOnePawns: 0,
  //       playerTwoPawns:
  //         newTiles[newRow][newCol].playerTwoPawns !== -1 &&
  //           newTiles[newRow][newCol].playerTwoPawns < 3
  //           ? newTiles[newRow][newCol].playerOnePawns !== 0
  //             ? newTiles[newRow][newCol].playerOnePawns
  //             : newTiles[newRow][newCol].playerTwoPawns + 1
  //           : newTiles[newRow][newCol].playerTwoPawns,
  //       card:
  //         newTiles[newRow][newCol].playerOnePawns === -1
  //           ? newTiles[newRow][newCol].card
  //           : newTiles[newRow][newCol].playerTwoPawns === -1
  //             ? newTiles[newRow][newCol].card
  //             : null,
  //     }
  //   }

  //   newTiles[rowIndex][correctColIndex] = {
  //     playerOnePoints: isPlayerOneTurn ? card.points : 0,
  //     playerTwoPoints: isPlayerOneTurn ? 0 : card.points,
  //     playerOnePawns: -1,
  //     playerTwoPawns: -1,
  //     card: {
  //       ...card,
  //       placedByPlayerOne: isPlayerOneTurn,
  //     },
  //   }

  //   console.log(newTiles)

  //   return isPlayerOneTurn ? newTiles : transformMatrix(newTiles)
  // }

  function transformMatrix(matrix) {
    return matrix.map((row) => row.toReversed())
  }

  // function handleCellClick(position: Tile, rowIndex: number, colIndex: number) {
  //   if (!canAddCardToPosition(selectedCard, position)) {
  //     return
  //   }

  //   if (!selectedCard) {
  //     return
  //   }

  //   const newTiles = mapPawns(selectedCard, rowIndex, colIndex)

  //   setTiles(newTiles)
  //   placeCard(selectedCard, isMyTurn)
  //   resetSelectedCard()
  //   socket.emit('tilesChanged', newTiles)
  //   // toggleTurn()
  //   setPlayerSkipped(false)
  //   // setShowTurnAnimation(true)
  // }

  function handleSkipTurn() {
    if (playerSkipped) {
      console.log('Game is Over')
      console.log(
        'Player 1 points: ',
        tiles
          .map((row) =>
            row
              .map((tile) => tile.playerOnePoints)
              .reduce((acc, curr) => acc + curr, 0),
          )
          .reduce((acc, curr) => acc + curr, 0),
      )
      console.log(
        'Player 2 points: ',
        tiles
          .map((row) =>
            row
              .map((tile) => tile.playerTwoPoints)
              .reduce((acc, curr) => acc + curr, 0),
          )
          .reduce((acc, curr) => acc + curr, 0),
      )
      return
    }
    setPlayerSkipped(true)
    // toggleTurn()
    // setShowTurnAnimation(true)
  }

  for (let i = 0; i < rows; i++) {
    const playerOnePoints = tiles[i]
      .map((tile) => tile.playerOnePoints)
      .reduce((acc, curr) => acc + curr, 0)
    const playerTwoPoints = tiles[i]
      .map((tile) => tile.playerTwoPoints)
      .reduce((acc, curr) => acc + curr, 0)
    tilesElements[i][0] = (
      <div
        className={`bg-gray-800 h-48 w-full flex items-center justify-center border-solid border-2 border-black`}
        key={`${i}-${0}`}
      >
        <div
          className={`h-24 w-24 outline outline-offset-2 outline-yellow-400 text-5xl font-medium
           text-white ${playerOnePoints > playerTwoPoints
              ? 'bg-green-400  drop-shadow-glow'
              : 'bg-green-400 brightness-75 '
            } shadow-xl
           rounded-full flex justify-center items-center`}
        >
          {playerOnePoints}
        </div>
      </div>
    )
    tilesElements[i][cols - 1] = (
      <div
        className={`bg-gray-800 h-48 w-full flex items-center justify-center border-solid border-2 border-black`}
        key={`${i}-${cols - 1}`}
      >
        <div
          className={`h-24 w-24 outline outline-offset-2 outline-yellow-400 
          ${playerTwoPoints > playerOnePoints
              ? 'bg-red-400 drop-shadow-glow'
              : 'bg-red-400 brightness-75 '
            } text-5xl text-white font-medium shadow-xl rounded-full
           flex justify-center items-center`}
        >
          {playerTwoPoints}
        </div>
      </div>
    )
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 1; j < cols - 1; j++) {
      const color = (i + j) % 2 === 0 ? 'bg-white' : 'bg-gray-800'
      tilesElements[i][j] = (
        <div
          className={`${color} h-48 w-full border-solid border-4 hover:border-4 ${!tiles[i][j - 1].card ? 'flex justify-center items-center' : ''}  border-black
           ${selectedCard ? (canAddCardToPosition(selectedCard, tiles[i][j - 1]) ? 'cursor-pointer  hover:border-green-400' : 'cursor-not-allowed hover:border-red-400') : ''}
           transition duration-300 ease-out`}
          onClick={() => { }}
          key={`${i}-${j}`}
        >
          {!tiles[i][j - 1].card ? (
            <div className="text-5xl font-bold text-center ">
              {tiles[i][j - 1] && tiles[i][j - 1].playerOnePawns > 0 && (
                <>
                  <p>{'♟'.repeat(tiles[i][j - 1].playerOnePawns)}</p>
                  <hr className="rounded mt-4 border-2 border-green-400" />
                </>
              )}
              {tiles[i][j - 1] && tiles[i][j - 1].playerTwoPawns > 0 && (
                <>
                  <p>{'♟'.repeat(tiles[i][j - 1].playerTwoPawns)}</p>
                  <hr className="rounded mt-4 border-2 border-red-400" />
                </>
              )}
            </div>
          ) : (
            <div className="flex h-full w-full p-2 justify-center items-center">
              <Card placed={true} card={tiles[i][j - 1].card} />
            </div>
          )}
        </div>
      )
    }
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex w-full items-center justify-evenly">
          <div className="flex flex-col items-center justify-center gap-3">
            <h2 className={`text-8xl scale-x-[-1] `}>🐉</h2>
            <h1 className="text-5xl">
              {amIP1 ? 'Player 1' : 'Player 2'}
            </h1>
          </div>
          <div className="grid grid-cols-7 gap-1 w-8/12">
            {tilesElements}
          </div>
          <div className="flex flex-col items-center justify-center gap-3">
            <h2 className={`text-8xl`}>🐉</h2>
            <h1 className="text-5xl">
              {!amIP1 ? 'Player 1' : 'Player 2'}
            </h1>
          </div>
        </div>
        <div className="flex w-10/12 items-center justify-end p-2">
          <h1
            className="mr-8 text-4xl rounded-full bg-gray-50 hover:bg-gray-200 transition duration-200
         shadow-xl cursor-pointer  text-black border-4 border-yellow-400 py-1 px-12"
            onClick={() => handleSkipTurn()}
          >
            Skip turn
          </h1>
        </div>
      </div>
    </>
  )
}
