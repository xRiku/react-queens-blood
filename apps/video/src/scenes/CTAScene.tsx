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
import { titleFont, bodyFont } from "../fonts";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulsing glow behind CTA
  const glowPulse = interpolate(
    frame % (fps * 1.5),
    [0, fps * 0.75, fps * 1.5],
    [0.15, 0.35, 0.15]
  );

  const buttonEntrance = spring({
    frame,
    fps,
    delay: Math.round(0.5 * fps),
    config: { damping: 12 },
  });
  const buttonScale = interpolate(buttonEntrance, [0, 1], [0.7, 1]);
  const buttonOpacity = interpolate(buttonEntrance, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.gold}${Math.round(glowPulse * 255)
            .toString(16)
            .padStart(2, "0")} 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <AnimatedText
        text="Play now."
        fontSize={72}
        variant="title"
        color={COLORS.white}
        delay={0}
      />

      <GoldLine delay={6} width={100} />

      {/* URL button */}
      <div
        style={{
          opacity: buttonOpacity,
          transform: `scale(${buttonScale})`,
          border: `3px solid ${COLORS.gold}`,
          borderRadius: 16,
          padding: "20px 56px",
          fontFamily: titleFont,
          fontSize: 36,
          fontWeight: "900",
          color: COLORS.gold,
          letterSpacing: "0.03em",
          backgroundColor: `${COLORS.gold}10`,
          marginTop: 8,
        }}
      >
        queensblood.gg
      </div>

      <AnimatedText
        text="Read the full patch notes on the site"
        fontSize={22}
        color={COLORS.gray}
        delay={Math.round(1 * fps)}
      />
    </AbsoluteFill>
  );
};
