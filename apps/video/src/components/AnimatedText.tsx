import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { bodyFont, titleFont } from "../fonts";
import { COLORS } from "../constants";

type AnimatedTextProps = {
  text: string;
  fontSize?: number;
  color?: string;
  delay?: number;
  variant?: "title" | "body" | "label";
  style?: React.CSSProperties;
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  fontSize = 48,
  color = COLORS.white,
  delay = 0,
  variant = "body",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const translateY = interpolate(entrance, [0, 1], [30, 0]);

  const fontFamily = variant === "title" ? titleFont : bodyFont;
  const fontWeight = variant === "title" ? "900" : variant === "label" ? "600" : "400";
  const letterSpacing = variant === "title" ? "0.04em" : variant === "label" ? "0.15em" : "0";
  const textTransform = variant === "label" ? ("uppercase" as const) : ("none" as const);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily,
        fontWeight,
        fontSize,
        color,
        letterSpacing,
        textTransform,
        textAlign: "center",
        lineHeight: 1.2,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
