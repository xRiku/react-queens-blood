import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { ScreenRecordingSlot } from "../components/ScreenRecordingSlot";
import { GoldLine } from "../components/GoldLine";
import { COLORS } from "../constants";

export const DeckBuilderScene: React.FC = () => {
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
        text="Browse. Build. Battle."
        fontSize={52}
        variant="title"
        color={COLORS.white}
        delay={0}
      />

      <GoldLine delay={8} width={140} />

      <ScreenRecordingSlot
        label="deck-builder"
        videoFile="deck-builder.mp4"
        delay={Math.round(0.3 * fps)}
      />

      <AnimatedText
        text="Full card catalog and deck builder."
        fontSize={26}
        color={COLORS.gray}
        delay={Math.round(0.6 * fps)}
      />
    </AbsoluteFill>
  );
};
