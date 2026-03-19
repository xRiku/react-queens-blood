import { motion } from "framer-motion";
import { useGameStore, RematchStatus } from "../../store/GameStore";
import { useModalStore } from "../../store/ModalStore";
import socket from "../../socket";
import { useNavigate, useParams } from "react-router-dom";
import Hourglass from "../Hourglass";

function StatusIcon({ status }: { status: RematchStatus }) {
  if (status === "waiting") return <Hourglass />;
  if (status === "confirmed")
    return <span className="text-green-500 text-2xl font-bold">&#10003;</span>;
  return <span className="text-red-500 text-2xl font-bold">&#10007;</span>;
}

export function RematchDialog() {
  const navigate = useNavigate();
  const { id: gameId } = useParams<{ id: string }>();
  const [
    playerOneName,
    playerTwoName,
    playerOneRematchStatus,
    playerTwoRematchStatus,
    amIP1,
  ] = useGameStore((state) => [
    state.playerOneName,
    state.playerTwoName,
    state.playerOneRematchStatus,
    state.playerTwoRematchStatus,
    state.amIP1,
  ]);
  const [hideRematchDialog] = useModalStore((state) => [
    state.hideRematchDialog,
  ]);

  const myStatus = amIP1 ? playerOneRematchStatus : playerTwoRematchStatus;
  const hasResponded = myStatus !== "waiting";

  const handleRematch = () => {
    socket.emit("rematch-respond", { gameId, response: "confirmed" });
  };

  const handleQuit = () => {
    socket.emit("rematch-respond", { gameId, response: "refused" });
    hideRematchDialog();
    socket.disconnect();
    navigate("/");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[2px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-950 border-2 border-yellow-400 rounded-xl p-8 xl:p-10 min-w-80 shadow-2xl"
      >
        <h2 className="font-title text-3xl xl:text-4xl text-yellow-400 text-center mb-6">
          Rematch?
        </h2>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between gap-6">
            <span className="text-white text-lg xl:text-xl font-medium">
              {playerOneName || "Player 1"}
            </span>
            <StatusIcon status={playerOneRematchStatus} />
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-white text-lg xl:text-xl font-medium">
              {playerTwoName || "Player 2"}
            </span>
            <StatusIcon status={playerTwoRematchStatus} />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRematch}
            disabled={hasResponded}
            className="flex-1 py-2 px-4 rounded-md bg-yellow-400 text-black font-semibold hover:bg-yellow-300 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0"
          >
            Rematch
          </button>
          <button
            onClick={handleQuit}
            className="flex-1 py-2 px-4 rounded-md border border-gray-600 text-gray-300 font-semibold hover:bg-gray-800 active:translate-y-0.5"
          >
            Quit
          </button>
        </div>
      </motion.div>
    </div>
  );
}
