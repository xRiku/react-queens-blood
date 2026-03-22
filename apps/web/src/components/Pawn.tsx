import { cn } from '../utils/cn'

type PawnProps = {
  className?: string
  color: 'green' | 'red' | 'black'
}

export default function Pawn({ className, color }: PawnProps) {
  const colorMap = { green: '#4ade80', red: '#f87171', black: '#000000' }
  const headColor = colorMap[color]
  const bodyColor = color === 'black' ? '#000000' : '#a3a3a3'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('inline-block', className)}
    >
      {/* Base */}
      <path
        d="M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"
        fill={bodyColor}
      />
      {/* Body */}
      <path d="M9.5 10 8 18h8l-1.5-8z" fill={bodyColor} />
      {/* Neck line */}
      <path d="M7 10h10" stroke={bodyColor} strokeWidth={1.5} />
      {/* Head */}
      <circle cx="12" cy="6" r="4" fill={headColor} />

    </svg>
  )
}
