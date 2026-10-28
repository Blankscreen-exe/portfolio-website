import React, { useEffect, useRef, useState } from 'react'

// Motion helpers for the spec-sheet redesign. Styles live in src/styles/sheet.css.

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Fires `onVisible` once, the first time `ref` scrolls into view.
function useOnceVisible(ref, onVisible, threshold = 0.2) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      onVisible()
    }, { threshold })
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/**
 * Site-wide motion wiring, mounted once in App.
 * - Sets [data-in] on any [data-reveal] element when it enters the viewport. An attribute
 *   (not a class) is used so React re-renders never wipe it.
 * - A MutationObserver picks up elements rendered later (route changes, lazy content).
 * - Delegated pointer handlers drive the card spotlight/tilt (.ss-spot) and magnetic
 *   buttons (.ss-magnet), so components don't each need listeners.
 */
export function useSheetMotion() {
  useEffect(() => {
    const reduced = prefersReducedMotion()

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        e.target.setAttribute('data-in', '')
        io.unobserve(e.target)
      })
    // No negative root margin, so content near the bottom of the first screen still shows on load
    }, { threshold: 0.12 })

    const scan = () => document.querySelectorAll('[data-reveal]:not([data-in])').forEach((el) => io.observe(el))
    scan()
    let pending = null
    const mo = new MutationObserver(() => {
      if (pending) return
      pending = requestAnimationFrame(() => { pending = null; scan() })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    const onMove = (e) => {
      const spot = e.target.closest?.('.ss-spot')
      if (spot) {
        const r = spot.getBoundingClientRect()
        const x = e.clientX - r.left, y = e.clientY - r.top
        spot.style.setProperty('--x', x + 'px')
        spot.style.setProperty('--y', y + 'px')
        if (!reduced) {
          spot.style.setProperty('--ry', ((x / r.width - 0.5) * 4) + 'deg')
          spot.style.setProperty('--rx', ((0.5 - y / r.height) * 4) + 'deg')
        }
      }
      const mag = e.target.closest?.('.ss-magnet')
      if (mag && !reduced) {
        const r = mag.getBoundingClientRect()
        mag.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`
      }
    }
    const onOut = (e) => {
      const spot = e.target.closest?.('.ss-spot')
      if (spot && !spot.contains(e.relatedTarget)) {
        spot.style.setProperty('--rx', '0deg')
        spot.style.setProperty('--ry', '0deg')
      }
      const mag = e.target.closest?.('.ss-magnet')
      if (mag && !mag.contains(e.relatedTarget)) mag.style.transform = ''
    }
    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseout', onOut)

    return () => {
      io.disconnect()
      mo.disconnect()
      if (pending) cancelAnimationFrame(pending)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])
}

const GLYPHS = '▚▞░▒/\\_<>#*+=01'

/**
 * Text that scrambles through glyphs before settling. Plays when first scrolled into
 * view, and again whenever `text` changes (used by the header's section readout).
 */
export function Scramble({ text, className, as: Tag = 'span' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(text)
  const visible = useRef(false)
  const run = useRef(0)

  const play = () => {
    if (prefersReducedMotion()) return setShown(text)
    const token = ++run.current
    const total = 22
    let frame = 0
    const tick = () => {
      if (token !== run.current) return // a newer run took over
      setShown(text.split('').map((c, i) =>
        c === ' ' || c === '[' || c === ']' || i < (frame / total) * text.length
          ? c
          : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      ).join(''))
      if (frame++ < total) setTimeout(tick, 32)
      else setShown(text)
    }
    tick()
  }

  useOnceVisible(ref, () => { visible.current = true; play() })
  useEffect(() => {
    if (visible.current) play()
    else setShown(text)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])
  useEffect(() => () => { run.current++ }, [])

  return <Tag ref={ref} className={className} aria-label={text}>{shown}</Tag>
}

/** Number that counts up from 0 the first time it is scrolled into view. */
export function CountUp({ to, duration = 1300 }) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)
  useOnceVisible(ref, () => {
    if (prefersReducedMotion()) return setValue(to)
    const start = performance.now()
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1)
      setValue(Math.round(to * (1 - Math.pow(1 - t, 3))))
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, 0.4)
  return <span ref={ref}>{value}</span>
}

/**
 * Splits a metric string like "20+", "~5", "99%" into prefix / number / suffix
 * so the number can count up.
 */
export function parseMetric(value) {
  const m = String(value).match(/^(\D*)(\d+)(.*)$/)
  return m ? { prefix: m[1], number: +m[2], suffix: m[3] } : { prefix: '', number: null, suffix: String(value) }
}
