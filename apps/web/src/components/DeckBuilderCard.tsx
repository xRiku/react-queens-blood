import type { CardInfo } from '../@types/Card'
import Pawn from './Pawn'
import { cn } from '../utils/cn'
import { fillCardGrid } from '../utils/cardGrid'

type DeckBuilderCardProps = {
  card: CardInfo
  count: number
  disabled: boolean
  onClick: () => void
}

export default function DeckBuilderCard({
  card,
  count,
  disabled,
  onClick,
}: DeckBuilderCardProps) {
  const countBadgeClass = count >= 2
    ? 'bg-yellow-400 text-black border-yellow-400'
    : count > 0
      ? 'bg-black text-yellow-400 border-yellow-400'
      : 'bg-white text-gray-500 border-gray-300'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group flex w-full flex-col items-center gap-1.5 text-left transition-[opacity,transform] duration-150',
        disabled
          ? 'cursor-not-allowed opacity-45'
          : 'cursor-pointer hover:-translate-y-0.5',
      )}
    >
      <div
        className={cn(
          'flex w-full flex-col overflow-hidden rounded-md border bg-white shadow-sm aspect-[2/3] transition-[border-color,box-shadow,opacity] duration-150',
          disabled
            ? 'border-gray-300'
            : 'border-gray-700 group-hover:border-black group-hover:shadow-md',
        )}
      >
        {/* Top row: pawns + points */}
        <div className="flex items-center justify-between px-1 pt-1 min-[480px]:px-1.5 min-[480px]:pt-1.5 md:px-2 md:pt-2">
          <span className="flex -space-x-1">
            {Array.from({ length: card.pawnsCost }).map((_, idx) => (
              <Pawn key={idx} color="black" className="size-4 min-[480px]:size-5 md:size-6" />
            ))}
          </span>
          <span className="flex size-5 items-center justify-center rounded-full border border-yellow-400 bg-white text-[10px] font-bold text-black min-[480px]:size-6 min-[480px]:text-xs md:size-7 md:text-base">
            {card.points}
          </span>
        </div>

        {/* Grid */}
        <div className="flex flex-1 items-center justify-center px-1 py-1 min-[480px]:px-1.5 min-[480px]:py-1.5 md:px-2 md:py-2">
          <div className="grid grid-cols-5 border-[1.5px] border-black md:border-2">
            {fillCardGrid(card.pawnsPositions, card.effectPositions).map((pawn, index) => (
              <div
                key={index}
                className={cn(
                  'size-3 border border-black min-[480px]:size-4 md:size-5 md:border-[1.5px]',
                  index === 12
                    ? 'bg-white'
                    : pawn === 3
                      ? 'bg-yellow-400 border-red-500'
                    : pawn === 2
                        ? 'bg-gray-400 border-red-500'
                        : pawn === 1
                          ? 'bg-yellow-400'
                          : 'bg-gray-400',
                )}
              />
            ))}
          </div>
        </div>

        {/* Name */}
        <div
          title={card.description}
          className="flex items-center justify-center border-t border-yellow-400 bg-black px-1 py-1 text-center text-[8px] font-medium leading-tight text-yellow-400 min-[480px]:px-1.5 min-[480px]:py-1.5 min-[480px]:text-[10px] md:px-2 md:py-2 md:text-xs"
        >
          <span className="block w-full truncate">{card.name}</span>
        </div>
      </div>

      {/* Count badge */}
      <span
        className={cn(
          'rounded-full border px-1.5 py-0.5 text-[9px] font-semibold leading-none min-[480px]:px-2 min-[480px]:text-[10px] md:text-xs',
          countBadgeClass,
        )}
      >
        {count}/2
      </span>
    </button>
  )
}
