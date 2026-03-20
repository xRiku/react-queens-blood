import { motion } from "framer-motion";
import { useGameStore, RematchStatus } from "../../store/GameStore";
import { useModalStore } from "../../store/ModalStore";
import socket from "../../socket";
import { useNavigate, useParams } from "react-router-dom";
import Hourglass from "../Hourglass";
import { useBotGameActions } from "../../contexts/BotGameContext";

function OpponentStatus({ status }: { status: RematchStatus }) {
  if (status === "waiting")
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <Hourglass />
        <span>Waiting...</span>
      </div>
    );
  if (status === "confirmed")
    return <span className="text-green-600 text-sm font-medium">Accepted!</span>;
  return <span className="text-red-500 text-sm font-medium">Declined</span>;
}

export function RematchDialog() {
  const navigate = useNavigate();
  const { id: gameId } = useParams<{ id: string }>();
  const botActions = useBotGameActions();
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
  const opponentStatus = amIP1 ? playerTwoRematchStatus : playerOneRematchStatus;
  const opponentName = amIP1 ? playerTwoName || "Player 2" : playerOneName || "Player 1";

  const handleRematch = () => {
    if (botActions) {
      botActions.rematchRespond("confirmed");
      return;
    }
    socket.emit("rematch-respond", { gameId, response: "confirmed" });
  };

  const handleQuit = () => {
    if (botActions) {
      hideRematchDialog();
      navigate("/");
      return;
    }
    socket.emit("rematch-respond", { gameId, response: "refused" });
    hideRematchDialog();
    socket.disconnect();
    navigate("/");
  };

  const rematchButtonClass =
    myStatus === "confirmed"
      ? "rounded-md w-full px-4 py-2 bg-green-600 border border-green-600 text-white cursor-default"
      : myStatus === "refused"
        ? "rounded-md w-full px-4 py-2 bg-red-500 border border-red-500 text-white cursor-default"
        : "rounded-md w-full px-4 py-2 border text-black border-black hover:bg-gray-700 hover:border-gray-700 group active:translate-y-0.5";

  const rematchButtonLabel =
    myStatus === "confirmed"
      ? "\u2713 Rematch"
      : myStatus === "refused"
        ? "\u2717 Declined"
        : "Rematch";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-black rounded-lg p-8 w-80"
      >
        <h2 className="text-2xl font-medium text-center mb-6">
          Rematch?
        </h2>

        <div className="flex items-center justify-between mb-6">
          <span className="text-base">{opponentName}</span>
          <OpponentStatus status={opponentStatus} />
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={myStatus === "waiting" ? handleRematch : undefined}
            disabled={myStatus !== "waiting"}
            className={rematchButtonClass}
          >
            <span className={`text-lg font-medium ${myStatus === "waiting" ? "text-black group-hover:text-white" : ""}`}>
              {rematchButtonLabel}
            </span>
          </button>
          <button
            onClick={handleQuit}
            className="text-sm text-gray-500 hover:text-black underline underline-offset-2"
          >
            Quit
          </button>
        </div>
      </motion.div>
    </div>
  );
}
