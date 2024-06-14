import { motion } from "framer-motion";
import { useModalStore } from "../../store/useModalStore";
import useNeoHandStore from "../../store/NeoHandStore";

export function GameStartModal({ amIP1 }: { amIP1: boolean }) {

  const [toggleGameStartModal] = useModalStore((state) => [state.toggleGameStartModal]);
  const [drawCard] = useNeoHandStore((state) => [state.drawCard])

  return <div className="fixed mt-[480px] top-0 left-0 w-full h-full flex items-start justify-center">
    {/* <div className="absolute w-full h-full bg-gray-900 opacity-50"></div> */}
    <motion.div
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 3, times: [0.0, 0.1, 0.9, 1.0] }}
      // animate={{ x: [-540, 0, 540], opacity: [0, 1, 1, 0] }}
      // transition={{ duration: 3, times: [0.0, 0.3, 0.8, 1.0] }}
      onAnimationComplete={() => {
        toggleGameStartModal()
        if (amIP1) {
          drawCard()
        }
      }}
      className="w-[600px] border-y border-yellow-400 bg-transparent text-center py-6 bg-gradient-to-r from-transparent via-[#854d0e_33%,_#854d0e_66%] "
    >
      <h2 className="text-5xl font-normal text-yellow-400">Draw Blood!</h2>
    </motion.div>
    {/* <div className="z-50 bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-semibold">Game Start!</h2>
      <p>Game is starting, good luck!</p>
    </div> */}
  </div>
} 