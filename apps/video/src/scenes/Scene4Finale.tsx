import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { SceneContainer } from "../components/SceneContainer";
import { ScreenshotFrame } from "../components/ScreenshotFrame";
import { COLORS, GLOW, FONT_TITLE } from "../lib/theme";
import { springEntrance, scaleEntrance, pulseGlow } from "../lib/animations";

const TECH_STACK = [
  { name: "React 18", color: "#61dafb" },
  { name: "Vite", color: "#646cff" },
  { name: "Fastify", color: COLORS.white },
  { name: "Socket.io", color: COLORS.white },
  { name: "Tailwind CSS", color: "#38bdf8" },
  { name: "Vercel", color: COLORS.white },
];

export const Scene4Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeToBlack = interpolate(frame, [390, 450], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneContainer>
      {/* End game result screenshot */}
      <Sequence from={0} durationInFrames={150} premountFor={10}>
        <AbsoluteFill
          style={{
            opacity: springEntrance(frame, fps, 0),
            transform: `scale(${scaleEntrance(frame, fps, 0)})`,
          }}
        >
          <ScreenshotFrame src="game-over-1920.png" />
        </AbsoluteFill>
      </Sequence>

      {/* "Game Over" overlay */}
      <Sequence from={20} durationInFrames={130} layout="none" premountFor={10}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: 30,
          }}
        >
          <div
            style={{
              opacity: springEntrance(frame, fps, 20),
              transform: `scale(${scaleEntrance(frame, fps, 20)})`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_TITLE,
                fontSize: 64,
                color: COLORS.yellow300,
                textShadow: GLOW.yellowStrong,
              }}
            >
              Game Over!
            </span>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* OG image / social preview */}
      <Sequence from={150} durationInFrames={90} premountFor={20}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.9)",
          }}
        >
          <div
            style={{
              opacity: springEntrance(frame - 150, fps, 0),
              transform: `translateY(${interpolate(
                spring({ frame: frame - 150, fps, config: { damping: 200 } }),
                [0, 1],
                [60, 0]
              )}px)`,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: GLOW.yellow,
              border: `3px solid ${COLORS.yellow400}`,
            }}
          >
            <ScreenshotFrame
              src="og-image.png"
              style={{ width: 900, height: "auto", objectFit: "contain" }}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Tech stack grid */}
      <Sequence from={240} durationInFrames={120} premountFor={20}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.92)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: FONT_TITLE,
                fontSize: 48,
                color: COLORS.white,
                marginBottom: 50,
                opacity: springEntrance(frame - 240, fps, 0),
                textShadow: GLOW.yellow,
              }}
            >
              Built With
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 20,
                maxWidth: 800,
              }}
            >
              {TECH_STACK.map((tech, i) => {
                const p = springEntrance(frame - 240, fps, 10 + i * 8);
                return (
                  <div
                    key={tech.name}
                    style={{
                      opacity: p,
                      transform: `scale(${0.8 + 0.2 * p}) translateY(${(1 - p) * 20}px)`,
                      backgroundColor: COLORS.black,
                      border: `2px solid ${COLORS.yellow400}`,
                      borderRadius: 12,
                      padding: "16px 32px",
                      fontFamily: "system-ui, sans-serif",
                      fontSize: 28,
                      fontWeight: 700,
                      color: tech.color,
                    }}
                  >
                    {tech.name}
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Final title with golden glow */}
      <Sequence from={360} durationInFrames={90} premountFor={20}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.black,
          }}
        >
          <div
            style={{
              opacity: springEntrance(frame - 360, fps, 0),
              transform: `scale(${scaleEntrance(frame, fps, 360)})`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_TITLE,
                fontSize: 110,
                color: COLORS.white,
                textShadow: `0 0 ${20 + pulseGlow(frame, fps) * 20}px rgba(250, 204, 21, ${0.35 + pulseGlow(frame, fps) * 0.2}), 0 0 ${60 + pulseGlow(frame, fps) * 30}px rgba(250, 204, 21, ${0.15 + pulseGlow(frame, fps) * 0.15})`,
                letterSpacing: 6,
              }}
            >
              Queen's Blood
            </span>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Fade to black */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.black,
          opacity: fadeToBlack,
          zIndex: 100,
        }}
      />
    </SceneContainer>
  );
};
