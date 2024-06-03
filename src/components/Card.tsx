import { CardInfo } from '../@types/Card'

type CardProps = {
  card: CardInfo | null
  placed?: boolean
}

export default function Card({ card, placed = false }: CardProps) {
  function fillMonsterPositions(points: number[][]) {
    const positions: number[] = new Array(25).fill(0)
    const startingNumber = 12

    for (const i in points) {
      const x: number = Number(points[i][0])
      const y: number = Number(points[i][1])
      positions[startingNumber + x + -y * 5] = 1
    }

    return positions
  }

  return (
    <div
      className={`flex flex-col justify-between ${placed ? 'border border-gray-300' : ''} w-full h-full ${placed ? (card?.placedByPlayerOne ? 'bg-green-400' : 'bg-red-400') : ''}  rounded-lg`}
    >
      <div className="flex justify-between items-center">
        <span className="p-2 text-3xl">{'♟'.repeat(card!.pawnsCost)}</span>
        <span className="p-2 text-3xl flex items-center justify-center w-14 border font-semibold border-solid bg-white border-yellow-400 rounded-full">
          {card!.points}
        </span>
      </div>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-5 border-black border">
          {fillMonsterPositions(card!.pawnsPositions).map((pawn, index) => {
            if (index === 12) {
              return (
                <div
                  key={index}
                  className={`h-4 w-4 border-solid border-2 border-black bg-white`}
                ></div>
              )
            }

            if (pawn === 1) {
              return (
                <div
                  key={index}
                  className={`h-4 w-4 border-solid border-2 border-black bg-yellow-400`}
                ></div>
              )
            }

            return (
              <div
                key={index}
                className={`h-4 w-4 border-solid border-2 border-black bg-gray-400`}
              ></div>
            )
          })}
        </div>
      </div>
      <div className="flex items-center justify-center rounded-b-md font-medium w-full bg-black border-t-2 border-t-yellow-400 text-yellow-400 text-2xl px-4 py-2">
        {card!.name}
      </div>
    </div>
  )
}
