import { motion } from "framer-motion";
import { Fireworks } from '@fireworks-js/react'
import type { FireworksHandlers } from '@fireworks-js/react'
import { Result, useGameStore } from "../../store/GameStore";
import { useRef } from "react";

export function EndGameModal() {

  const [gameResult] = useGameStore((state) => [state.gameResult])
  const ref = useRef<FireworksHandlers>(null)

  return <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-5">
    {gameResult === Result.WIN &&
      <>
        <div className="px-20 py-12 mb-96">
          <motion.h2 initial={{
            opacity: 0,
            translateY: -100,
          }}
            animate={{
              opacity: 1,
              translateY: 0,
            }}
            className="text-8xl font-medium text-yellow-400 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]
          ">You Win!</motion.h2>
        </div>
        <Fireworks
          ref={ref}
          options={{ opacity: 0.5 }}
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'fixed',
          }}
        />
      </>
    }
    {gameResult === Result.LOSE && <div className="px-20 py-12 mb-96">
      <h2 className="text-8xl font-semibold text-red-500 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">You Lose!</h2>
    </div>}
    {gameResult === Result.DRAW &&
      <div className="px-20 py-12 mb-96 ">
        <h2 className="text-8xl font-semibold bg-gradient-to-t text-transparent bg-clip-text from-blue-600 via-blue-500 to-white inline-block">It's a Draw!</h2>
      </div>
    }
  </div>
} 