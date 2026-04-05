import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { ScreenRecordingSlot } from "../components/ScreenRecordingSlot";
import { GoldLine } from "../components/GoldLine";
import { COLORS } from "../constants";

export const PreviewScene: React.FC = () => {
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
        text="Preview every move."
        fontSize={52}
        variant="title"
        color={COLORS.white}
        delay={0}
      />

      <GoldLine delay={8} width={140} />

      <AnimatedText
        text="Hover to see exactly what happens before you commit."
        fontSize={28}
        color={COLORS.gray}
        delay={Math.round(0.3 * fps)}
      />

      <ScreenRecordingSlot
        label="preview"
        videoFile="preview.mp4"
        delay={Math.round(0.5 * fps)}
      />
    </AbsoluteFill>
  );
};
