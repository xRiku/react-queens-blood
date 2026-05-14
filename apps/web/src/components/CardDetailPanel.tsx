import type { CardInfo } from '../@types/Card'
import { cn } from '../utils/cn'
import { fillCardGrid } from '../utils/cardGrid'
import Pawn from './Pawn'

type CardDetailPanelProps = {
  card: CardInfo | null
  className?: string
  compact?: boolean
  emptyLabel?: string
}

function getEffectTone(card: CardInfo) {
  if (!card.effect) return 'neutral'
  return card.effect.value > 0
    ? 'buff'
    : 'debuff'
}

function getEffectLabel(card: CardInfo) {
  if (!card.effect) return 'Standard card'
  const action = card.effect.value > 0
    ? `Power +${card.effect.value}`
    : `Power ${card.effect.value}`
  const target = card.effect.target === 'ally'
    ? 'allied cards'
    : 'enemy cards'
  const timing = card.effect.trigger === 'continuous'
    ? 'while in play'
    : 'when played'
  return `${action} to ${target} ${timing}`
}

function EffectGrid({ card, compact = false }: { card: CardInfo; compact?: boolean }) {
  const grid = fillCardGrid(card.pawnsPositions, card.effectPositions)
  const cellClass = compact
    ? 'size-2'
    : 'size-3 md:size-3.5'

  return (
    <div className="grid grid-cols-5 border border-black bg-gray-300">
      {grid.map((value, index) => {
        const isOrigin = index === 12
        const hasPawn = value === 1 || value === 3
        const hasEffect = value === 2 || value === 3

        return (
          <span
            key={index}
            className={cn(
              cellClass,
              'border border-black',
              isOrigin && 'bg-white',
              !isOrigin && !hasPawn && !hasEffect && 'bg-gray-400',
              hasPawn && !hasEffect && 'bg-yellow-400',
              hasEffect && !hasPawn && 'border-red-500 bg-gray-400',
              hasPawn && hasEffect && 'border-red-500 bg-yellow-400',
            )}
          />
        )
      })}
    </div>
  )
}

export default function CardDetailPanel({
  card,
  className,
  compact = false,
  emptyLabel = 'Hover or select a card to inspect its effect.',
}: CardDetailPanelProps) {
  if (!card) {
    return (
      <section
        aria-live="polite"
        className={cn(
          'rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-4 text-black shadow-lg',
          className,
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          Card details
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{emptyLabel}</p>
      </section>
    )
  }

  const tone = getEffectTone(card)
  const isBuff = tone === 'buff'
  const isDebuff = tone === 'debuff'
  const badgeClass = isBuff
    ? 'border-green-500 bg-green-50 text-green-700'
    : isDebuff
      ? 'border-red-500 bg-red-50 text-red-700'
      : 'border-gray-400 bg-gray-50 text-gray-700'

  return (
    <section
      aria-live="polite"
      className={cn(
        'rounded-lg border-2 border-black bg-white text-black shadow-xl',
        compact
          ? 'px-3 py-2.5'
          : 'px-4 py-4',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <EffectGrid card={card} compact={compact} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                Card details
              </p>
              <h3 className={cn('font-title leading-none', compact
                ? 'mt-1 text-xl text-black'
                : 'mt-1 text-3xl text-black')}
              >
                {card.name}
              </h3>
            </div>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-yellow-400 bg-white text-lg font-black text-black">
              {card.points}
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-black bg-white px-2 py-1 text-[11px] font-semibold text-black">
              {Array.from({ length: card.pawnsCost }).map((_, index) => (
                <Pawn key={index} color="black" className="size-3" />
              ))}
              Rank {card.pawnsCost}
            </span>
            <span className={cn('rounded-full border px-2 py-1 text-[11px] font-semibold', badgeClass)}>
              {card.effect
                ? (isDebuff
                    ? 'Debuff'
                    : 'Buff')
                : 'No ability'}
            </span>
          </div>

          <p className={cn('mt-3 font-medium leading-snug text-gray-900', compact
            ? 'text-xs md:text-sm'
            : 'text-sm md:text-base')}
          >
            {card.description}
          </p>

          <p className="mt-2 text-xs leading-relaxed text-gray-500">
            {getEffectLabel(card)}
          </p>
        </div>
      </div>
    </section>
  )
}
