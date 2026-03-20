import { motion } from "framer-motion";

// Single-phase cycle: sand falls, hold, flip, hold → seamless restart.
// The glass is symmetric, so resetting rotation from 180° to 0° while
// resetting sand from drained/full to full/empty is visually identical.
//
// Timeline (3s):
//   0–1.65s  (0–0.55): Sand falls — top drains, bottom fills
//   1.65–2.1s (0.55–0.7): Hold before flip
//   2.1–2.7s (0.7–0.9): Flip 180°
//   2.7–3s   (0.9–1.0): Hold after flip → restart

export default function Hourglass() {
  return (
    <motion.div
      animate={{ rotate: [0, 0, 0, 180, 180] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.55, 0.7, 0.9, 1.0],
      }}
    >
      <svg width="20" height="20" viewBox="0 0 100 100">
        {/* Top sand — drains */}
        <motion.polygon
          fill="#9ca3af"
          animate={{
            points: [
              "22,12 78,12 50,48", // full
              "46,42 54,42 50,48", // drained
              "46,42 54,42 50,48", // hold
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.55, 1.0],
          }}
        />
        {/* Bottom sand — fills */}
        <motion.polygon
          fill="#9ca3af"
          animate={{
            points: [
              "49,88 51,88 50,88", // empty
              "22,88 78,88 50,52", // full
              "22,88 78,88 50,52", // hold
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.55, 1.0],
          }}
        />
        {/* Falling stream — thin line from neck to bottom */}
        <motion.line
          x1="50" y1="48" x2="50" y2="88"
          stroke="#9ca3af"
          strokeWidth="2"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.5, 0.55, 1.0],
          }}
        />
        {/* Glass outline */}
        <polygon
          points="20,10 80,10 50,50 80,90 20,90 50,50"
          fill="none"
          stroke="#6b7280"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Caps */}
        <line x1="15" y1="10" x2="85" y2="10" stroke="#6b7280" strokeWidth="5" strokeLinecap="round" />
        <line x1="15" y1="90" x2="85" y2="90" stroke="#6b7280" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}
