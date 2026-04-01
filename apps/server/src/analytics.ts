import { PostHog } from "posthog-node";

const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY;
const POSTHOG_HOST = process.env.POSTHOG_HOST || "https://us.i.posthog.com";

const posthog = POSTHOG_API_KEY
  ? new PostHog(POSTHOG_API_KEY, {
      host: POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    })
  : null;

export function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>
): void {
  if (!posthog) return;

  void posthog.capture({
    distinctId,
    event,
    properties: {
      app: "react-queens-blood",
      source: "server",
      ...properties,
    },
  });
}

export async function shutdownAnalytics(): Promise<void> {
  if (!posthog) return;
  await posthog.shutdown();
}
