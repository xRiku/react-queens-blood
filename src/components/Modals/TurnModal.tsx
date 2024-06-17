import { motion } from "framer-motion";
import { useModalStore } from "../../store/useModalStore";
import useNeoHandStore from "../../store/NeoHandStore";
import useTurnStore from "../../store/TurnStore";

export function TurnModal() {
  const [toggleTurnModal] = useModalStore((state) => [state.toggleTurnModal]);
  const [isMyTurn] = useTurnStore((state) => [state.isMyTurn])
  const [drawCard] = useNeoHandStore((state) => [state.drawCard])

  return <div className="fixed mt-[480px] top-0 left-0 w-full h-full flex items-start justify-center">
    <motion.div
      animate={{ opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], scaleY: [1, 1, 1, 1, 1, 1, 0.9, 0.8, 0.7, 0.6, 0.0], scaleX: [0, 1, 1, 1, 1, 1, 1, 1.1, 1.2, 1.3] }}
      transition={{ duration: 2, times: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], }}
      // animate={{ x: [-540, 0, 540], opacity: [0, 1, 1, 0] }}
      // transition={{ duration: 3, times: [0.0, 0.3, 0.8, 1.0] }}
      onAnimationComplete={() => {
        toggleTurnModal()
      }}
      onAnimationStart={() => {
        setTimeout(() => {
          if (isMyTurn) {
            drawCard()
            return;
          }
        }, 1000)
      }}
      className={`w-[600px] border-y border-yellow-400 bg-transparent text-center py-6 bg-gradient-to-r from-transparent ${isMyTurn ? 'via-[#15803d_33%,_#15803d_66%]' : 'via-[#b91c1c_33%,_#b91c1c_66%]'}`}
    >
      <motion.h2 animate={{ opacity: [0, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 0], scale: [0.8, 0.9, 1, 1, 1, 1.1, 1.2, 1.3, 1.4, 1.5] }}
        transition={{ duration: 2, times: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] }}
        className={`text-5xl font-normal ${isMyTurn ? 'text-green-200' : 'text-red-200'}`}>{isMyTurn ? 'Your Turn' : "Opponent's Turn"}
      </motion.h2>
    </motion.div>
  </div>
} 