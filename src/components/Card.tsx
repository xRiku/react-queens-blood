import { CardInfo } from '../@types/Card'

type CardProps = {
  card: CardInfo | null
  placed?: boolean
  amIP1?: boolean
}

export default function Card({ card, placed = false, amIP1 }: CardProps) {
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
      className={`flex flex-col justify-between ${placed ? 'border border-gray-300' : ''} w-full h-full ${amIP1 ? placed ? (card?.placedByPlayerOne ? 'bg-green-400' : 'bg-red-400') : '' : placed ? (card?.placedByPlayerOne ? 'bg-red-400' : 'bg-green-400') : ''} rounded-lg`}
    >
      <div className="flex justify-between items-center">
        <span className={`p-2 ${placed ? 'text-xl' : 'text-3xl'}`}>{'♟'.repeat(card!.pawnsCost)}</span>
        <span className={`p-2  flex items-center justify-center ${placed ? 'w-12 text-xl' : 'w-14 text-3xl'} border font-semibold border-solid bg-white border-yellow-400 rounded-full`}>
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
                  className={`${placed ? 'h-3 w-3' : 'h-4 w-4'} border-solid border-2 border-black bg-white`}
                ></div>
              )
            }

            if (pawn === 1) {
              return (
                <div
                  key={index}
                  className={`${placed ? 'h-3 w-3' : 'h-4 w-4'} border-solid border-2 border-black bg-yellow-400`}
                ></div>
              )
            }

            return (
              <div
                key={index}
                className={`${placed ? 'h-3 w-3' : 'h-4 w-4'} border-solid border-2 border-black bg-gray-400`}
              ></div>
            )
          })}
        </div>
      </div>
      <div className={`flex items-center justify-center rounded-b-md font-medium w-full bg-black border-t-2 border-t-yellow-400 text-yellow-400 text-xl px-4 py-2`}>
        {card!.name}
      </div>
    </div>
  )
}
