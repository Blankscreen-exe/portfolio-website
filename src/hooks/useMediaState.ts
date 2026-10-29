'use client'

import { useSyncExternalStore } from 'react'

// Live browser state as React values, safe for static rendering (server snapshots are the
// "nothing special" defaults) and without setState-in-effect.

const REDUCED = '(prefers-reduced-motion: reduce)'

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(REDUCED).matches,
    () => false
  )
}

/** False while the tab is in the background. */
export function usePageVisible() {
  return useSyncExternalStore(
    (onChange) => {
      document.addEventListener('visibilitychange', onChange)
      return () => document.removeEventListener('visibilitychange', onChange)
    },
    () => document.visibilityState === 'visible',
    () => true
  )
}
