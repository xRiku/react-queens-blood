import { cn } from '../utils/cn'

// ─── Buff — amber 4-pointed sparkle ──────────────────────────────────────────

export function SparkleAnim({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const mainH = size === 'sm' ? 'h-3' : size === 'md' ? 'h-[18px]' : 'h-[26px]'
  const diagH = size === 'sm' ? 'h-2' : size === 'md' ? 'h-[13px]' : 'h-[19px]'
  const coreWH = size === 'sm' ? 'w-[5px] h-[5px]' : size === 'md' ? 'w-[7px] h-[7px]' : 'w-[10px] h-[10px]'
  const container = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-[18px] h-[18px]' : 'w-[26px] h-[26px]'
  return (
    <div className={cn('relative flex items-center justify-center shrink-0', container)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn('w-px rounded-full sparkle-ray-main bg-amber-400', mainH)} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center rotate-90">
        <div className={cn('w-px rounded-full sparkle-ray-main bg-amber-400', mainH)} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center rotate-45">
        <div className={cn('w-px rounded-full sparkle-ray-diag bg-amber-400', diagH)} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center -rotate-45">
        <div className={cn('w-px rounded-full sparkle-ray-diag bg-amber-400', diagH)} />
      </div>
      <div className={cn('absolute rounded-full sparkle-core-dot bg-amber-200', coreWH)} />
    </div>
  )
}

// ─── Debuff — purple 3-pointed irregular star (Tri) ──────────────────────────

export function TriStarAnim({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scale = size === 'sm' ? 0.68 : size === 'md' ? 1 : 1.45
  const container = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-[18px] h-[18px]' : 'w-[26px] h-[26px]'
  const rays = [
    { angle: 5,   length: 17, width: 1, delay: 0,    duration: 1.15 },
    { angle: 128, length: 13, width: 2, delay: 0.25, duration: 0.95 },
    { angle: 252, length: 16, width: 1, delay: 0.45, duration: 1.05 },
  ]
  return (
    <div className={cn('relative flex items-center justify-center shrink-0', container)}>
      {rays.map((ray, i) => (
        <div
          key={i}
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `rotate(${ray.angle}deg)` }}
        >
          <div
            className="rounded-full x-mark-ray bg-purple-700"
            style={{
              width: Math.max(1, Math.round(ray.width * scale)),
              height: Math.max(3, Math.round(ray.length * scale)),
              animationDelay: `${ray.delay}s`,
              animationDuration: `${ray.duration}s`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

// ─── Badge wrapper used on the board ─────────────────────────────────────────

export function TileEffectBadge({ indicator }: { indicator: 'up' | 'down' | 'mixed' }) {
  return (
    <span className="flex items-center justify-center">
      {indicator === 'up'    && <SparkleAnim size="lg" />}
      {indicator === 'down'  && <TriStarAnim size="lg" />}
      {indicator === 'mixed' && (
        <div className="flex items-center gap-0.5">
          <SparkleAnim size="sm" />
          <TriStarAnim size="sm" />
        </div>
      )}
    </span>
  )
}
