import type { CardInfo } from '../@types/Card'
import Pawn from './Pawn'
import { cn } from '../utils/cn'

type DeckBuilderCardProps = {
  card: CardInfo
  count: number
  disabled: boolean
  onClick: () => void
}

function fillPositions(pawns: number[][], effects?: number[][]) {
  const positions = new Array(25).fill(0)
  for (const [x, y] of pawns) {
    positions[12 + x + -y * 5] = 1
  }
  if (effects) {
    for (const [x, y] of effects) {
      const idx = 12 + x + -y * 5
      positions[idx] = positions[idx] === 1 ? 3 : 2
    }
  }
  return positions
}

export default function DeckBuilderCard({
  card,
  count,
  disabled,
  onClick,
}: DeckBuilderCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex flex-col rounded-lg overflow-hidden border transition-all aspect-[3/5]',
        disabled
          ? 'opacity-40 cursor-not-allowed border-gray-500'
          : 'border-gray-700 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 cursor-pointer',
      )}
    >
      <div className="flex flex-col justify-between flex-1 bg-gray-800 p-1 md:p-1.5">
        {/* Top row: pawns + points */}
        <div className="flex justify-between items-center">
          <span className="flex -space-x-1.5 md:-space-x-1">
            {Array.from({ length: card.pawnsCost }).map((_, idx) => (
              <Pawn key={idx} color="white" className="h-3 w-3 md:h-4 md:w-4" />
            ))}
          </span>
          <span className="flex items-center justify-center border border-yellow-400 rounded-full bg-gray-900 text-yellow-400 font-bold text-[9px] md:text-xs w-4 h-4 md:w-5 md:h-5">
            {card.points}
          </span>
        </div>

        {/* Grid */}
        <div className="flex justify-center items-center py-1 md:py-2">
          <div className="grid grid-cols-5 border border-gray-600">
            {fillPositions(card.pawnsPositions, card.effectPositions).map((pawn, index) => (
              <div
                key={index}
                className={cn(
                  'h-2.5 w-2.5 md:h-3.5 md:w-3.5 border-[0.5px] border-gray-600',
                  index === 12
                    ? 'bg-white'
                    : pawn === 3
                      ? 'bg-yellow-400 outline outline-[1.5px] -outline-offset-[1.5px] outline-red-500'
                      : pawn === 2
                        ? 'bg-gray-700 outline outline-[1.5px] -outline-offset-[1.5px] outline-red-500'
                        : pawn === 1
                          ? 'bg-yellow-400'
                          : 'bg-gray-700',
                )}
              />
            ))}
          </div>
        </div>

        {/* Name */}
        <div title={card.description} className="text-yellow-400 text-[8px] md:text-[10px] leading-tight text-center font-medium truncate">
          {card.name}
        </div>
      </div>

      {/* Count badge */}
      <div
        className={cn(
          'text-[10px] md:text-xs font-semibold text-center py-0.5',
          count >= 2
            ? 'bg-yellow-400 text-gray-900'
            : count > 0
              ? 'bg-gray-700 text-yellow-400'
              : 'bg-gray-800 text-gray-500',
        )}
      >
        {count}/2
      </div>
    </button>
  )
}
