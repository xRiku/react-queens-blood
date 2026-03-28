import { CardInfo } from '../@types/Card'
import Pawn from './Pawn'
import { cn } from '../utils/cn'
import { fillCardGrid } from '../utils/cardGrid'

type CardProps = {
  card: CardInfo | null
  placed?: boolean
  amIP1?: boolean
  effectivePoints?: number
}

function getPlacedBgColor(amIP1: boolean | undefined, placedByPlayerOne: boolean | undefined) {
  if (amIP1) {
    return placedByPlayerOne ? 'bg-green-400' : 'bg-red-400'
  }
  return placedByPlayerOne ? 'bg-red-400' : 'bg-green-400'
}

export default function Card({ card, placed = false, amIP1, effectivePoints }: CardProps) {
  const cellSize = placed
    ? 'h-1 w-1 md:h-2 md:w-2 xl:h-3 xl:w-3'
    : 'h-2 w-2 md:h-3 md:w-3 2xl:h-4 2xl:w-4'

  return (
    <div
      className={cn(
        'flex flex-col justify-between w-full h-full rounded-lg',
        placed ? 'border border-gray-400 overflow-hidden' : 'bg-white',
        placed && getPlacedBgColor(amIP1, card?.placedByPlayerOne),
      )}
    >
      <div className="flex justify-between items-center">
        <span className={cn(
          placed
            ? 'p-0.5 md:p-1 text-[8px] md:text-sm xl:text-base 2xl:text-xl'
            : 'p-0.5 md:p-2 text-sm md:text-3xl',
        )}
        >
          <span className="flex -space-x-1">
            {Array.from({ length: card!.pawnsCost }).map((_, idx) => (
              <Pawn
                key={idx}
                color="black"
                className={cn(
                  placed
                    ? 'h-2 w-2 md:h-3.5 md:w-3.5 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5'
                    : 'h-3.5 w-3.5 md:h-7 md:w-7',
                )}
              />
            ))}
          </span>
        </span>
        <span className={cn(
          'flex items-center justify-center border font-semibold border-solid rounded-full',
          placed
            ? 'p-0 md:p-1 w-4 h-4 text-[8px] md:w-8 md:h-8 md:text-sm xl:w-10 xl:h-10 xl:text-base 2xl:w-12 2xl:h-12 2xl:text-xl'
            : 'p-0.5 md:p-2 w-7 h-7 text-sm md:w-14 md:h-14 md:text-3xl',
          effectivePoints !== undefined && effectivePoints > card!.points
            ? 'bg-green-200 border-green-500'
            : effectivePoints !== undefined && effectivePoints < card!.points
              ? 'bg-red-200 border-red-500'
              : 'bg-white border-yellow-400',
        )}
        >
          {effectivePoints !== undefined ? effectivePoints : card!.points}
        </span>
      </div>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-5 border-black border">
          {fillCardGrid(card!.pawnsPositions, card!.effectPositions).map((pawn, index) => {
            const borderClass = placed
              ? 'border-solid border-[0.5px] md:border-[1.5px] border-black'
              : 'border-solid border md:border-2 border-black'
            const effectBorderClass = placed
              ? 'border-solid border-[0.5px] md:border-[1.5px] border-red-500'
              : 'border-solid border md:border-2 border-red-500'

            if (index === 12) {
              return (
                <div
                  key={index}
                  className={cn(cellSize, borderClass, 'bg-white')}
                />
              )
            }

            if (pawn === 3) {
              return (
                <div
                  key={index}
                  className={cn(cellSize, effectBorderClass, 'bg-yellow-400')}
                />
              )
            }

            if (pawn === 2) {
              return (
                <div
                  key={index}
                  className={cn(cellSize, effectBorderClass, 'bg-gray-400')}
                />
              )
            }

            if (pawn === 1) {
              return (
                <div
                  key={index}
                  className={cn(cellSize, borderClass, 'bg-yellow-400')}
                />
              )
            }

            return (
              <div
                key={index}
                className={cn(cellSize, borderClass, 'bg-gray-400')}
              />
            )
          })}
        </div>
      </div>
      <div title={card!.description} className={cn(
        'flex items-center justify-center gap-0.5 rounded-b-md font-medium w-full bg-black border-t-2 border-t-yellow-400 text-yellow-400 leading-tight text-center',
        placed
          ? 'text-[7px] md:text-xs xl:text-sm 2xl:text-base px-0.5 md:px-1 py-0 md:py-0.5'
          : 'text-[10px] md:text-sm xl:text-base 2xl:text-xl px-1 md:px-4 py-0.5 md:py-2',
        card!.name.length > 10 && (placed
          ? 'text-[5px] md:text-[10px] xl:text-xs 2xl:text-sm'
          : 'text-[8px] md:text-xs xl:text-sm 2xl:text-base'),
      )}
      >
        {card!.name}
      </div>
    </div>
  )
}
