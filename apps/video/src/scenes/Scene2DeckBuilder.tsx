import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { SceneContainer } from "../components/SceneContainer";
import { ScreenshotFrame } from "../components/ScreenshotFrame";
import { TextOverlay } from "../components/TextOverlay";
import { FeatureLabel } from "../components/FeatureLabel";
import { Callout } from "../components/Callout";
import { COLORS } from "../lib/theme";
import { springEntrance } from "../lib/animations";

export const Scene2DeckBuilder: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cross-dissolve between reset and partial deck
  const dissolve1 = interpolate(frame, [60, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cross-dissolve from partial to full deck
  const dissolve2 = interpolate(frame, [150, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneContainer>
      {/* Title */}
      <Sequence from={0} durationInFrames={45} layout="none" premountFor={10}>
        <TextOverlay
          text="Build Your Deck"
          fontSize={80}
          position="center"
          withGlow
        />
      </Sequence>

      {/* Deck builder progression: empty → partial → full */}
      <Sequence from={30} durationInFrames={210} premountFor={20}>
        <AbsoluteFill
          style={{
            opacity: interpolate(frame, [30, 50], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {/* Layer 1: Empty/reset deck */}
          <AbsoluteFill style={{ opacity: 1 - dissolve1 }}>
            <ScreenshotFrame src="deckbuilder-reset-1920.png" />
          </AbsoluteFill>

          {/* Layer 2: Partial deck (10/15) */}
          <AbsoluteFill style={{ opacity: dissolve1 * (1 - dissolve2) }}>
            <ScreenshotFrame src="deckbuilder-partial-1920.png" />
          </AbsoluteFill>

          {/* Layer 3: Full deck (15/15) */}
          <AbsoluteFill style={{ opacity: dissolve2 }}>
            <ScreenshotFrame src="deckbuilder-full-1920.png" />
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>

      {/* Feature labels */}
      <Sequence from={55} durationInFrames={75} layout="none" premountFor={20}>
        <FeatureLabel label="0/15 — Start Building" x={1350} y={40} delayFrames={0} />
      </Sequence>

      <Sequence from={120} durationInFrames={60} layout="none" premountFor={20}>
        <FeatureLabel label="10/15 — Adding Cards" x={1350} y={40} delayFrames={0} />
      </Sequence>

      <Sequence from={195} durationInFrames={50} layout="none" premountFor={20}>
        <FeatureLabel label="15/15 — Deck Complete!" x={1300} y={40} delayFrames={0} color={COLORS.green400} />
      </Sequence>

      {/* Bottom callout */}
      <Sequence from={240} durationInFrames={60} layout="none" premountFor={20}>
        <Callout
          text="27 Cards · 15-Card Decks · 2 Copies Max"
          x={620}
          y={950}
          delayFrames={0}
          width={680}
        />
      </Sequence>
    </SceneContainer>
  );
};
