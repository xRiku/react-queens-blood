import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { FeatureBadge } from "../components/FeatureBadge";
import { GoldLine } from "../components/GoldLine";
import { COLORS } from "../constants";
import { titleFont, bodyFont } from "../fonts";

export const MultiplayerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated room code
  const codeEntrance = spring({
    frame,
    fps,
    delay: Math.round(0.5 * fps),
    config: { damping: 15 },
  });
  const codeScale = interpolate(codeEntrance, [0, 1], [0.3, 1]);
  const codeOpacity = interpolate(codeEntrance, [0, 1], [0, 1]);

  const code = "482917";

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
        text="Multiplayer, simplified."
        fontSize={52}
        variant="title"
        color={COLORS.white}
        delay={0}
      />

      <GoldLine delay={8} width={160} />

      {/* Big room code */}
      <div
        style={{
          opacity: codeOpacity,
          transform: `scale(${codeScale})`,
          display: "flex",
          gap: 12,
          marginTop: 16,
        }}
      >
        {code.split("").map((digit, i) => {
          const digitSpring = spring({
            frame,
            fps,
            delay: Math.round((0.6 + i * 0.08) * fps),
            config: { damping: 12, stiffness: 200 },
          });
          const digitScale = interpolate(digitSpring, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                width: 80,
                height: 100,
                borderRadius: 12,
                border: `2px solid ${COLORS.gold}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: titleFont,
                fontSize: 56,
                fontWeight: "900",
                color: COLORS.white,
                transform: `scale(${digitScale})`,
                backgroundColor: `${COLORS.gold}15`,
              }}
            >
              {digit}
            </div>
          );
        })}
      </div>

      <AnimatedText
        text="Share a 6-digit code. Ready up. Play."
        fontSize={26}
        color={COLORS.gray}
        delay={Math.round(1.2 * fps)}
      />

      <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
        <FeatureBadge
          text="Ready Room"
          delay={Math.round(1.5 * fps)}
          color={COLORS.green}
        />
        <FeatureBadge
          text="Rematch"
          delay={Math.round(1.7 * fps)}
          color={COLORS.blue}
        />
      </div>
    </AbsoluteFill>
  );
};
