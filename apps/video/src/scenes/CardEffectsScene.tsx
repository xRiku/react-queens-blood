import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { ScreenRecordingSlot } from "../components/ScreenRecordingSlot";
import { GoldLine } from "../components/GoldLine";
import { COLORS } from "../constants";

export const CardEffectsScene: React.FC = () => {
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
        text="Buffs. Debuffs. Destruction."
        fontSize={52}
        variant="title"
        color={COLORS.white}
        delay={0}
      />

      <GoldLine delay={8} width={160} />

      <ScreenRecordingSlot
        label="card-effects"
        videoFile="card-effects.mp4"
        delay={Math.round(0.3 * fps)}
        width={900}
        height={506}
      />

      <AnimatedText
        text="Cards now change the board when played."
        fontSize={26}
        color={COLORS.gray}
        delay={Math.round(0.6 * fps)}
      />
    </AbsoluteFill>
  );
};
