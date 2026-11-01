'use client'

import Image from 'next/image'
import { type KeyboardEvent, useEffect, useRef } from 'react'

import { ArrowLeft, ArrowRight, Cross } from '@/components/ui/Decor'
import type { Sketch } from '@/lib/content'
import { pad } from '@/lib/format'

const SWIPE_DISTANCE = 50

type Props = {
  sketches: Sketch[]
  index: number
  onChange: (index: number) => void
  onClose: () => void
}

/**
 * Full-screen viewer. Built on the native <dialog>, which brings the focus trap, Esc to close
 * and returning focus to the thumbnail on close. Prev/next wrap around the current list.
 */
export default function SketchViewer({ sketches, index, onChange, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const touchStart = useRef<number | null>(null)
  const sketch = sketches[index]
  const single = sketches.length < 2

  const go = (step: number) => onChange((index + step + sketches.length) % sketches.length)
  // Goes through close() so the browser restores focus before the dialog unmounts (via onClose)
  const close = () => dialog.current?.close()

  useEffect(() => {
    const el = dialog.current
    if (el && !el.open) el.showModal()
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previousOverflow
    }
  }, [])

  const onKeyDown = (e: KeyboardEvent) => {
    if (single) return
    if (e.key === 'ArrowLeft') go(-1)
    if (e.key === 'ArrowRight') go(1)
  }

  const arrow = 'border border-ink bg-paper px-4 py-3 font-jet text-sm transition-colors hover:bg-ink hover:text-stock'

  return (
    <dialog
      ref={dialog}
      aria-label={sketch.title}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (single || touchStart.current === null) return
        const moved = e.changedTouches[0].clientX - touchStart.current
        if (Math.abs(moved) >= SWIPE_DISTANCE) go(moved < 0 ? 1 : -1)
        touchStart.current = null
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-stock p-0 font-inter text-ink"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-stretch justify-between border-b border-ink">
          <span className="flex items-center px-5 font-jet text-[11px] uppercase tracking-[.16em] text-ash" aria-live="polite">
            {pad(index + 1)} / {pad(sketches.length)}
          </span>
          <button type="button" onClick={close} className="border-l border-ink px-5 py-4 font-jet text-xs uppercase tracking-[.16em] transition-colors hover:bg-ink hover:text-stock">
            Close <Cross />
          </button>
        </div>

        {/* Clicking the picture area closes the viewer, like clicking a backdrop */}
        <div className="relative min-h-0 flex-1 p-3 sm:p-6" onClick={close}>
          <div className="relative h-full w-full">
            <Image key={sketch.image} src={sketch.image} alt={sketch.alt || sketch.title} fill loading="eager" sizes="100vw" className="object-contain" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-ink px-5 py-3">
          <p className="min-w-0 font-jet text-[11px] uppercase tracking-[.14em]">
            {sketch.title}
            {sketch.date && <span className="text-ash"> · {sketch.date.slice(0, 4)}</span>}
          </p>
          {!single && (
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => go(-1)} aria-label="Previous drawing" className={arrow}>
                <ArrowLeft />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next drawing" className={arrow}>
                <ArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  )
}
