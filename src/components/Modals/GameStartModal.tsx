import { motion } from "framer-motion";
import { useModalStore } from "../../store/ModalStore";

export function GameStartModal() {

  const [toggleGameStartModal, toggleTurnModal] = useModalStore((state) => [state.toggleGameStartModal, state.toggleTurnModal]);

  return <div className="fixed mt-[320px] top-0 left-0 w-full h-full flex items-start justify-center">
    <motion.div
      animate={{ opacity: [0, 1, 1, 0] }}
      key="game-start-modal"
      transition={{ duration: 3, times: [0.0, 0.1, 0.9, 1.0] }}
      onAnimationComplete={() => {
        toggleGameStartModal()
        setTimeout(() => {
          toggleTurnModal()
        }, 100)
      }}
      className="w-[600px] border-y border-yellow-400 bg-transparent text-center py-6 bg-gradient-to-r from-transparent via-[#854d0e_33%,_#854d0e_66%] "
    >
      <h2 className="text-5xl font-normal text-yellow-300">Draw Blood!</h2>
    </motion.div>
  </div>
} 