'use client'

import { useRef, useState } from 'react'
import { prefersReducedMotion, useOnceVisible } from '@/hooks/useOnceVisible'

/**
 * Number that counts up from 0 the first time it's scrolled into view (ease-out cubic).
 * Server-renders the final value so the number is correct without JavaScript.
 */
export default function CountUp({ to, duration = 1300 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(to)

  useOnceVisible(ref, () => {
    if (prefersReducedMotion()) return
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setValue(Math.round(to * (1 - Math.pow(1 - t, 3))))
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, 0.4)

  return <span ref={ref}>{value}</span>
}
