import { create } from 'zustand'

type SoundStoreType = {
  muted: boolean;
  toggleMute: () => void;
  resetStore: () => void;
}

const useSoundStore = create<SoundStoreType>((set) => ({
  muted: localStorage.getItem('muted') === 'true',
  toggleMute: () =>
    set((state) => {
      const newMuted = !state.muted
      localStorage.setItem('muted', String(newMuted))
      return { muted: newMuted }
    }),
  resetStore: () => set({ muted: localStorage.getItem('muted') === 'true' }),
}))

export function playSound(audio: HTMLAudioElement, volume = 0.4) {
  if (useSoundStore.getState().muted) return
  audio.pause()
  audio.currentTime = 0
  audio.volume = volume
  audio.play()
}

let audioCtx: AudioContext | null = null
function getAudioContext() {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

export function playSynthSound(type: 'invalid' | 'gameStart') {
  if (useSoundStore.getState().muted) return

  const ctx = getAudioContext()

  if (type === 'gameStart') {
    // Casino-style dramatic chord stinger — two quick rising notes + resolving power chord
    const t = ctx.currentTime

    // Note 1: short staccato hit
    const o1 = ctx.createOscillator()
    const g1 = ctx.createGain()
    o1.type = 'sine'
    o1.frequency.setValueAtTime(523.25, t) // C5
    g1.gain.setValueAtTime(0.3, t)
    g1.gain.exponentialRampToValueAtTime(0.01, t + 0.12)
    o1.connect(g1)
    g1.connect(ctx.destination)
    o1.start(t)
    o1.stop(t + 0.12)

    // Note 2: second staccato hit, higher
    const o2 = ctx.createOscillator()
    const g2 = ctx.createGain()
    o2.type = 'sine'
    o2.frequency.setValueAtTime(659.25, t + 0.15) // E5
    g2.gain.setValueAtTime(0.3, t + 0.15)
    g2.gain.exponentialRampToValueAtTime(0.01, t + 0.27)
    o2.connect(g2)
    g2.connect(ctx.destination)
    o2.start(t + 0.15)
    o2.stop(t + 0.27)

    // Note 3: resolving octave with shimmer — sustained
    const o3 = ctx.createOscillator()
    const o3b = ctx.createOscillator()
    const g3 = ctx.createGain()
    o3.type = 'sine'
    o3b.type = 'sine'
    o3.frequency.setValueAtTime(1046.5, t + 0.32) // C6
    o3b.frequency.setValueAtTime(783.99, t + 0.32) // G5 — perfect fifth for richness
    g3.gain.setValueAtTime(0.25, t + 0.32)
    g3.gain.setValueAtTime(0.25, t + 0.6)
    g3.gain.exponentialRampToValueAtTime(0.01, t + 1.0)
    o3.connect(g3)
    o3b.connect(g3)
    g3.connect(ctx.destination)
    o3.start(t + 0.32)
    o3b.start(t + 0.32)
    o3.stop(t + 1.0)
    o3b.stop(t + 1.0)
  } else {
    // Rejected — quick descending double tap, like chips being pushed back
    const t = ctx.currentTime

    const o1 = ctx.createOscillator()
    const g1 = ctx.createGain()
    o1.type = 'sine'
    o1.frequency.setValueAtTime(400, t)
    o1.frequency.exponentialRampToValueAtTime(250, t + 0.08)
    g1.gain.setValueAtTime(0.18, t)
    g1.gain.exponentialRampToValueAtTime(0.01, t + 0.09)
    o1.connect(g1)
    g1.connect(ctx.destination)
    o1.start(t)
    o1.stop(t + 0.09)

    const o2 = ctx.createOscillator()
    const g2 = ctx.createGain()
    o2.type = 'sine'
    o2.frequency.setValueAtTime(300, t + 0.1)
    o2.frequency.exponentialRampToValueAtTime(150, t + 0.18)
    g2.gain.setValueAtTime(0.15, t + 0.1)
    g2.gain.exponentialRampToValueAtTime(0.01, t + 0.2)
    o2.connect(g2)
    g2.connect(ctx.destination)
    o2.start(t + 0.1)
    o2.stop(t + 0.2)
  }
}

export default useSoundStore
