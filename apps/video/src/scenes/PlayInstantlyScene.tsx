import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { ScreenRecordingSlot } from "../components/ScreenRecordingSlot";
import { COLORS } from "../constants";

export const PlayInstantlyScene: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}
    >
      <AnimatedText
        text="No download. No setup. Just play."
        fontSize={52}
        variant="title"
        color={COLORS.white}
        delay={0}
      />

      <ScreenRecordingSlot
        label="play-instantly"
        videoFile="play-instantly.mp4"
        delay={Math.round(0.3 * fps)}
      />
    </AbsoluteFill>
  );
};
