import { Composition } from "remotion";
import { ShowcaseVideo } from "./ShowcaseVideo";
import {
  FPS,
  WIDTH,
  HEIGHT,
  VERTICAL_WIDTH,
  VERTICAL_HEIGHT,
  TOTAL_SECONDS,
  TRANSITION_FRAMES,
  DURATIONS,
} from "./constants";

// 7 transitions between 8 scenes, each consuming TRANSITION_FRAMES
const transitionOverlap = 7 * TRANSITION_FRAMES;
const totalFrames = TOTAL_SECONDS * FPS - transitionOverlap;

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="ShowcaseVideo"
        component={ShowcaseVideo}
        durationInFrames={totalFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ vertical: false } satisfies { vertical: boolean }}
      />
      <Composition
        id="ShowcaseVideoVertical"
        component={ShowcaseVideo}
        durationInFrames={totalFrames}
        fps={FPS}
        width={VERTICAL_WIDTH}
        height={VERTICAL_HEIGHT}
        defaultProps={{ vertical: true } satisfies { vertical: boolean }}
      />
    </>
  );
};
