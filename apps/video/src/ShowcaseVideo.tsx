import React from "react";
import { useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";

import { DURATIONS, TRANSITION_FRAMES } from "./constants";
import { HookScene } from "./scenes/HookScene";
import { PlayInstantlyScene } from "./scenes/PlayInstantlyScene";
import { CardEffectsScene } from "./scenes/CardEffectsScene";
import { PreviewScene } from "./scenes/PreviewScene";
import { MultiplayerScene } from "./scenes/MultiplayerScene";
import { SoundPolishScene } from "./scenes/SoundPolishScene";
import { DeckBuilderScene } from "./scenes/DeckBuilderScene";
import { CTAScene } from "./scenes/CTAScene";

type ShowcaseVideoProps = {
  vertical: boolean;
};

export const ShowcaseVideo: React.FC<ShowcaseVideoProps> = ({ vertical }) => {
  const { fps } = useVideoConfig();

  const timing = linearTiming({ durationInFrames: TRANSITION_FRAMES });

  const scenes = [
    { component: <HookScene />, duration: DURATIONS.hook },
    { component: <PlayInstantlyScene />, duration: DURATIONS.playInstantly },
    { component: <CardEffectsScene />, duration: DURATIONS.cardEffects },
    { component: <PreviewScene />, duration: DURATIONS.preview },
    { component: <MultiplayerScene />, duration: DURATIONS.multiplayer },
    { component: <SoundPolishScene />, duration: DURATIONS.soundPolish },
    { component: <DeckBuilderScene />, duration: DURATIONS.deckBuilder },
    { component: <CTAScene />, duration: DURATIONS.cta },
  ];

  // Alternate transition types for visual variety
  const transitions = [
    { presentation: slide({ direction: "from-right" }) },
    { presentation: fade() },
    { presentation: wipe({ direction: "from-left" }) },
    { presentation: slide({ direction: "from-bottom" }) },
    { presentation: fade() },
    { presentation: wipe({ direction: "from-right" }) },
    { presentation: fade() },
  ];

  return (
    <>
      {/* Background music — drop an mp3 in public/music.mp3 */}
      {/* <Audio src={staticFile("music.mp3")} volume={0.5} /> */}

      <TransitionSeries>
        {scenes.map((scene, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence
              durationInFrames={scene.duration * fps}
            >
              {scene.component}
            </TransitionSeries.Sequence>
            {i < scenes.length - 1 && (
              <TransitionSeries.Transition
                presentation={transitions[i].presentation}
                timing={timing}
              />
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>
    </>
  );
};
