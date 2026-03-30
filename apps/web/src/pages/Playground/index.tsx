import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/cn'

type IndicatorTone = 'buff' | 'debuff' | null
type AnimStyle = 'bounce' | 'pulse' | 'elastic' | 'jolt' | 'drift' | 'chase'

const ROWS = 3
const COLS = 5

const indicatorMap: Record<string, IndicatorTone> = {
  '0-1': 'buff',
  '0-3': 'debuff',
  '1-0': 'debuff',
  '1-2': 'buff',
  '1-4': 'buff',
  '2-2': 'debuff',
  '2-4': 'buff',
}

const occupiedTiles = ['0-1', '1-2', '1-4', '2-2']

const animVariants: { style: AnimStyle; label: string; description: string; feel: string }[] = [
  {
    style: 'bounce',
    label: 'A. Bounce',
    description: 'Smooth translateY oscillation in the arrow\'s direction.',
    feel: 'Playful, energetic — like a buff ready to fire',
  },
  {
    style: 'pulse',
    label: 'B. Pulse',
    description: 'Scales down and fades, no movement. Rhythmic breathing.',
    feel: 'Calm, sustained — passive aura effect',
  },
  {
    style: 'elastic',
    label: 'C. Elastic',
    description: 'Shoots past the target, overshoots back, settles. Spring physics.',
    feel: 'Powerful, emphatic — just gained an advantage',
  },
  {
    style: 'jolt',
    label: 'D. Jolt',
    description: 'Three decreasing bumps then a long rest before repeating.',
    feel: 'Urgent, active — drawing attention to a volatile effect',
  },
  {
    style: 'drift',
    label: 'E. Drift',
    description: 'Floats continuously in its direction, fades out, resets. Looping particle.',
    feel: 'Ethereal, magical — an enchantment bleeding energy',
  },
  {
    style: 'chase',
    label: 'F. Chase',
    description: 'Two arrows drifting in sequence, half a cycle apart. Endless parade.',
    feel: 'Accumulating, overwhelming — a stacking or multiplying effect',
  },
]

// ─── Arrow shape (no animation) ───────────────────────────────────────────────

function ArrowShape({
  direction,
  color,
}: {
  direction: 'up' | 'down'
  color: string
}) {
  const head = 'w-[9px] h-[7px]'
  const stem = 'w-[3px] h-[5px]'
  if (direction === 'up') {
    return (
      <div className="flex flex-col items-center">
        <div className={cn(head, color)} style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        <div className={cn(stem, color, 'rounded-sm')} />
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center">
      <div className={cn(stem, color, 'rounded-sm')} />
      <div className={cn(head, color)} style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
    </div>
  )
}

// ─── Animated arrow — applies the right CSS class per variant ─────────────────

function AnimatedArrow({
  direction,
  animStyle,
}: {
  direction: 'up' | 'down'
  animStyle: AnimStyle
}) {
  const color = direction === 'up' ? 'bg-green-500' : 'bg-red-500'
  const shape = <ArrowShape direction={direction} color={color} />

  if (animStyle === 'bounce') {
    return (
      <div className={direction === 'up' ? 'arrow-up-bounce' : 'arrow-down-bounce'}>
        {shape}
      </div>
    )
  }

  if (animStyle === 'pulse') {
    return <div className="arrow-pulse">{shape}</div>
  }

  if (animStyle === 'elastic') {
    return (
      <div className={direction === 'up' ? 'arrow-elastic-up' : 'arrow-elastic-down'}>
        {shape}
      </div>
    )
  }

  if (animStyle === 'jolt') {
    return (
      <div className={direction === 'up' ? 'arrow-jolt-up' : 'arrow-jolt-down'}>
        {shape}
      </div>
    )
  }

  if (animStyle === 'drift') {
    return (
      <div className={direction === 'up' ? 'arrow-drift-up' : 'arrow-drift-down'}>
        {shape}
      </div>
    )
  }

  // Chase — two arrows at same position, second offset by half the drift duration
  if (animStyle === 'chase') {
    const driftClass = direction === 'up' ? 'arrow-drift-up' : 'arrow-drift-down'
    return (
      <div className="relative" style={{ width: 9, height: 16 }}>
        <div className={cn('absolute inset-0 flex flex-col items-center justify-center', driftClass)}>
          {shape}
        </div>
        <div
          className={cn('absolute inset-0 flex flex-col items-center justify-center', driftClass)}
          style={{ animationDelay: '0.55s' }}
        >
          {shape}
        </div>
      </div>
    )
  }

  return <div>{shape}</div>
}

// ─── Board ────────────────────────────────────────────────────────────────────

function Tile({
  tone, occupied, index, animStyle,
}: {
  tone: IndicatorTone; occupied: boolean; index: number; animStyle: AnimStyle
}) {
  return (
    <div className={cn(
      'relative h-12 w-full rounded-sm border-2 border-black overflow-hidden',
      index % 2 === 0 ? 'bg-white' : 'bg-gray-800',
    )}>
      {occupied && (
        <div className="absolute inset-1 rounded-sm border border-yellow-500 bg-yellow-200/90 z-10" />
      )}
      {tone && (
        <div className="pointer-events-none absolute top-0.5 right-0.5 z-20">
          <AnimatedArrow
            direction={tone === 'buff' ? 'up' : 'down'}
            animStyle={animStyle}
          />
        </div>
      )}
    </div>
  )
}

function VariantCard({ style, label, description, feel }: typeof animVariants[number]) {
  return (
    <div className="rounded-lg border border-black bg-white p-4 flex flex-col gap-3">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-sm font-bold font-title">{label}</h3>
          <div className="flex items-center gap-2">
            <AnimatedArrow direction="up" animStyle={style} />
            <AnimatedArrow direction="down" animStyle={style} />
          </div>
        </div>
        <p className="text-xs text-gray-600">{description}</p>
        <p className="text-xs text-gray-400 italic mt-0.5">{feel}</p>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: ROWS * COLS }).map((_, idx) => {
          const key = `${Math.floor(idx / COLS)}-${idx % COLS}`
          return (
            <Tile
              key={key}
              index={idx}
              tone={indicatorMap[key] ?? null}
              occupied={occupiedTiles.includes(key)}
              animStyle={style}
            />
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Playground() {
  const navigate = useNavigate()

  return (
    <div className="w-full max-w-5xl px-5 py-8 md:py-10">
      <h2 className="text-2xl md:text-3xl font-title">Issue #16 — Arrow Animation Styles</h2>
      <p className="mt-1 text-sm text-gray-500">
        Same shape, six different animations. Colors fixed (green up / red down) so the motion is the focus.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {animVariants.map(v => (
          <VariantCard key={v.style} {...v} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate('/')}
          className="rounded-md w-48 px-4 py-2 border text-black border-black hover:bg-gray-700 hover:border-gray-700 group active:translate-y-0.5"
        >
          <span className="text-lg font-medium text-black group-hover:text-white">Back Home</span>
        </button>
      </div>
    </div>
  )
}
