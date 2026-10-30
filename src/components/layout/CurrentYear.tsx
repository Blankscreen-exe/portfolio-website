'use client'

import { useSyncExternalStore } from 'react'

const neverChanges = () => () => {}

/** Pages are prerendered, so the browser corrects the year when a new one has started since the last build. */
export default function CurrentYear({ builtIn }: { builtIn: number }) {
  return useSyncExternalStore(neverChanges, () => new Date().getFullYear(), () => builtIn)
}
