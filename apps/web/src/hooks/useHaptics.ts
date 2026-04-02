import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { useWebHaptics } from 'web-haptics/react'

type HapticTrigger =
  | 'success'
  | 'warning'
  | 'error'
  | 'light'
  | 'medium'
  | 'heavy'
  | 'selection'

const TOUCH_POINTER_QUERY = '(pointer: coarse)'

function getServerSnapshot() {
  return false
}

function getSnapshot() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia(TOUCH_POINTER_QUERY).matches
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {}
  }

  const mql = window.matchMedia(TOUCH_POINTER_QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

export function useHaptics() {
  const haptics = useWebHaptics()
  const isTouchPointer = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const trigger = useCallback((type?: HapticTrigger) => {
    if (!isTouchPointer) return
    haptics.trigger(type)
  }, [haptics, isTouchPointer])

  const impactLight = useCallback(() => trigger('light'), [trigger])
  const impactMedium = useCallback(() => trigger('medium'), [trigger])
  const impactHeavy = useCallback(() => trigger('heavy'), [trigger])
  const selection = useCallback(() => trigger('selection'), [trigger])
  const success = useCallback(() => trigger('success'), [trigger])
  const warning = useCallback(() => trigger('warning'), [trigger])
  const error = useCallback(() => trigger('error'), [trigger])

  return useMemo(() => ({
    trigger,
    impactLight,
    impactMedium,
    impactHeavy,
    selection,
    success,
    warning,
    error,
  }), [trigger, impactLight, impactMedium, impactHeavy, selection, success, warning, error])
}
