import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../constants";
import { bodyFont } from "../fonts";

type FeatureBadgeProps = {
  text: string;
  delay?: number;
  color?: string;
};

export const FeatureBadge: React.FC<FeatureBadgeProps> = ({
  text,
  delay = 0,
  color = COLORS.gold,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 20, stiffness: 200 },
  });

  const scale = interpolate(entrance, [0, 1], [0.6, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        border: `2px solid ${color}`,
        borderRadius: 8,
        padding: "12px 28px",
        fontFamily: bodyFont,
        fontWeight: "600",
        fontSize: 24,
        color,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
};
