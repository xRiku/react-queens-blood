import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { SceneContainer } from "../components/SceneContainer";
import { ScreenshotFrame } from "../components/ScreenshotFrame";
import { TextOverlay } from "../components/TextOverlay";
import { FeatureLabel } from "../components/FeatureLabel";
import { Callout } from "../components/Callout";
import { COLORS } from "../lib/theme";
import { springEntrance, scaleEntrance } from "../lib/animations";

export const Scene3Gameplay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneContainer>
      {/* "Live Gameplay" title */}
      <Sequence from={0} durationInFrames={50} layout="none" premountFor={10}>
        <TextOverlay
          text="Live Gameplay"
          fontSize={72}
          position="center"
          withGlow
        />
      </Sequence>

      {/* Game start — fresh board */}
      <Sequence from={30} durationInFrames={120} premountFor={20}>
        <AbsoluteFill
          style={{
            opacity: springEntrance(frame, fps, 30),
            transform: `scale(${scaleEntrance(frame, fps, 30)})`,
          }}
        >
          <ScreenshotFrame src="game-start-1920.png" />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={60} durationInFrames={80} layout="none" premountFor={20}>
        <FeatureLabel label="5 Cards in Hand" x={400} y={650} delayFrames={0} />
        <FeatureLabel label="3×5 Board Grid" x={600} y={40} delayFrames={15} />
      </Sequence>

      {/* Card selection from hand */}
      <Sequence from={140} durationInFrames={80} premountFor={20}>
        <AbsoluteFill
          style={{ opacity: springEntrance(frame, fps, 140) }}
        >
          <ScreenshotFrame src="game-card-selected-1920.png" />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={150} durationInFrames={60} layout="none" premountFor={20}>
        <FeatureLabel label="Select a Card" x={100} y={620} delayFrames={0} color={COLORS.green400} />
      </Sequence>

      {/* First card placed + bot responds */}
      <Sequence from={210} durationInFrames={80} premountFor={20}>
        <AbsoluteFill
          style={{ opacity: springEntrance(frame, fps, 210) }}
        >
          <ScreenshotFrame src="game-after-place-1920.png" />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={220} durationInFrames={60} layout="none" premountFor={20}>
        <FeatureLabel label="Card Placed — Pawns Spread!" x={400} y={40} delayFrames={0} />
        <FeatureLabel label="Bot Responds" x={1050} y={200} delayFrames={15} color={COLORS.red400} />
      </Sequence>

      {/* Effects visible — Mu placed with buff */}
      <Sequence from={280} durationInFrames={120} premountFor={20}>
        <AbsoluteFill
          style={{ opacity: springEntrance(frame, fps, 280) }}
        >
          <ScreenshotFrame src="game-effects-1920.png" />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={290} durationInFrames={100} layout="none" premountFor={20}>
        <TextOverlay
          text="Card Effects"
          fontSize={48}
          position="top"
          withGlow
          delayFrames={0}
        />
        <Callout
          text="✦ Mu — Buffs adjacent allies by +1"
          x={80}
          y={800}
          delayFrames={15}
          borderColor={COLORS.green400}
          width={420}
        />
        <Callout
          text="✦ Green borders = active buff zones"
          x={550}
          y={800}
          delayFrames={30}
          borderColor={COLORS.yellow400}
          width={420}
        />
      </Sequence>

      {/* Mid-game board state */}
      <Sequence from={390} durationInFrames={120} premountFor={20}>
        <AbsoluteFill
          style={{ opacity: springEntrance(frame, fps, 390) }}
        >
          <ScreenshotFrame src="game-endstate-1920.png" />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={400} durationInFrames={100} layout="none" premountFor={20}>
        <FeatureLabel label="Score: Row by Row" x={100} y={50} delayFrames={0} />
        <FeatureLabel label="Green = Player Wins Row" x={100} y={120} delayFrames={15} color={COLORS.green400} />
        <FeatureLabel label="Red = Bot Wins Row" x={100} y={190} delayFrames={30} color={COLORS.red400} />
      </Sequence>

      {/* Filled board — intense late game */}
      <Sequence from={500} durationInFrames={130} premountFor={20}>
        <AbsoluteFill
          style={{ opacity: springEntrance(frame, fps, 500) }}
        >
          <ScreenshotFrame src="game-filled-1920.png" />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={520} durationInFrames={100} layout="none" premountFor={20}>
        <FeatureLabel label="Board Filling Up!" x={700} y={40} delayFrames={0} fontSize={32} />
        <Callout
          text="Cards compete for territory — highest score wins each row"
          x={550}
          y={850}
          delayFrames={10}
          width={700}
        />
      </Sequence>

      {/* Late game with full scores */}
      <Sequence from={620} durationInFrames={130} premountFor={20}>
        <AbsoluteFill
          style={{
            opacity: springEntrance(frame, fps, 620),
          }}
        >
          <ScreenshotFrame src="game-endstate-1920.png" />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={640} durationInFrames={110} layout="none" premountFor={20}>
        <FeatureLabel label="Player: 1+1+1 = 3" x={60} y={450} delayFrames={0} color={COLORS.green400} />
        <FeatureLabel label="Bot: 12+7+4 = 23" x={1500} y={450} delayFrames={15} color={COLORS.red400} />
      </Sequence>
    </SceneContainer>
  );
};
