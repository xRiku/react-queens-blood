import { cn } from '../utils/cn'

// ─── Arrow shape (no animation) ───────────────────────────────────────────────

function ArrowShape({
  direction,
  headColor,
  stemColor,
  size,
}: {
  direction: 'up' | 'down'
  headColor: string
  stemColor: string
  size: 'sm' | 'lg'
}) {
  const head = size === 'sm' ? 'w-[9px] h-[7px]'  : 'w-[13px] h-[10px]'
  const stem = size === 'sm' ? 'w-[3px] h-[5px]'  : 'w-[4px]  h-[8px]'
  if (direction === 'up') {
    return (
      <div className="flex flex-col items-center">
        <div className={cn(head, headColor)} style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        <div className={cn(stem, stemColor, 'rounded-sm')} />
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center">
      <div className={cn(stem, stemColor, 'rounded-sm')} />
      <div className={cn(head, headColor)} style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
    </div>
  )
}

// ─── Drift arrow — floats continuously in its direction, fades, resets ────────

function DriftArrow({
  direction,
  size = 'lg',
}: {
  direction: 'up' | 'down'
  size?: 'sm' | 'lg'
}) {
  const driftClass = direction === 'up' ? 'arrow-drift-up' : 'arrow-drift-down'
  const headColor  = direction === 'up' ? 'bg-green-500'   : 'bg-purple-700'
  const stemColor  = direction === 'up' ? 'bg-green-400'   : 'bg-purple-600'
  const w = size === 'sm' ? 9  : 13
  const h = size === 'sm' ? 16 : 22

  return (
    <div className="relative shrink-0" style={{ width: w, height: h }}>
      <div className={cn('absolute inset-0 flex flex-col items-center justify-center', driftClass)}>
        <ArrowShape direction={direction} headColor={headColor} stemColor={stemColor} size={size} />
      </div>
    </div>
  )
}

// ─── Badge wrapper used on the board ─────────────────────────────────────────

export function TileEffectBadge({ indicator }: { indicator: 'up' | 'down' | 'mixed' }) {
  return (
    <span className="flex items-center justify-center">
      {indicator === 'up'    && <DriftArrow direction="up" />}
      {indicator === 'down'  && <DriftArrow direction="down" />}
      {indicator === 'mixed' && (
        <div className="flex items-center gap-0.5">
          <DriftArrow direction="up"   size="sm" />
          <DriftArrow direction="down" size="sm" />
        </div>
      )}
    </span>
  )
}
