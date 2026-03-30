import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, GLOW } from "../lib/theme";
import { springEntrance } from "../lib/animations";

type FeatureLabelProps = {
  label: string;
  x: number;
  y: number;
  delayFrames?: number;
  color?: string;
  fontSize?: number;
};

export const FeatureLabel: React.FC<FeatureLabelProps> = ({
  label,
  x,
  y,
  delayFrames = 0,
  color = COLORS.yellow400,
  fontSize = 28,
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
        transform: `scale(${0.8 + 0.2 * progress})`,
        transformOrigin: "left center",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: color,
            boxShadow: GLOW.yellow,
          }}
        />
        <span
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize,
            fontWeight: 600,
            color: COLORS.white,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            padding: "8px 18px",
            borderRadius: 8,
            border: `2px solid ${color}`,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};
