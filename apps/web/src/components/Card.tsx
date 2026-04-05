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
  const points = effectivePoints !== undefined ? effectivePoints : card!.points
  const delta = points - card!.points
  const hasDelta = delta !== 0

  const grid = (
    <div className="grid grid-cols-5 border-black border">
      {fillCardGrid(card!.pawnsPositions, card!.effectPositions).map((pawn, index) => {
        const borderClass = placed
          ? 'border-solid border-[0.5px] md:border-[1.5px] border-black'
          : 'border-solid border md:border-2 border-black'
        const effectBorderClass = placed
          ? 'border-solid border-[0.5px] md:border-[1.5px] border-red-500'
          : 'border-solid border md:border-2 border-red-500'

        if (index === 12) {
          return <div key={index} className={cn(cellSize, borderClass, 'bg-white')} />
        }

        if (pawn === 3) {
          return <div key={index} className={cn(cellSize, effectBorderClass, 'bg-yellow-400')} />
        }

        if (pawn === 2) {
          return <div key={index} className={cn(cellSize, effectBorderClass, 'bg-gray-400')} />
        }

        if (pawn === 1) {
          return <div key={index} className={cn(cellSize, borderClass, 'bg-yellow-400')} />
        }

        return <div key={index} className={cn(cellSize, borderClass, 'bg-gray-400')} />
      })}
    </div>
  )

  if (placed) {
    return (
      <div
        className={cn(
          'relative w-full h-full rounded-md border border-gray-400 overflow-hidden',
          getPlacedBgColor(amIP1, card?.placedByPlayerOne),
        )}
      >
        <div className="absolute top-0 left-0 right-0 h-5 md:h-9 xl:h-11 px-1 pt-0.5 md:px-1.5 md:pt-1 flex items-start justify-between">
          <span className="flex -space-x-1">
            {Array.from({ length: card!.pawnsCost }).map((_, idx) => (
              <Pawn
                key={idx}
                color="black"
                className="h-2 w-2 md:h-3 md:w-3 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5"
              />
            ))}
          </span>
          <span className="flex items-start gap-0.5">
            {hasDelta && (
              <span className={cn(
                'font-bold leading-none rounded px-0.5 text-[6px] md:text-[8px] xl:text-[10px]',
                delta > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white',
              )}>
                {delta > 0 ? '+' : ''}{delta}
              </span>
            )}
            <span className={cn(
              'flex items-center justify-center border font-semibold border-solid rounded-full w-3.5 h-3.5 text-[8px] md:w-7 md:h-7 md:text-sm xl:w-10 xl:h-10 xl:text-base 2xl:w-12 2xl:h-12 2xl:text-xl',
              delta > 0
                ? 'bg-green-200 border-green-500'
                : delta < 0
                  ? 'bg-red-200 border-red-500'
                  : 'bg-white border-yellow-400',
            )}
            >
              {points}
            </span>
          </span>
        </div>

        <div className="absolute top-5 md:top-9 xl:top-11 bottom-0 left-0 right-0 flex items-center justify-center">
          {grid}
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col justify-between w-full h-full rounded-lg bg-white">
      {hasDelta && (
        <span className={cn(
          'absolute top-0 right-0 z-10 font-bold leading-none rounded px-0.5 text-[7px] md:text-[10px]',
          delta > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white',
        )}>
          {delta > 0 ? '+' : ''}{delta}
        </span>
      )}

      <div className="flex justify-between items-center">
        <span className="flex -space-x-1">
          {Array.from({ length: card!.pawnsCost }).map((_, idx) => (
            <Pawn key={idx} color="black" className="h-3.5 w-3.5 md:h-7 md:w-7" />
          ))}
        </span>
        <span className={cn(
          'flex items-center justify-center border font-semibold border-solid rounded-full p-0.5 md:p-2 w-7 h-7 text-sm md:w-14 md:h-14 md:text-3xl',
          delta > 0
            ? 'bg-green-200 border-green-500'
            : delta < 0
              ? 'bg-red-200 border-red-500'
              : 'bg-white border-yellow-400',
        )}
        >
          {points}
        </span>
      </div>

      <div className="flex justify-center items-center min-h-0">
        {grid}
      </div>

      <div
        title={card!.description}
        className={cn(
          'flex items-center justify-center font-medium w-full bg-black border-t-2 border-t-yellow-400 text-yellow-400 leading-tight text-center overflow-hidden whitespace-nowrap rounded-b-md text-[10px] md:text-sm xl:text-base 2xl:text-xl px-1 md:px-4 py-0.5 md:py-2',
          card!.name.length > 10 && 'text-[8px] md:text-xs xl:text-sm 2xl:text-base',
        )}
      >
        <span className="block w-full truncate text-center">{card!.name}</span>
      </div>
    </div>
  )
}
