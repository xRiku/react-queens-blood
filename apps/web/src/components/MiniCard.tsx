import type { CardInfo } from '../@types/Card'
import Pawn from './Pawn'
import { cn } from '../utils/cn'
import { fillCardGrid } from '../utils/cardGrid'

type MiniCardProps = {
  card: CardInfo
  className?: string
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
          {fillCardGrid(card.pawnsPositions, card.effectPositions).map((pawn, index) => (
            <div
              key={index}
              className={cn(
                'h-2 w-2 border-solid border-[0.5px] border-black',
                index === 12
                  ? 'bg-white'
                  : pawn === 3
                    ? 'bg-yellow-400 outline outline-[1.5px] -outline-offset-[1.5px] outline-red-500'
                    : pawn === 2
                      ? 'bg-gray-400 outline outline-[1.5px] -outline-offset-[1.5px] outline-red-500'
                      : pawn === 1
                        ? 'bg-yellow-400'
                        : 'bg-gray-400',
              )}
            />
          ))}
        </div>
      </div>

      {/* Name */}
      <div title={card.description} className="bg-black text-yellow-400 text-[7px] leading-tight text-center px-0.5 py-0.5 rounded-b font-medium truncate flex items-center justify-center gap-0.5">
        {card.name}
      </div>
    </div>
  )
}
