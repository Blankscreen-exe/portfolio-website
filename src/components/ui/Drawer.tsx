'use client'

import { type ReactNode, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { prefersReducedMotion } from '@/hooks/useOnceVisible'
import { Cross } from './Decor'

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'

type Props = {
  open: boolean
  onClose: () => void
  /** Small `[ label ]` text in the top bar */
  label: string
  /** Accessible name of the dialog */
  title: string
  children: ReactNode
  /** Optional bar pinned to the bottom (e.g. previous / next) */
  footer?: ReactNode
}

/**
 * Side drawer that slides in from the right over a dimmed backdrop.
 * Closes on Esc, backdrop click or the close button; traps focus while open, locks page
 * scroll, and returns focus to whatever opened it. Rendered in a portal so the page's
 * overflow and transform rules can't clip it.
 */
export default function Drawer({ open, onClose, label, title, children, footer }: Props) {
  const [mounted, setMounted] = useState(open)
  const [shown, setShown] = useState(false)
  const panelRef = useRef<HTMLElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  // Latest onClose, without re-running the open effect (which would steal focus) every render
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })
  const titleId = useId()

  // Mount as soon as it's asked to open (adjusting state during render, not in an effect)
  if (open && !mounted) setMounted(true)

  // Slide in on the next frames; slide out, then unmount once the transition has finished
  useEffect(() => {
    if (open) {
      opener.current = document.activeElement as HTMLElement | null
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
      return () => cancelAnimationFrame(raf)
    }
    opener.current?.focus?.()
    const raf = requestAnimationFrame(() => setShown(false))
    const t = setTimeout(() => setMounted(false), prefersReducedMotion() ? 0 : 500)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [open])

  // While open: Esc closes, Tab stays inside, the page behind doesn't scroll
  useEffect(() => {
    if (!open || !mounted) return
    panelRef.current?.querySelector<HTMLElement>('[data-drawer-close]')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
      if (e.key !== 'Tab' || !panelRef.current) return
      const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      root.style.overflow = previousOverflow
    }
  }, [open, mounted])

  if (!mounted) return null

  return createPortal(
    <div className="ss-drawer-root fixed inset-0 z-[150] font-inter text-ink" data-shown={shown || undefined}>
      <div className="ss-drawer-backdrop absolute inset-0 bg-frame/60" onClick={onClose} aria-hidden="true" />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="ss-drawer absolute bottom-0 right-0 top-0 flex w-full max-w-[560px] flex-col border-l border-ink"
      >
        <div className="flex items-stretch justify-between border-b border-ink">
          <span className="flex items-center px-5 font-jet text-[11px] uppercase tracking-[.16em] text-ash">[ {label} ]</span>
          <button
            type="button"
            data-drawer-close
            onClick={onClose}
            className="border-l border-ink px-5 py-4 font-jet text-xs uppercase tracking-[.16em] transition-colors hover:bg-ink hover:text-stock"
          >
            Close <Cross />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <h2 id={titleId} className="sr-only">
            {title}
          </h2>
          {children}
        </div>
        {footer && <div className="border-t border-ink">{footer}</div>}
      </aside>
    </div>,
    document.body
  )
}
