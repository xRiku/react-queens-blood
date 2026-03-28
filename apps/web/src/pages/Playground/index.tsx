const CARD_BG = 'bg-green-400'
const BASE_PTS = 2
const BUFFED_PTS = 4
const DELTA = BUFFED_PTS - BASE_PTS

// Shared sub-components
function PawnIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3 md:h-4 md:w-4 fill-black opacity-80 flex-shrink-0">
      <path d="M19 22H5a3 3 0 0 1-3-3V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v12h4v4a3 3 0 0 1-3 3zm-1-5v2a1 1 0 0 0 2 0v-2h-2zm-2 3V4H4v15a1 1 0 0 0 1 1h11zM6 7h8v2H6V7zm0 4h8v2H6v-2zm0 4h5v2H6v-2z" />
    </svg>
  )
}

function MiniGrid() {
  return (
    <div className="grid grid-cols-5 border border-black">
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className={['h-1.5 w-1.5 md:h-2 md:w-2 border-[0.5px] border-black',
          i === 12 ? 'bg-white' : i === 7 || i === 11 || i === 13 ? 'bg-yellow-400' : 'bg-gray-400',
        ].join(' ')} />
      ))}
    </div>
  )
}

function NameBar({ name = 'Grasslands Wolf' }: { name?: string }) {
  return (
    <div className="bg-black border-t-2 border-yellow-400 text-yellow-400 text-[6px] font-medium text-center py-0.5 truncate px-0.5 rounded-b-lg">
      {name}
    </div>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-36 w-28 bg-gray-800 border-2 border-green-400 relative flex justify-center items-center p-1">
      {children}
    </div>
  )
}

function Var({ n, label, children }: { n: number; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-[10px] font-mono text-green-400 tracking-widest opacity-40">{String(n).padStart(2, '0')}</span>
      <span className="text-white font-semibold text-xs text-center leading-tight">{label}</span>
    </div>
  )
}

// ─── Variation 1: Badge overlaid on circle corner ───────────────────────────
function V1() {
  return (
    <Shell>
      <div className={`flex flex-col justify-between w-full h-full rounded-lg ${CARD_BG} border border-gray-400 overflow-hidden`}>
        <div className="flex justify-between items-center p-0.5 md:p-1">
          <PawnIcon />
          <div className="relative">
            <span className="flex items-center justify-center bg-green-200 border-2 border-green-500 rounded-full w-6 h-6 md:w-8 md:h-8 text-[9px] md:text-sm font-bold text-black">
              {BUFFED_PTS}
            </span>
            {/* badge top-right of circle */}
            <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[6px] md:text-[7px] font-bold rounded-full px-0.5 leading-tight min-w-[10px] text-center">
              +{DELTA}
            </span>
          </div>
        </div>
        <div className="flex justify-center items-center py-0.5">
          <MiniGrid />
        </div>
        <NameBar />
      </div>
    </Shell>
  )
}

// ─── Variation 2: Delta inside the circle (stacked) ──────────────────────────
function V2() {
  return (
    <Shell>
      <div className={`flex flex-col justify-between w-full h-full rounded-lg ${CARD_BG} border border-gray-400 overflow-hidden`}>
        <div className="flex justify-between items-center p-0.5 md:p-1">
          <PawnIcon />
          <span className="flex flex-col items-center justify-center bg-green-200 border-2 border-green-500 rounded-full w-7 h-7 md:w-9 md:h-9 font-bold text-black leading-none">
            <span className="text-[9px] md:text-sm">{BUFFED_PTS}</span>
            <span className="text-[5px] md:text-[7px] text-green-700">+{DELTA}</span>
          </span>
        </div>
        <div className="flex justify-center items-center py-0.5">
          <MiniGrid />
        </div>
        <NameBar />
      </div>
    </Shell>
  )
}

// ─── Variation 3: Name bar shows the delta ───────────────────────────────────
function V3() {
  return (
    <Shell>
      <div className={`flex flex-col justify-between w-full h-full rounded-lg ${CARD_BG} border border-gray-400 overflow-hidden`}>
        <div className="flex justify-between items-center p-0.5 md:p-1">
          <PawnIcon />
          <span className="flex items-center justify-center bg-green-200 border-2 border-green-500 rounded-full w-6 h-6 md:w-8 md:h-8 text-[9px] md:text-sm font-bold text-black">
            {BUFFED_PTS}
          </span>
        </div>
        <div className="flex justify-center items-center py-0.5">
          <MiniGrid />
        </div>
        {/* name bar with delta */}
        <div className="bg-black border-t-2 border-yellow-400 text-yellow-400 text-[6px] font-medium text-center py-0.5 truncate px-0.5 rounded-b-lg flex items-center justify-center gap-0.5">
          <span className="truncate">Grasslands Wolf</span>
          <span className="text-green-400 flex-shrink-0">+{DELTA}</span>
        </div>
      </div>
    </Shell>
  )
}

// ─── Variation 4: Pill in top-right corner of card (outside circle) ──────────
function V4() {
  return (
    <Shell>
      <div className={`relative flex flex-col justify-between w-full h-full rounded-lg ${CARD_BG} border border-gray-400 overflow-hidden`}>
        {/* corner pill */}
        <span className="absolute top-0 right-0 bg-green-600 text-white text-[6px] font-bold px-1 py-0.5 rounded-bl-md rounded-tr-md leading-tight z-10">
          +{DELTA}
        </span>
        <div className="flex justify-between items-center p-0.5 md:p-1">
          <PawnIcon />
          <span className="flex items-center justify-center bg-green-200 border-2 border-green-500 rounded-full w-6 h-6 md:w-8 md:h-8 text-[9px] md:text-sm font-bold text-black">
            {BUFFED_PTS}
          </span>
        </div>
        <div className="flex justify-center items-center py-0.5">
          <MiniGrid />
        </div>
        <NameBar />
      </div>
    </Shell>
  )
}

// ─── Variation 5: Two circles (base + delta side by side) ────────────────────
function V5() {
  return (
    <Shell>
      <div className={`flex flex-col justify-between w-full h-full rounded-lg ${CARD_BG} border border-gray-400 overflow-hidden`}>
        <div className="flex justify-between items-center p-0.5 md:p-1">
          <PawnIcon />
          <div className="flex items-center gap-0.5">
            <span className="flex items-center justify-center bg-green-500 text-white rounded-full w-4 h-4 md:w-5 md:h-5 text-[6px] md:text-[8px] font-bold">
              +{DELTA}
            </span>
            <span className="flex items-center justify-center bg-green-200 border-2 border-green-500 rounded-full w-6 h-6 md:w-8 md:h-8 text-[9px] md:text-sm font-bold text-black">
              {BUFFED_PTS}
            </span>
          </div>
        </div>
        <div className="flex justify-center items-center py-0.5">
          <MiniGrid />
        </div>
        <NameBar />
      </div>
    </Shell>
  )
}

// ─── Variation 6: Left-side vertical strip ───────────────────────────────────
function V6() {
  return (
    <Shell>
      <div className={`flex flex-col justify-between w-full h-full rounded-lg ${CARD_BG} border border-gray-400 overflow-hidden`}>
        <div className="flex justify-between items-center p-0.5 md:p-1">
          {/* left: pawn + delta stacked */}
          <div className="flex flex-col items-start gap-0.5">
            <PawnIcon />
            <span className="text-green-700 font-bold text-[7px] md:text-[9px] leading-none">+{DELTA}</span>
          </div>
          <span className="flex items-center justify-center bg-green-200 border-2 border-green-500 rounded-full w-6 h-6 md:w-8 md:h-8 text-[9px] md:text-sm font-bold text-black">
            {BUFFED_PTS}
          </span>
        </div>
        <div className="flex justify-center items-center py-0.5">
          <MiniGrid />
        </div>
        <NameBar />
      </div>
    </Shell>
  )
}

export default function Playground() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center px-6 py-12">
      <div className="text-center mb-14">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Buff Display Playground</h1>
        <p className="text-gray-500 text-sm">
          Card is base <span className="text-white font-mono">{BASE_PTS}pt</span> buffed to{' '}
          <span className="text-green-400 font-mono">{BUFFED_PTS}pt</span> (+{DELTA}) — pick a layout
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-10 w-full max-w-5xl">
        <Var n={1} label="Badge on circle">
          <V1 />
        </Var>
        <Var n={2} label="Delta inside circle">
          <V2 />
        </Var>
        <Var n={3} label="Delta in name bar">
          <V3 />
        </Var>
        <Var n={4} label="Corner pill">
          <V4 />
        </Var>
        <Var n={5} label="Two circles">
          <V5 />
        </Var>
        <Var n={6} label="Delta under pawn">
          <V6 />
        </Var>
      </div>

      <p className="text-xs text-gray-700 font-mono mt-16">/playground — dev only</p>
    </div>
  )
}
