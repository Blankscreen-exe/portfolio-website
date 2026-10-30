'use client'

import { useEffect } from 'react'
import { prefersReducedMotion } from '@/hooks/useOnceVisible'

/**
 * Site-wide motion wiring, mounted once in the site layout. Renders nothing.
 * - Sets [data-in] on every [data-reveal] element as it enters the viewport (CSS does the rest).
 *   A MutationObserver picks up elements rendered later (navigation, filtering, pagination).
 * - Delegated pointer handlers drive the card spotlight/tilt (.ss-spot) and magnetic
 *   buttons (.ss-magnet), so individual components don't need their own listeners.
 */
export default function MotionRoot() {
  useEffect(() => {
    const reduced = prefersReducedMotion()

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.setAttribute('data-in', '')
          io.unobserve(e.target)
        }
      },
      { threshold: 0.12 }
    )
    const scan = () => document.querySelectorAll('[data-reveal]:not([data-in])').forEach((el) => io.observe(el))
    scan()
    let pending = 0
    const mo = new MutationObserver(() => {
      if (!pending) pending = requestAnimationFrame(() => ((pending = 0), scan()))
    })
    mo.observe(document.body, { childList: true, subtree: true })

    const onMove = (e: MouseEvent) => {
      const target = e.target as Element | null
      const spot = target?.closest<HTMLElement>('.ss-spot')
      if (spot) {
        const r = spot.getBoundingClientRect()
        const x = e.clientX - r.left
        const y = e.clientY - r.top
        spot.style.setProperty('--x', `${x}px`)
        spot.style.setProperty('--y', `${y}px`)
        if (!reduced) {
          spot.style.setProperty('--ry', `${(x / r.width - 0.5) * 4}deg`)
          spot.style.setProperty('--rx', `${(0.5 - y / r.height) * 4}deg`)
        }
      }
      const magnet = target?.closest<HTMLElement>('.ss-magnet')
      if (magnet && !reduced) {
        const r = magnet.getBoundingClientRect()
        magnet.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`
      }
    }
    const onOut = (e: MouseEvent) => {
      const target = e.target as Element | null
      const related = e.relatedTarget as Node | null
      const spot = target?.closest<HTMLElement>('.ss-spot')
      if (spot && !spot.contains(related)) {
        spot.style.setProperty('--rx', '0deg')
        spot.style.setProperty('--ry', '0deg')
      }
      const magnet = target?.closest<HTMLElement>('.ss-magnet')
      if (magnet && !magnet.contains(related)) magnet.style.transform = ''
    }
    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseout', onOut)

    return () => {
      io.disconnect()
      mo.disconnect()
      cancelAnimationFrame(pending)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  return null
}
