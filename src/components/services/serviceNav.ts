'use client'

import { useSyncExternalStore } from 'react'

// The active service lives in the URL hash (#service-3), so the hero's "On this page" list,
// the carousel and links from other pages (/services#service-3) all share one source of truth.

const EVENT = 'service-nav'
export const HASH_PATTERN = /^#service-(\d+)$/

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  window.addEventListener(EVENT, onChange)
  return () => {
    window.removeEventListener('hashchange', onChange)
    window.removeEventListener(EVENT, onChange)
  }
}
const getSnapshot = () => window.location.hash
const getServerSnapshot = () => ''

/** Index of the service in the URL hash, clamped to 0…count-1 (0 when there's no hash). */
export function useActiveService(count: number) {
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const n = Number(hash.match(HASH_PATTERN)?.[1] ?? 0)
  return Math.min(Math.max(n, 0), Math.max(count - 1, 0))
}

/** Show service `index` without adding a history entry for every slide. */
export function goToService(index: number) {
  window.history.replaceState(null, '', `#service-${index}`)
  window.dispatchEvent(new Event(EVENT))
}

export const serviceId = (index: number) => `service-${index}`
