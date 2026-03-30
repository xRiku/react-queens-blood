import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../lib/theme";
import { springEntrance } from "../lib/animations";

type CalloutProps = {
  text: string;
  x: number;
  y: number;
  delayFrames?: number;
  borderColor?: string;
  width?: number;
};

export const Callout: React.FC<CalloutProps> = ({
  text,
  x,
  y,
  delayFrames = 0,
  borderColor = COLORS.yellow400,
  width = 260,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = springEntrance(frame, fps, delayFrames);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: progress,
        transform: `scale(${0.9 + 0.1 * progress})`,
      }}
    >
      <div
        style={{
          width,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          border: `2px solid ${borderColor}`,
          borderRadius: 10,
          padding: "14px 20px",
          fontFamily: "system-ui, sans-serif",
          fontSize: 22,
          fontWeight: 500,
          color: COLORS.white,
          lineHeight: 1.4,
        }}
      >
        {text}
      </div>
    </div>
  );
};
