import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { GoldLine } from "../components/GoldLine";
import { COLORS } from "../constants";
import { titleFont } from "../fonts";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulsing glow behind title
  const glowPulse = interpolate(
    frame % (fps * 2),
    [0, fps, fps * 2],
    [0.3, 0.6, 0.3]
  );

  // Staggered word animation
  const words = ["Queen's", "Blood"];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.gold}${Math.round(glowPulse * 255)
            .toString(16)
            .padStart(2, "0")} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: 24,
          alignItems: "baseline",
        }}
      >
        {words.map((word, i) => {
          const wordSpring = spring({
            frame,
            fps,
            delay: i * 6,
            config: { damping: 15, stiffness: 200 },
          });
          const scale = interpolate(wordSpring, [0, 1], [0.5, 1]);
          const opacity = interpolate(wordSpring, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                fontFamily: titleFont,
                fontSize: 96,
                fontWeight: "900",
                color: COLORS.white,
                opacity,
                transform: `scale(${scale})`,
              }}
            >
              {word}
            </div>
          );
        })}
      </div>

      <GoldLine delay={10} width={200} />

      <AnimatedText
        text="got a major update."
        fontSize={36}
        color={COLORS.gray}
        delay={18}
        variant="body"
      />
    </AbsoluteFill>
  );
};
