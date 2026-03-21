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
      className={`flex flex-col justify-between ${placed
? 'border border-gray-400 overflow-hidden'
: 'bg-white'}
      w-full h-full ${amIP1
? placed
? (card?.placedByPlayerOne
? 'bg-green-400'
: 'bg-red-400')
: ''
          : placed
? (card?.placedByPlayerOne
? 'bg-red-400'
: 'bg-green-400')
: ''} 
         rounded-lg`}
    >
      <div className="flex justify-between items-center">
        <span className={`${placed
? 'p-1 text-sm xl:text-base 2xl:text-xl'
: 'p-2 text-3xl'}`}
        >{'♟'.repeat(card!.pawnsCost)}
        </span>
        <span className={`flex items-center justify-center ${placed
? 'p-1 w-8 h-8 text-sm xl:w-10 xl:h-10 xl:text-base 2xl:w-12 2xl:h-12 2xl:text-xl'
: 'p-2 w-14 h-14 text-3xl'} border font-semibold border-solid bg-white border-yellow-400 rounded-full`}
        >
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
                  className={`${placed
? 'h-2 w-2 xl:h-3 xl:w-3'
: 'h-3 w-3 2xl:h-4 2xl:w-4'} border-solid border-2 border-black bg-white`}
                />
              )
            }

            if (pawn === 1) {
              return (
                <div
                  key={index}
                  className={`${placed
? 'h-2 w-2 xl:h-3 xl:w-3'
: 'h-3 w-3 2xl:h-4 2xl:w-4'} border-solid border-2 border-black bg-yellow-400`}
                />
              )
            }

            return (
              <div
                key={index}
                className={`${placed
? 'h-2 w-2 xl:h-3 xl:w-3'
: 'h-3 w-3 2xl:h-4 2xl:w-4'} border-solid border-2 border-black bg-gray-400`}
              />
            )
          })}
        </div>
      </div>
      <div className={`flex items-center justify-center rounded-b-md font-medium w-full bg-black border-t-2 border-t-yellow-400 text-yellow-400 ${placed
? 'text-xs xl:text-sm 2xl:text-base px-1 py-0.5'
: 'text-sm xl:text-base 2xl:text-xl px-4 py-2'}`}
      >
        {card!.name}
      </div>
    </div>
  )
}
