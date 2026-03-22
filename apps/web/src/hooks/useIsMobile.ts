import { useSyncExternalStore } from 'react'

const MOBILE_BREAKPOINT = 767

const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)

function subscribe(callback: () => void) {
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getSnapshot() {
  return mql.matches
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot)
}
