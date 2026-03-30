import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/cn'

type IndicatorTone = 'buff' | 'debuff' | null

type DebuffStyle = 'penta' | 'spike' | 'tri' | 'comet' | 'oct' | 'hex'

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

type RayDef = { angle: number; length: number; width?: number; delay?: number; duration?: number }

// ─── Buff (settled) ───────────────────────────────────────────────────────────

function SparkleAnim({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const mainH = size === 'sm' ? 'h-3' : 'h-[18px]'
  const diagH = size === 'sm' ? 'h-2' : 'h-[13px]'
  const coreWH = size === 'sm' ? 'w-[5px] h-[5px]' : 'w-[7px] h-[7px]'
  const container = size === 'sm' ? 'w-3 h-3' : 'w-[18px] h-[18px]'
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

// ─── Star shape primitive ─────────────────────────────────────────────────────

function StarShape({ rays, size }: { rays: RayDef[]; size: 'sm' | 'md' }) {
  const scale = size === 'sm' ? 0.68 : 1
  const container = size === 'sm' ? 'w-3 h-3' : 'w-[18px] h-[18px]'
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
              width: Math.max(1, Math.round((ray.width ?? 1) * scale)),
              height: Math.max(3, Math.round(ray.length * scale)),
              animationDelay: `${ray.delay ?? 0}s`,
              animationDuration: `${ray.duration ?? 1.1}s`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

// ─── Debuff star variants ─────────────────────────────────────────────────────

// A. Penta — 5 points at irregular angles and lengths
const pentaRays: RayDef[] = [
  { angle: 0,   length: 15, width: 1, delay: 0,    duration: 1.0  },
  { angle: 68,  length: 10, width: 1, delay: 0.12, duration: 1.2  },
  { angle: 138, length: 13, width: 1, delay: 0.22, duration: 0.92 },
  { angle: 208, length: 8,  width: 2, delay: 0.30, duration: 1.15 },
  { angle: 295, length: 12, width: 1, delay: 0.08, duration: 1.05 },
]

// B. Spike — 6 points alternating long thin / short thick
const spikeRays: RayDef[] = [
  { angle: 0,   length: 16, width: 1, delay: 0,    duration: 1.0  },
  { angle: 60,  length: 7,  width: 2, delay: 0.10, duration: 0.85 },
  { angle: 120, length: 15, width: 1, delay: 0.20, duration: 1.05 },
  { angle: 180, length: 6,  width: 2, delay: 0.30, duration: 0.82 },
  { angle: 240, length: 14, width: 1, delay: 0.15, duration: 1.0  },
  { angle: 300, length: 7,  width: 2, delay: 0.25, duration: 0.88 },
]

// C. Tri — 3 elongated rays, aggressive and uneven
const triRays: RayDef[] = [
  { angle: 5,   length: 17, width: 1, delay: 0,    duration: 1.15 },
  { angle: 128, length: 13, width: 2, delay: 0.25, duration: 0.95 },
  { angle: 252, length: 16, width: 1, delay: 0.45, duration: 1.05 },
]

// D. Comet — one dominant arm + 4 shorter minor rays
const cometRays: RayDef[] = [
  { angle: 0,   length: 17, width: 1, delay: 0,    duration: 1.1  },
  { angle: 110, length: 8,  width: 1, delay: 0.12, duration: 0.9  },
  { angle: 162, length: 6,  width: 2, delay: 0.22, duration: 1.0  },
  { angle: 218, length: 9,  width: 1, delay: 0.18, duration: 1.2  },
  { angle: 290, length: 7,  width: 1, delay: 0.30, duration: 0.88 },
]

// E. Oct — 8 thin rays at irregular angles, dense and chaotic
const octRays: RayDef[] = [
  { angle: 0,   length: 14, width: 1, delay: 0,    duration: 1.0  },
  { angle: 38,  length: 9,  width: 1, delay: 0.08, duration: 1.15 },
  { angle: 85,  length: 12, width: 1, delay: 0.16, duration: 0.9  },
  { angle: 128, length: 7,  width: 1, delay: 0.24, duration: 1.05 },
  { angle: 170, length: 13, width: 1, delay: 0.32, duration: 0.95 },
  { angle: 218, length: 8,  width: 1, delay: 0.40, duration: 1.2  },
  { angle: 265, length: 11, width: 1, delay: 0.48, duration: 1.0  },
  { angle: 310, length: 6,  width: 1, delay: 0.56, duration: 0.88 },
]

// F. Hex — 6 rays at roughly 60° but with varied widths and lengths
const hexRays: RayDef[] = [
  { angle: 0,   length: 15, width: 1, delay: 0,    duration: 1.05 },
  { angle: 55,  length: 11, width: 2, delay: 0.10, duration: 0.9  },
  { angle: 120, length: 13, width: 1, delay: 0.20, duration: 1.1  },
  { angle: 175, length: 9,  width: 2, delay: 0.30, duration: 0.85 },
  { angle: 240, length: 16, width: 1, delay: 0.15, duration: 1.0  },
  { angle: 298, length: 10, width: 1, delay: 0.25, duration: 0.95 },
]

const debuffVariants: {
  style: DebuffStyle
  label: string
  description: string
  rays: RayDef[]
}[] = [
  { style: 'penta', label: 'A. Penta', rays: pentaRays,
    description: '5 points at uneven angles and unequal lengths. Off-balance.' },
  { style: 'spike', label: 'B. Spike', rays: spikeRays,
    description: '6 points alternating long+thin and short+thick. Jagged.' },
  { style: 'tri',   label: 'C. Tri',   rays: triRays,
    description: '3 elongated rays at irregular angles. Aggressive and minimal.' },
  { style: 'comet', label: 'D. Comet', rays: cometRays,
    description: 'One dominant arm, four minor rays. Asymmetric weight.' },
  { style: 'oct',   label: 'E. Oct',   rays: octRays,
    description: '8 thin rays at irregular angles with staggered timing. Dense.' },
  { style: 'hex',   label: 'F. Hex',   rays: hexRays,
    description: '6 rays near 60° apart but with varied widths and lengths.' },
]

const debuffRaysMap: Record<DebuffStyle, RayDef[]> = {
  penta: pentaRays, spike: spikeRays, tri: triRays,
  comet: cometRays, oct: octRays,    hex: hexRays,
}

// ─── Board ────────────────────────────────────────────────────────────────────

function Tile({
  tone, occupied, index, debuffStyle,
}: {
  tone: IndicatorTone; occupied: boolean; index: number; debuffStyle: DebuffStyle
}) {
  return (
    <div className={cn(
      'relative h-12 w-full rounded-sm border-2 border-black overflow-hidden',
      index % 2 === 0 ? 'bg-white' : 'bg-gray-800',
    )}>
      {occupied && (
        <div className="absolute inset-1 rounded-sm border border-yellow-500 bg-yellow-200/90 z-10" />
      )}
      {tone === 'buff' && (
        <div className="pointer-events-none absolute top-0.5 right-0.5 z-20">
          <SparkleAnim size="sm" />
        </div>
      )}
      {tone === 'debuff' && (
        <div className="pointer-events-none absolute top-0.5 right-0.5 z-20">
          <StarShape rays={debuffRaysMap[debuffStyle]} size="sm" />
        </div>
      )}
    </div>
  )
}

function VariantCard({ style, label, description, rays }: typeof debuffVariants[number]) {
  return (
    <div className="rounded-lg border border-black bg-white p-4 flex flex-col gap-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-bold font-title">{label}</h3>
          <StarShape rays={rays} size="sm" />
        </div>
        <p className="text-xs text-gray-500">{description}</p>
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
              debuffStyle={style}
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
      <h2 className="text-2xl md:text-3xl font-title">Issue #16 — Irregular Star Shapes</h2>
      <p className="mt-1 text-sm text-gray-500">
        Star-like debuff indicators with uneven points, varied angles, and staggered pulse timing.
        Buff sparkle is settled.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600">
        <span className="font-semibold text-gray-700">Legend:</span>
        <span className="inline-flex items-center gap-2">
          <SparkleAnim size="sm" />
          Buff (settled)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-yellow-500 bg-yellow-200" />
          Occupied tile
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {debuffVariants.map(v => (
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
