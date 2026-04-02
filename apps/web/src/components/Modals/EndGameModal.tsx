import { m } from 'framer-motion'
import { Fireworks } from '@fireworks-js/react'
import type { FireworksHandlers } from '@fireworks-js/react'
import { Result, useGameStore } from '../../store/GameStore'
import { useEffect, useRef } from 'react'
import explosion0 from '../../assets/sounds/explosion0.mp3'
import explosion1 from '../../assets/sounds/explosion1.mp3'
import explosion2 from '../../assets/sounds/explosion2.mp3'
import useSoundStore from '../../store/SoundStore'
import { useHaptics } from '../../hooks/useHaptics'

export function EndGameModal() {
  const [gameResult] = useGameStore((state) => [state.gameResult])
  const [muted] = useSoundStore((state) => [state.muted])
  const ref = useRef<FireworksHandlers>(null)
  const haptics = useHaptics()

  useEffect(() => {
    if (gameResult === Result.WIN) {
      haptics.success()
      return
    }

    if (gameResult === Result.LOSE) {
      haptics.error()
      return
    }

    haptics.impactMedium()
  }, [gameResult, haptics])

  return (
    <m.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-[2px]"
    >
      {gameResult === Result.WIN ? (
        <>
          <div className="px-10 py-6 xl:px-16 xl:py-10 2xl:px-20 2xl:py-12 mb-48 xl:mb-72 2xl:mb-96">
            <m.h2
              initial={{
                opacity: 0,
                translateY: -100,
              }}
              animate={{
                opacity: 1,
                translateY: 0,
              }}
              className="text-5xl xl:text-6xl 2xl:text-8xl font-medium text-yellow-300 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
            >You Win!
            </m.h2>
          </div>
          <Fireworks
            ref={ref}
            options={{ opacity: 0.5, acceleration: 1.0, intensity: 20, particles: 100, sound: { enabled: !muted, files: [explosion0, explosion1, explosion2], volume: { min: 0, max: 4 } } }}
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              position: 'fixed',
            }}
          />
        </>
      ) : null}
      {gameResult === Result.LOSE ? (
        <div className="px-10 py-6 xl:px-16 xl:py-10 2xl:px-20 2xl:py-12 mb-48 xl:mb-72 2xl:mb-96">
          <h2 className="text-5xl xl:text-6xl 2xl:text-8xl font-semibold text-red-500 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">You Lose!</h2>
        </div>
      ) : null}
      {gameResult === Result.DRAW ? (
        <div className="px-10 py-6 xl:px-16 xl:py-10 2xl:px-20 2xl:py-12 mb-48 xl:mb-72 2xl:mb-96">
          <h2 className="text-5xl xl:text-6xl 2xl:text-8xl font-semibold bg-gradient-to-t text-transparent bg-clip-text from-blue-600 via-blue-500 to-white inline-block">Tie</h2>
        </div>
      ) : null}
    </m.div>
  )
}
