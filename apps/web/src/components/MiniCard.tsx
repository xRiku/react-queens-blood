import type { CardInfo } from '../@types/Card'
import Pawn from './Pawn'
import { cn } from '../utils/cn'

type MiniCardProps = {
  card: CardInfo
  className?: string
}

function fillPositions(points: number[][]) {
  const positions = new Array(25).fill(0)
  for (const [x, y] of points) {
    positions[12 + x + -y * 5] = 1
  }
  return positions
}

export default function MiniCard({ card, className }: MiniCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between w-full h-full rounded bg-white',
        className,
      )}
    >
      {/* Pawns + Points */}
      <div className="flex justify-between items-center px-0.5 pt-0.5">
        <span className="flex -space-x-0.5">
          {Array.from({ length: card.pawnsCost }).map((_, idx) => (
            <Pawn key={idx} color="black" className="h-3 w-3" />
          ))}
        </span>
        <span className="flex items-center justify-center border border-yellow-400 rounded-full bg-white text-black font-bold text-[8px] w-3.5 h-3.5">
          {card.points}
        </span>
      </div>

      {/* Grid */}
      <div className="flex-1 flex justify-center items-center">
        <div className="grid grid-cols-5 border-black border">
          {fillPositions(card.pawnsPositions).map((pawn, index) => (
            <div
              key={index}
              className={cn(
                'h-2 w-2 border-solid border-[0.5px] border-black',
                index === 12
                  ? 'bg-white'
                  : pawn === 1
                    ? 'bg-yellow-400'
                    : 'bg-gray-400',
              )}
            />
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="bg-black text-yellow-400 text-[7px] leading-tight text-center px-0.5 py-0.5 rounded-b font-medium truncate">
        {card.name}
      </div>
    </div>
  )
}
