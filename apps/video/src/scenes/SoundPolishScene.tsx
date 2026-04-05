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
import { bodyFont } from "../fonts";

const soundItems = [
  { label: "Card Flick", icon: "🃏" },
  { label: "Hover", icon: "👆" },
  { label: "Game Start", icon: "🎵" },
  { label: "Invalid Move", icon: "✕" },
  { label: "Victory", icon: "🎆" },
];

export const SoundPolishScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
      }}
    >
      <AnimatedText
        text="Every action feels right."
        fontSize={52}
        variant="title"
        color={COLORS.white}
        delay={0}
      />

      <GoldLine delay={8} width={140} />

      <AnimatedText
        text="Full sound design with global mute toggle."
        fontSize={26}
        color={COLORS.gray}
        delay={Math.round(0.3 * fps)}
      />

      <div
        style={{
          display: "flex",
          gap: 32,
          marginTop: 20,
        }}
      >
        {soundItems.map((item, i) => {
          const entrance = spring({
            frame,
            fps,
            delay: Math.round((0.6 + i * 0.12) * fps),
            config: { damping: 15, stiffness: 200 },
          });

          const scale = interpolate(entrance, [0, 1], [0, 1]);
          const opacity = interpolate(entrance, [0, 1], [0, 1]);

          // Sound wave pulse effect
          const pulseDelay = Math.round((1.2 + i * 0.15) * fps);
          const pulse = frame > pulseDelay
            ? interpolate(
                (frame - pulseDelay) % (fps * 0.8),
                [0, fps * 0.4, fps * 0.8],
                [1, 1.15, 1]
              )
            : 1;

          return (
            <div
              key={item.label}
              style={{
                opacity,
                transform: `scale(${scale * pulse})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 16,
                  border: `2px solid ${COLORS.grayDark}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  backgroundColor: COLORS.bgAlt,
                }}
              >
                {item.icon}
              </div>
              <div
                style={{
                  fontFamily: bodyFont,
                  fontSize: 14,
                  fontWeight: "600",
                  color: COLORS.gray,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
