import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Scene1Lobby } from "./scenes/Scene1Lobby";
import { Scene2DeckBuilder } from "./scenes/Scene2DeckBuilder";
import { Scene3Gameplay } from "./scenes/Scene3Gameplay";
import { Scene4Finale } from "./scenes/Scene4Finale";

const TRANSITION_DURATION = 20;

export const ShowcaseVideo: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1: Lobby & Multiplayer */}
      <TransitionSeries.Sequence durationInFrames={300}>
        <Scene1Lobby />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* Scene 2: Deck Builder */}
      <TransitionSeries.Sequence durationInFrames={300}>
        <Scene2DeckBuilder />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* Scene 3: Live Gameplay + Effects */}
      <TransitionSeries.Sequence durationInFrames={750}>
        <Scene3Gameplay />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* Scene 4: Finale */}
      <TransitionSeries.Sequence durationInFrames={450}>
        <Scene4Finale />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
