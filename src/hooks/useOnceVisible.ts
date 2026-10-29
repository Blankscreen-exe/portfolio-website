'use client'

import { type RefObject, useEffect, useRef } from 'react'

/** Calls `onVisible` once, the first time `ref` scrolls into view. */
export function useOnceVisible(ref: RefObject<Element | null>, onVisible: () => void, threshold = 0.2) {
  const callback = useRef(onVisible)
  useEffect(() => {
    callback.current = onVisible
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      callback.current()
    }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold])
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
