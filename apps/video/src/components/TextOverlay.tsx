import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_TITLE, GLOW } from "../lib/theme";
import { springEntrance } from "../lib/animations";

type TextOverlayProps = {
  text: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  position?: "top" | "center" | "bottom";
  delayFrames?: number;
  withGlow?: boolean;
  style?: React.CSSProperties;
};

export const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  fontSize = 72,
  color = COLORS.white,
  fontFamily = FONT_TITLE,
  position = "center",
  delayFrames = 0,
  withGlow = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = springEntrance(frame, fps, delayFrames);

  const positionStyles: Record<string, React.CSSProperties> = {
    top: { top: 60, left: 0, right: 0 },
    center: { top: 0, left: 0, right: 0, bottom: 0 },
    bottom: { bottom: 60, left: 0, right: 0 },
  };

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...positionStyles[position],
        opacity: progress,
        transform: `translateY(${(1 - progress) * 30}px)`,
      }}
    >
      <span
        style={{
          fontFamily,
          fontSize,
          color,
          fontWeight: 600,
          textShadow: withGlow
            ? GLOW.yellow
            : `0 2px 20px rgba(0,0,0,0.8)`,
          letterSpacing: 2,
          ...style,
        }}
      >
        {text}
      </span>
    </div>
  );
};
