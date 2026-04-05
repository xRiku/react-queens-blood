export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const VERTICAL_WIDTH = 1080;
export const VERTICAL_HEIGHT = 1920;

// Colors matching the Queen's Blood aesthetic
export const COLORS = {
  bg: "#0a0a0a",
  bgAlt: "#111111",
  white: "#ffffff",
  gold: "#d4a853",
  goldLight: "#f0d68a",
  gray: "#888888",
  grayDark: "#333333",
  red: "#c44040",
  green: "#40c463",
  blue: "#4088c4",
} as const;

// Scene durations in seconds
export const DURATIONS = {
  hook: 3,
  playInstantly: 5,
  cardEffects: 7,
  preview: 5,
  multiplayer: 6,
  soundPolish: 5,
  deckBuilder: 5,
  cta: 5,
} as const;

export const TOTAL_SECONDS = Object.values(DURATIONS).reduce((a, b) => a + b, 0);
export const TRANSITION_FRAMES = 12;
