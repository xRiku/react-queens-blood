import posthog from 'posthog-js'

const POSTHOG_KEY =
  import.meta.env.VITE_POSTHOG_KEY ||
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const POSTHOG_HOST =
  import.meta.env.VITE_POSTHOG_HOST ||
  import.meta.env.VITE_PUBLIC_POSTHOG_HOST ||
  'https://us.i.posthog.com'
const SESSION_VISIT_KEY = 'qb_site_visited_session'
const SESSION_BOOT_KEY = 'qb_analytics_boot_session'

let initialized = false

function isEnabled() {
  return Boolean(POSTHOG_KEY)
}

export function initAnalytics() {
  if (initialized || !isEnabled()) return

  posthog.init(POSTHOG_KEY!, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    autocapture: true,
    persistence: 'localStorage+cookie',
  })

  posthog.register({
    app: 'react-queens-blood',
    platform: 'web',
  })

  initialized = true

  if (!sessionStorage.getItem(SESSION_BOOT_KEY)) {
    posthog.capture('analytics_initialized', {
      env: import.meta.env.MODE,
      entry_path: window.location.pathname,
    })
    sessionStorage.setItem(SESSION_BOOT_KEY, '1')
  }

  if (import.meta.env.DEV) {
    posthog.capture('analytics_dev_ping', {
      env: import.meta.env.MODE,
      entry_path: window.location.pathname,
      timestamp: Date.now(),
    })
  }
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (!initialized) return
  posthog.capture(event, properties)
}

export function trackSiteVisitedOnce() {
  if (!initialized) return
  if (sessionStorage.getItem(SESSION_VISIT_KEY)) return

  trackEvent('site_visited', {
    entry_path: window.location.pathname,
    is_mobile: window.matchMedia('(max-width: 768px)').matches,
    env: import.meta.env.MODE,
  })

  sessionStorage.setItem(SESSION_VISIT_KEY, '1')
}
