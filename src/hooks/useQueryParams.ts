'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'

// Query-string state (?page=2&tag=python) that survives refresh, back/forward and sharing.
//
// Built on useSyncExternalStore instead of next/navigation's useSearchParams: the server
// snapshot is an empty query, so statically generated pages render their default view and
// hydrate cleanly, then switch to the URL's state. (useSearchParams would require a
// <Suspense> boundary around every list on these static pages.)

const listeners = new Set<() => void>()

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  window.addEventListener('popstate', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('popstate', onChange)
  }
}
const getSnapshot = () => window.location.search
const getServerSnapshot = () => ''

export function useQueryParams() {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const params = useMemo(() => new URLSearchParams(search), [search])

  /** Merge changes into the URL in one history entry; pass null or '' to remove a key. */
  const update = useCallback((changes: Record<string, string | number | null>) => {
    const next = new URLSearchParams(window.location.search)
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === '') next.delete(key)
      else next.set(key, String(value))
    }
    const qs = next.toString()
    // Native history calls are integrated with the Next.js router
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
    listeners.forEach((notify) => notify())
  }, [])

  return [params, update] as const
}
