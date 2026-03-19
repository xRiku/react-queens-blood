export default function Hourglass() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-hourglass"
    >
      <path
        d="M6 2h12v4l-4 4 4 4v4H6v-4l4-4-4-4V2z"
        stroke="#d97706"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M9 4h6v1.5l-3 3-3-3V4z"
        fill="#d97706"
        className="animate-sand-top"
      />
      <path
        d="M9 20h6v-1.5l-3-3-3 3V20z"
        fill="#d97706"
        className="animate-sand-bottom"
      />
    </svg>
  )
}
