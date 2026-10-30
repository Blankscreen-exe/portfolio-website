'use client'

import { type KeyboardEvent, type PointerEvent, useEffect, useRef, useState } from 'react'

import Button from '@/components/ui/Button'
import { ArrowLeft, ArrowRight, Pause, Play } from '@/components/ui/Decor'
import { usePageVisible, usePrefersReducedMotion } from '@/hooks/useMediaState'
import type { Service } from '@/lib/content'
import { pad } from '@/lib/format'
import { routes } from '@/lib/routes'
import { fitText } from '@/lib/style'
import { HASH_PATTERN, goToService, useActiveService } from './serviceNav'

const AUTOPLAY_MS = 7000
const SWIPE_PX = 60
const arrow = 'grid place-items-center font-jet text-xl transition-colors hover:bg-primary hover:text-onprimary'

/**
 * One service at a time, sliding horizontally. Arrows sit on both sides (below on small
 * screens); the progress segments, keyboard arrows, swipe and the hero's "On this page"
 * list all move it. The active slide is kept in the URL hash (see serviceNav.ts).
 *
 * Autoplay advances every 7s and loops. It pauses while hovered or focused, off screen,
 * in a background tab, or when the visitor prefers reduced motion; any manual move restarts
 * the countdown, and the pause button stops it altogether.
 */
export default function ServicesCarousel({ services }: { services: readonly Service[] }) {
  const active = useActiveService(services.length)
  const count = services.length
  const go = (i: number) => goToService((i + count) % count) // wraps around, like the autoplay

  // ---- autoplay conditions
  const reducedMotion = usePrefersReducedMotion()
  const pageVisible = usePageVisible()
  const [userChoice, setUserChoice] = useState<boolean | null>(null) // explicit play/pause wins
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)
  const [inView, setInView] = useState(false)
  const autoplay = userChoice ?? !reducedMotion
  const running = autoplay && !hovering && !focused && inView && pageVisible && count > 1

  const sectionRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 })
    if (sectionRef.current) io.observe(sectionRef.current)
    return () => io.disconnect()
  }, [])

  // One timer per slide: a manual move (new `active`) or a pause/resume starts a fresh countdown
  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => goToService((active + 1) % count), AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [running, active, count])

  // Deep links (/services#service-3): slides have no matching ids (the browser would scroll the
  // clipped track sideways to "reveal" one), so bring the carousel into view ourselves.
  useEffect(() => {
    if (HASH_PATTERN.test(window.location.hash)) sectionRef.current?.scrollIntoView({ block: 'start' })
  }, [])

  // ---- input
  const swipeStart = useRef<number | null>(null)
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(active - 1)
    if (e.key === 'ArrowRight') go(active + 1)
  }
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') swipeStart.current = e.clientX
  }
  const onPointerUp = (e: PointerEvent) => {
    if (swipeStart.current === null) return
    const dx = e.clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(dx) > SWIPE_PX) go(active + (dx < 0 ? 1 : -1))
  }

  const current = services[active]

  return (
    <section
      ref={sectionRef}
      id="services-carousel"
      data-section={`${pad(active + 1)} / ${current.title.toLowerCase()}`}
      className="scroll-mt-16 border-b border-ink"
      aria-roledescription="carousel"
      aria-label="Services"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
    >
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        {/* Counter, play/pause, and progress segments (each jumps to its service) */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Announce slide changes only when the visitor is driving, not on every autoplay tick */}
            <span className="ss-label" aria-live={autoplay ? 'off' : 'polite'}>
              [ service {pad(active + 1)} / {pad(count)} ]
            </span>
            <button
              type="button"
              onClick={() => setUserChoice(!autoplay)}
              aria-pressed={!autoplay}
              className="border border-ink/25 px-2.5 py-1 font-jet text-[10px] uppercase tracking-[.14em] transition-colors hover:border-primary hover:text-primary"
            >
              {autoplay ? (
                <>
                  <Pause /> Pause
                </>
              ) : (
                <>
                  <Play /> Play
                </>
              )}
            </button>
          </div>
          <div className="flex gap-1.5">
            {services.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${s.title}`}
                aria-current={i === active ? 'true' : undefined}
                className={`relative h-2 overflow-hidden transition-all duration-500 ${i === active ? 'w-10 bg-primary/25' : 'w-5 bg-ink/20 hover:bg-ink/50'}`}
              >
                {i === active && (
                  // Fills up while the countdown runs; solid when paused
                  <span
                    key={`${active}-${running}`}
                    className={`absolute inset-0 origin-left bg-primary ${running ? 'ss-fill' : ''}`}
                    style={running ? { animationDuration: `${AUTOPLAY_MS}ms` } : undefined}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-[minmax(0,1fr)] border border-ink bg-paper md:grid-cols-[4rem_minmax(0,1fr)_4rem]">
          <button type="button" onClick={() => go(active - 1)} className={`${arrow} hidden border-r border-ink md:grid`} aria-label="Previous service">
            <ArrowLeft />
          </button>

          {/* overflow-clip (not hidden): the track can't be scrolled by focus or anchors, only moved by transform.
              Unlike `hidden`, `clip` doesn't let a grid item shrink below its content, so min-w-0 and the
              minmax(0,1fr) column above are what keep the 7-slide-wide track from widening the grid. */}
          <div className="min-w-0 overflow-clip" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipeStart.current = null)}>
            <div className="flex transition-transform duration-700 ease-[cubic-bezier(.16,.84,.24,1)]" style={{ transform: `translateX(-${active * 100}%)` }}>
              {services.map((s, i) => (
                <div
                  key={s.title}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}: ${s.title}`}
                  aria-hidden={i !== active}
                  inert={i !== active}
                  className="w-full shrink-0"
                >
                  <div className="grid grid-cols-1 gap-10 p-6 sm:p-10 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                      <div className="ss-display text-7xl text-primary">{pad(i + 1)}</div>
                      <div className="ss-fit mt-4">
                        <h2 className="ss-display ss-fit-text" style={fitText(s.title, 'clamp(2.25rem, 6vw, 3rem)')}>
                          {s.title}
                        </h2>
                      </div>
                      <p className="mt-5 text-lg leading-relaxed text-ash">{s.description}</p>
                    </div>

                    <div className="lg:col-span-7">
                      {s.goodFitIf && (
                        <div className="border-l-4 border-primary bg-primary/10 px-5 py-4">
                          <div className="ss-label">Good fit if</div>
                          <p className="mt-1 text-lg">{s.goodFitIf}</p>
                        </div>
                      )}
                      <div className="ss-label mt-8">[ what you get ]</div>
                      <ul className="mt-3 grid grid-cols-1 border-t border-ink sm:grid-cols-2">
                        {s.deliverables.map((d) => (
                          <li key={d} className="flex items-center gap-3 border-b border-ink/15 py-3 pr-4">
                            <span className="h-2 w-2 shrink-0 bg-primary" />
                            {d}
                          </li>
                        ))}
                      </ul>
                      <Button href={routes.contactAbout(s.contactTopic)} variant="ink" attention="scramble" className="mt-8">
                        Talk to me about this
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="button" onClick={() => go(active + 1)} className={`${arrow} hidden border-l border-ink md:grid`} aria-label="Next service">
            <ArrowRight />
          </button>

          {/* Small screens: both arrows under the slide */}
          <div className="grid grid-cols-2 border-t border-ink md:hidden">
            <button type="button" onClick={() => go(active - 1)} className={`${arrow} border-r border-ink py-3`} aria-label="Previous service">
              <ArrowLeft />
            </button>
            <button type="button" onClick={() => go(active + 1)} className={`${arrow} py-3`} aria-label="Next service">
              <ArrowRight />
            </button>
          </div>
        </div>

        {/* What's next, so the visitor knows there's more */}
        <button type="button" onClick={() => go(active + 1)} className="ss-chev-btn mt-4 font-jet text-[11px] uppercase tracking-[.16em] text-ash hover:text-primary">
          Next: {services[(active + 1) % count].title} <ArrowRight className="ss-chev" />
        </button>
      </div>
    </section>
  )
}
