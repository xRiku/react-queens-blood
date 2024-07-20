import { CardInfo } from '../@types/Card'

type CardProps = {
  card: CardInfo | null
  placed?: boolean
  amIP1?: boolean
}

export default function Card({ card, placed = false, amIP1 }: CardProps) {
  function fillMonsterPositionsAndEffects(card: CardInfo): { hasPawn: boolean, hasEffect: boolean }[] {
    const points = card?.pawnsPositions
    const effectPoints = card?.affectedPositions

    const positions: { hasPawn: boolean, hasEffect: boolean }[] = new Array(25).fill({
      hasPawn: false,
      hasEffect: false,
    })
    const startingNumber = 12

    for (const i in points) {
      const x: number = Number(points[i][0])
      const y: number = Number(points[i][1])
      positions[startingNumber + x + -y * 5] = {
        ...positions[startingNumber + x + -y * 5],
        hasPawn: true,
      }
    }
    if (!effectPoints) return positions

    for (const j in effectPoints) {
      const x: number = Number(effectPoints[j][0])
      const y: number = Number(effectPoints[j][1])
      positions[startingNumber + x + -y * 5] = {
        ...positions[startingNumber + x + -y * 5],
        hasEffect: true,
      }
    }
    console.log(positions)
    return positions
  }

  return (
    <div
      className={`flex flex-col justify-between ${placed ? 'border border-gray-400' : 'bg-white'}
      w-full h-full ${amIP1 ? placed ? (card?.placedByPlayerOne ? 'bg-green-400' : 'bg-red-400') : '' :
          placed ? (card?.placedByPlayerOne ? 'bg-red-400' : 'bg-green-400') : ''} 
         rounded-lg`
      }
    >
      <div className="flex justify-between items-center">
        <span className={`p-2 ${placed ? 'text-xl' : 'text-3xl'}`}>{'♟'.repeat(card!.pawnsCost)}</span>
        <span className={`p-2  flex items-center justify-center ${placed ? 'w-12 text-xl' : 'w-14 text-3xl'} border font-semibold border-solid bg-white border-yellow-400 rounded-full`}>
          {card!.points}
        </span>
      </div>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-5 border-black border">
          {card && fillMonsterPositionsAndEffects(card).map((cardTile, index) => {
            if (index === 12) {
              return (
                <div
                  key={index}
                  className={`${placed ? 'h-3 w-3' : 'h-4 w-4'} border-solid border-2 border-black bg-white`}
                ></div>
              )
            }

            if (cardTile.hasPawn === true) {
              return (
                <div
                  key={index}
                  className={`${placed ? 'h-3 w-3' : 'h-4 w-4'}  border-black ${cardTile.hasEffect ? 'border-[1.5px]' : 'border-2'}`}>
                  <div
                    className={`w-full h-full border-solid bg-yellow-400 ${cardTile.hasEffect ? 'border-red-400 border-[3px]' : ''}`}
                  ></div>
                </div>
              )
            }

            if (cardTile.hasEffect === true) {
              return (
                <div
                  key={index}
                  className={`${placed ? 'h-3 w-3' : 'h-4 w-4'}  border-black ${cardTile.hasEffect ? 'border-[1.5px]' : 'border-2'}`}>
                  <div
                    className={`w-full h-full border-solid bg-gray-400 ${cardTile.hasEffect ? 'border-red-400 border-[3px]' : ''}`}
                  ></div>
                </div>
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
