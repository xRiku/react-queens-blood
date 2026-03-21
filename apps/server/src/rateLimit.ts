const WINDOW_MS = 1000;
const MAX_EVENTS = 15;

type SocketRateState = {
  timestamps: number[];
};

const rateLimitMap = new Map<string, SocketRateState>();

export function checkRateLimit(socketId: string): boolean {
  const now = Date.now();
  let state = rateLimitMap.get(socketId);

  if (!state) {
    state = { timestamps: [] };
    rateLimitMap.set(socketId, state);
  }

  state.timestamps = state.timestamps.filter((t) => now - t < WINDOW_MS);

  if (state.timestamps.length >= MAX_EVENTS) {
    return false;
  }

  state.timestamps.push(now);
  return true;
}

export function cleanupRateLimit(socketId: string): void {
  rateLimitMap.delete(socketId);
}
