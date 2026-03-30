import { Composition, Folder } from "remotion";
import { VIDEO } from "./lib/theme";
import { ShowcaseVideo } from "./ShowcaseVideo";
import { Scene1Lobby } from "./scenes/Scene1Lobby";
import { Scene2DeckBuilder } from "./scenes/Scene2DeckBuilder";
import { Scene3Gameplay } from "./scenes/Scene3Gameplay";
import { Scene4Finale } from "./scenes/Scene4Finale";

const SCENE_DURATIONS = {
  lobby: 300,
  deckBuilder: 300,
  gameplay: 750,
  finale: 450,
} as const;

const TRANSITION_FRAMES = 20;
const TOTAL_DURATION =
  Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0) -
  3 * TRANSITION_FRAMES;

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="ShowcaseVideo"
        component={ShowcaseVideo}
        durationInFrames={TOTAL_DURATION}
        fps={VIDEO.FPS}
        width={VIDEO.WIDTH}
        height={VIDEO.HEIGHT}
      />
      <Folder name="Scenes">
        <Composition
          id="Scene1-Lobby"
          component={Scene1Lobby}
          durationInFrames={SCENE_DURATIONS.lobby}
          fps={VIDEO.FPS}
          width={VIDEO.WIDTH}
          height={VIDEO.HEIGHT}
        />
        <Composition
          id="Scene2-DeckBuilder"
          component={Scene2DeckBuilder}
          durationInFrames={SCENE_DURATIONS.deckBuilder}
          fps={VIDEO.FPS}
          width={VIDEO.WIDTH}
          height={VIDEO.HEIGHT}
        />
        <Composition
          id="Scene3-Gameplay"
          component={Scene3Gameplay}
          durationInFrames={SCENE_DURATIONS.gameplay}
          fps={VIDEO.FPS}
          width={VIDEO.WIDTH}
          height={VIDEO.HEIGHT}
        />
        <Composition
          id="Scene4-Finale"
          component={Scene4Finale}
          durationInFrames={SCENE_DURATIONS.finale}
          fps={VIDEO.FPS}
          width={VIDEO.WIDTH}
          height={VIDEO.HEIGHT}
        />
      </Folder>
    </>
  );
};
