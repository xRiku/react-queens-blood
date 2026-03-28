const STYLES = `
  @keyframes spin-border {
    to { transform: rotate(360deg); }
  }

  @keyframes shimmer-sweep {
    0%   { transform: translateX(-150%) skewX(-20deg); }
    100% { transform: translateX(300%) skewX(-20deg); }
  }

  @keyframes dash-march {
    to { stroke-dashoffset: -20; }
  }

  .tile-spin-border {
    position: relative;
    isolation: isolate;
  }
  .tile-spin-border::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 4px;
    background: conic-gradient(
      from 0deg,
      #4ade80,
      #86efac,
      #ffffff,
      #86efac,
      #4ade80,
      #166534,
      #4ade80
    );
    animation: spin-border 2s linear infinite;
    z-index: -1;
  }
  .tile-spin-border::after {
    content: '';
    position: absolute;
    inset: 2px;
    background: #1e293b;
    border-radius: 2px;
    z-index: -1;
  }

  .tile-shimmer {
    position: relative;
    overflow: hidden;
    border: 3px solid #4ade80;
  }
  .tile-shimmer::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 35%,
      rgba(134, 239, 172, 0.5) 50%,
      transparent 65%
    );
    animation: shimmer-sweep 2.2s ease-in-out infinite;
    pointer-events: none;
  }
`

function MockCard({ name = 'Card Name', points = 3 }: { name?: string; points?: number }) {
  return (
    <div className="flex flex-col justify-between w-full h-full rounded-lg bg-green-400 border border-gray-400 overflow-hidden">
      <div className="flex justify-between items-center p-1">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-black opacity-80">
          <path d="M19 22H5a3 3 0 0 1-3-3V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v12h4v4a3 3 0 0 1-3 3zm-1-5v2a1 1 0 0 0 2 0v-2h-2zm-2 3V4H4v15a1 1 0 0 0 1 1h11zM6 7h8v2H6V7zm0 4h8v2H6v-2zm0 4h5v2H6v-2z" />
        </svg>
        <span className="flex items-center justify-center border-2 border-yellow-400 bg-white rounded-full w-7 h-7 text-sm font-bold text-black">
          {points}
        </span>
      </div>
      <div className="flex justify-center items-center py-1">
        <div className="grid grid-cols-5 border border-black">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className={[
                'h-2.5 w-2.5 border-[0.5px] border-black',
                i === 12 ? 'bg-white' : i === 7 || i === 11 || i === 13 ? 'bg-yellow-400' : 'bg-gray-400',
              ].join(' ')}
            />
          ))}
        </div>
      </div>
      <div className="bg-black border-t-2 border-yellow-400 text-yellow-400 text-[9px] font-medium text-center py-0.5 truncate px-1">
        {name}
      </div>
    </div>
  )
}

function Tile({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`h-36 w-28 border-2 border-black bg-gray-800 relative ${className}`}
      style={style}
    >
      <div className="flex justify-center p-1 h-full items-center">
        {children}
      </div>
    </div>
  )
}

function Variation({
  label,
  number,
  children,
}: {
  label: string
  number: number
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-xs font-mono text-green-400 uppercase tracking-widest opacity-60">
        {String(number).padStart(2, '0')}
      </div>
      {children}
      <div className="text-center">
        <p className="text-white font-semibold text-sm">{label}</p>
      </div>
    </div>
  )
}

export default function Playground() {
  return (
    <>
      <style>{STYLES}</style>
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Buff Indicator Playground
          </h1>
          <p className="text-gray-400 text-sm">
            Pick a style for buffed board tiles
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">

          {/* 1 — Thick static border */}
          <Variation number={1} label="Thick Static Border">
            <Tile className="border-4 border-green-400">
              <MockCard name="Security Officer" points={5} />
            </Tile>
          </Variation>

          {/* 2 — Spinning conic-gradient border */}
          <Variation number={2} label="Spinning Gradient Border">
            <div className="tile-spin-border h-36 w-28">
              <div className="h-full w-full bg-gray-800 relative">
                <div className="flex justify-center p-1 h-full items-center">
                  <MockCard name="Security Officer" points={5} />
                </div>
              </div>
            </div>
          </Variation>

          {/* 3 — Double ring */}
          <Variation number={3} label="Double Ring">
            <Tile
              className="border-2 border-green-400 ring-2 ring-green-400 ring-offset-2 ring-offset-[#0f172a]"
            >
              <MockCard name="Security Officer" points={5} />
            </Tile>
          </Variation>

          {/* 4 — Corner brackets */}
          <Variation number={4} label="Corner Brackets">
            <div className="h-36 w-28 bg-gray-800 border-2 border-black relative flex justify-center items-center p-1">
              {/* Top-left */}
              <span className="absolute top-0 left-0 w-4 h-4 border-t-[3px] border-l-[3px] border-green-400" />
              {/* Top-right */}
              <span className="absolute top-0 right-0 w-4 h-4 border-t-[3px] border-r-[3px] border-green-400" />
              {/* Bottom-left */}
              <span className="absolute bottom-0 left-0 w-4 h-4 border-b-[3px] border-l-[3px] border-green-400" />
              {/* Bottom-right */}
              <span className="absolute bottom-0 right-0 w-4 h-4 border-b-[3px] border-r-[3px] border-green-400" />
              <MockCard name="Security Officer" points={5} />
            </div>
          </Variation>

          {/* 5 — Shimmer sweep */}
          <Variation number={5} label="Shimmer Sweep">
            <div className="tile-shimmer h-36 w-28 bg-gray-800">
              <div className="flex justify-center p-1 h-full items-center">
                <MockCard name="Security Officer" points={5} />
              </div>
            </div>
          </Variation>

          {/* 6 — Marching dashed border (SVG) */}
          <Variation number={6} label="Marching Dashed Border">
            <div className="h-36 w-28 relative bg-gray-800 border-2 border-black">
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ overflow: 'visible' }}
              >
                <rect
                  x="1"
                  y="1"
                  width="calc(100% - 2px)"
                  height="calc(100% - 2px)"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="3"
                  strokeDasharray="8 5"
                  style={{
                    animation: 'dash-march 0.6s linear infinite',
                    strokeDashoffset: 0,
                  }}
                />
              </svg>
              <div className="flex justify-center p-1 h-full items-center">
                <MockCard name="Security Officer" points={5} />
              </div>
            </div>
          </Variation>

        </div>

        <p className="mt-16 text-xs text-gray-600 font-mono">
          /playground — dev only
        </p>
      </div>
    </>
  )
}
