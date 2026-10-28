import React, { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { prefersReducedMotion } from '../../helpers/sheetMotion'

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'

/**
 * Side drawer that slides in from the right over a dimmed backdrop.
 * Closes on Esc, backdrop click or the close button; traps focus while open, locks page
 * scroll, and returns focus to whatever opened it. Rendered in a portal so the sheet's
 * overflow/transform rules can't clip it.
 *
 * label:  small `[ label ]` text in the drawer's top bar
 * footer: optional node pinned to the bottom (e.g. prev / next)
 */
function Drawer({ open, onClose, label, title, children, footer }) {
  const [mounted, setMounted] = useState(open)
  const [shown, setShown] = useState(false)
  const panelRef = useRef(null)
  const opener = useRef(null)
  // Latest onClose without re-running the open effect (which would steal focus) on every render
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const titleId = useId()

  // Mount → slide in; slide out → unmount after the transition
  useEffect(() => {
    if (open) {
      opener.current = document.activeElement
      setMounted(true)
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
      return () => cancelAnimationFrame(raf)
    }
    setShown(false)
    opener.current?.focus?.()
    const t = setTimeout(() => setMounted(false), prefersReducedMotion() ? 0 : 500)
    return () => clearTimeout(t)
  }, [open])

  // While open: Esc closes, Tab stays inside, page doesn't scroll behind
  useEffect(() => {
    if (!open || !mounted) return
    panelRef.current?.querySelector('[data-drawer-close]')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onCloseRef.current()
      if (e.key !== 'Tab') return
      const items = [...panelRef.current.querySelectorAll(FOCUSABLE)]
      if (!items.length) return
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      root.style.overflow = prevOverflow
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
            Close ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <h2 id={titleId} className="sr-only">{title}</h2>
          {children}
        </div>
        {footer && <div className="border-t border-ink">{footer}</div>}
      </aside>
    </div>,
    document.body
  )
}

export default Drawer
