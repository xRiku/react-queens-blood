import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { SceneContainer } from "../components/SceneContainer";
import { ScreenshotFrame } from "../components/ScreenshotFrame";
import { FeatureLabel } from "../components/FeatureLabel";
import { COLORS, FONT_TITLE } from "../lib/theme";
import { pulseGlow, scaleEntrance, springEntrance } from "../lib/animations";

export const Scene1Lobby: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const titleScale = interpolate(titleProgress, [0, 1], [0.9, 1]);
  const glowIntensity = pulseGlow(frame, fps);

  const screenshotScale = scaleEntrance(frame, fps, 50);
  const screenshotOpacity = springEntrance(frame, fps, 50);

  return (
    <SceneContainer>
      {/* Title: "Queen's Blood" */}
      <Sequence from={0} durationInFrames={70} premountFor={10}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              opacity: interpolate(frame, [0, 15], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `scale(${titleScale})`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_TITLE,
                fontSize: 96,
                color: COLORS.white,
                textShadow: `0 0 ${20 + glowIntensity * 15}px rgba(250, 204, 21, ${0.3 + glowIntensity * 0.2}), 0 0 ${50 + glowIntensity * 30}px rgba(250, 204, 21, ${0.15 + glowIntensity * 0.1})`,
                letterSpacing: 4,
              }}
            >
              Queen's Blood
            </span>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Home page screenshot */}
      <Sequence from={50} durationInFrames={250} premountFor={20}>
        <AbsoluteFill
          style={{
            opacity: screenshotOpacity,
            transform: `scale(${screenshotScale})`,
          }}
        >
          <ScreenshotFrame src="home-1920.png" />
        </AbsoluteFill>
      </Sequence>

      {/* Feature labels pointing at actual UI elements */}
      <Sequence from={110} durationInFrames={190} layout="none" premountFor={20}>
        <FeatureLabel label="Create a Room" x={530} y={370} delayFrames={0} />
        <FeatureLabel label="Play vs Bot" x={530} y={420} delayFrames={15} />
        <FeatureLabel label="Join with 6-Digit Code" x={530} y={500} delayFrames={30} />
      </Sequence>

      {/* All Cards page flash */}
      <Sequence from={220} durationInFrames={80} premountFor={20}>
        <AbsoluteFill
          style={{
            opacity: springEntrance(frame, fps, 220),
            transform: `scale(${scaleEntrance(frame, fps, 220)})`,
          }}
        >
          <ScreenshotFrame src="all-cards-1920.png" />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={220} durationInFrames={80} layout="none" premountFor={20}>
        <FeatureLabel label="27 Unique Cards" x={800} y={40} delayFrames={10} color={COLORS.yellow400} fontSize={32} />
      </Sequence>
    </SceneContainer>
  );
};
