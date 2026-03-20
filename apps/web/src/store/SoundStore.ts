import { create } from "zustand";

type SoundStoreType = {
  muted: boolean;
  toggleMute: () => void;
  resetStore: () => void;
};

const useSoundStore = create<SoundStoreType>((set) => ({
  muted: localStorage.getItem("muted") === "true",
  toggleMute: () =>
    set((state) => {
      const newMuted = !state.muted;
      localStorage.setItem("muted", String(newMuted));
      return { muted: newMuted };
    }),
  resetStore: () => set({ muted: localStorage.getItem("muted") === "true" }),
}));

export function playSound(audio: HTMLAudioElement, volume = 0.4) {
  if (useSoundStore.getState().muted) return;
  audio.pause();
  audio.currentTime = 0;
  audio.volume = volume;
  audio.play();
}

let audioCtx: AudioContext | null = null;
function getAudioContext() {
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function playSynthSound(type: "place" | "invalid") {
  if (useSoundStore.getState().muted) return;

  const ctx = getAudioContext();

  if (type === "place") {
    // Soft thud/tap — low-frequency noise burst
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  } else {
    // Short buzz — dissonant square wave
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.12);
  }
}

export default useSoundStore;
