'use client'

import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion, useOnceVisible } from '@/hooks/useOnceVisible'

const GLYPHS = '▚▞░▒/\\_<>#*+=01'
const FRAMES = 22

/**
 * Text that scrambles through glyphs before settling. Plays the first time it scrolls into
 * view, and again whenever `text` changes (the header's section readout uses this).
 * The real text is rendered on the server, so it's what search engines and screen readers get.
 */
export default function Scramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(text)
  const visible = useRef(false)
  const run = useRef(0)

  const play = () => {
    if (prefersReducedMotion()) return setShown(text)
    const token = ++run.current
    let frame = 0
    const tick = () => {
      if (token !== run.current) return // a newer run took over
      setShown(
        text
          .split('')
          .map((c, i) => (c === ' ' || c === '[' || c === ']' || i < (frame / FRAMES) * text.length ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join('')
      )
      if (frame++ < FRAMES) setTimeout(tick, 32)
      else setShown(text)
    }
    tick()
  }

  useOnceVisible(ref, () => {
    visible.current = true
    play()
  })

  useEffect(() => {
    if (visible.current) play()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- replay only when the text changes
  }, [text])

  useEffect(() => () => void run.current++, [])

  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  )
}
