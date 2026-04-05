import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from "remotion";
import { Video } from "@remotion/media";
import { COLORS } from "../constants";
import { bodyFont } from "../fonts";

type ScreenRecordingSlotProps = {
  label: string;
  screenshotFile?: string;
  videoFile?: string;
  trimStart?: number;
  trimEnd?: number;
  delay?: number;
  width?: number;
  height?: number;
};

export const ScreenRecordingSlot: React.FC<ScreenRecordingSlotProps> = ({
  label,
  screenshotFile,
  videoFile,
  trimStart,
  trimEnd,
  delay = 0,
  width = 900,
  height = 506,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });

  const scale = interpolate(entrance, [0, 1], [0.9, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const mediaStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        width,
        height,
        borderRadius: 12,
        border: `2px solid ${COLORS.grayDark}`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.bgAlt,
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        position: "relative",
      }}
    >
      {videoFile ? (
        <Video
          src={staticFile(videoFile)}
          muted
          style={mediaStyle}
          trimBefore={trimStart}
          trimAfter={trimEnd}
        />
      ) : screenshotFile ? (
        <Img src={staticFile(screenshotFile)} style={mediaStyle} />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              border: `2px dashed ${COLORS.gray}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              color: COLORS.gray,
            }}
          >
            {"▶"}
          </div>
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: 16,
              color: COLORS.gray,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {label}
          </div>
        </div>
      )}
    </div>
  );
};
