import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { COLORS } from "../constants";

type GoldLineProps = {
  delay?: number;
  width?: number;
};

export const GoldLine: React.FC<GoldLineProps> = ({
  delay = 0,
  width = 120,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(frame, [delay, delay + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        width: width * progress,
        height: 3,
        backgroundColor: COLORS.gold,
        borderRadius: 2,
      }}
    />
  );
};
