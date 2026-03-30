import { interpolate, spring } from "remotion";

export const fadeIn = (
  frame: number,
  fps: number,
  startSec: number,
  durationSec: number
): number => {
  const startFrame = Math.round(startSec * fps);
  const endFrame = startFrame + Math.round(durationSec * fps);
  return interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const fadeOut = (
  frame: number,
  fps: number,
  startSec: number,
  durationSec: number
): number => {
  const startFrame = Math.round(startSec * fps);
  const endFrame = startFrame + Math.round(durationSec * fps);
  return interpolate(frame, [startFrame, endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const slideInFromBottom = (
  frame: number,
  fps: number,
  delayFrames = 0
): number => {
  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 200 },
  });
  return interpolate(progress, [0, 1], [80, 0]);
};

export const slideInFromLeft = (
  frame: number,
  fps: number,
  delayFrames = 0
): number => {
  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 200 },
  });
  return interpolate(progress, [0, 1], [-200, 0]);
};

export const slideInFromRight = (
  frame: number,
  fps: number,
  delayFrames = 0
): number => {
  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 200 },
  });
  return interpolate(progress, [0, 1], [200, 0]);
};

export const scaleEntrance = (
  frame: number,
  fps: number,
  delayFrames = 0
): number => {
  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 200 },
  });
  return interpolate(progress, [0, 1], [0.85, 1]);
};

export const springEntrance = (
  frame: number,
  fps: number,
  delayFrames = 0
): number => {
  return spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 200 },
  });
};

export const bouncyEntrance = (
  frame: number,
  fps: number,
  delayFrames = 0
): number => {
  return spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 8 },
  });
};

export const pulseGlow = (frame: number, fps: number): number => {
  return 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2);
};
