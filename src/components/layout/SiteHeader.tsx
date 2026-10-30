'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'

import Button from '@/components/ui/Button'
import { ArrowUpRight, HalfCircle } from '@/components/ui/Decor'
import Scramble from '@/components/ui/Scramble'
import { prefersReducedMotion } from '@/hooks/useOnceVisible'
import { routes } from '@/lib/routes'
import { stagger } from '@/lib/style'

const NAV = [
  { name: 'Work', href: routes.work },
  { name: 'Services', href: routes.services },
  { name: 'About', href: routes.about },
  { name: 'Writing', href: routes.writing },
]

// The theme lives on <html data-theme> (set before paint by the script in app/layout.tsx).
// Subscribing to that attribute keeps React in sync without a separate state store.
const subscribeTheme = (onChange: () => void) => {
  const mo = new MutationObserver(onChange)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => mo.disconnect()
}
const isDarkNow = () => document.documentElement.dataset.theme === 'dark'

function setTheme(dark: boolean) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  } catch {
    /* private mode: the choice just won't persist */
  }
}

export default function SiteHeader({ name, availability }: { name: string; availability: string }) {
  const pathname = usePathname()
  const isDark = useSyncExternalStore(subscribeTheme, isDarkNow, () => false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [section, setSection] = useState<string | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)

  // In development React remounts the root once and resets <html> to the attributes in JSX,
  // dropping the theme and `js` class the boot script set in app/layout.tsx. Put them back
  // before paint (a no-op in production, where the boot script's values are never cleared).
  useLayoutEffect(() => {
    const root = document.documentElement
    root.classList.add('js')
    try {
      if (localStorage.getItem('theme') === 'dark') root.dataset.theme = 'dark'
    } catch {
      /* storage unavailable: keep the default theme */
    }
  }, [])

  // Scroll progress bar + "which section am I in" readout (sections opt in with data-section)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      progressRef.current?.style.setProperty('--p', String(max > 0 ? h.scrollTop / max : 0))
      let current: string | null = null
      document.querySelectorAll<HTMLElement>('[data-section]').forEach((s) => {
        if (s.getBoundingClientRect().top < window.innerHeight * 0.4) current = s.dataset.section ?? null
      })
      setSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const raf = requestAnimationFrame(onScroll)
    // Sections can rename themselves without a scroll (e.g. the services carousel advancing)
    const relabel = new MutationObserver(onScroll)
    relabel.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['data-section'] })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      relabel.disconnect()
    }
  }, [pathname])

  const toggleTheme = () => {
    const curtain = curtainRef.current
    if (prefersReducedMotion() || !curtain) return setTheme(!isDark)
    curtain.classList.remove('go')
    void curtain.offsetWidth // restart the sweep animation
    curtain.classList.add('go')
    setTimeout(() => setTheme(!isDark), 350) // swap while the curtain covers the page
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  const cell = 'flex items-center border-r border-ink/15 px-6 font-jet text-xs uppercase tracking-widest transition-colors hover:bg-paper'
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <div ref={curtainRef} className="ss-curtain" aria-hidden="true" />
      <header className="sticky top-0 z-40 grid grid-cols-[auto_1fr_auto] border-b border-ink bg-stock transition-colors duration-500">
        <Link href={routes.home} onClick={closeMenu} className="ss-drop flex items-center gap-3 border-r border-ink px-4 py-3.5 sm:px-5" style={stagger(0)}>
          <span className="grid h-7 w-7 place-items-center bg-primary font-jet text-[11px] font-bold text-onprimary max-[374px]:hidden">MH</span>
          <span className="ss-display ss-cond whitespace-nowrap text-xl">{name.replace(/^M\.\s*/, '')}</span>
        </Link>

        <nav className="hidden items-stretch md:flex" aria-label="Main">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`ss-drop ${cell} ${isActive(item.href) ? 'bg-paper text-primary' : ''}`}
              style={stagger(i + 1)}
            >
              {item.name}
            </Link>
          ))}
          <span className="ss-drop ml-auto hidden items-center gap-2 border-l border-ink/15 px-5 font-jet text-[11px] uppercase tracking-widest text-ash lg:flex" style={stagger(5)}>
            <span className={`${section ? 'ss-blink' : 'ss-pulse'} inline-block h-2 w-2 bg-primary`} />
            <Scramble text={section ?? availability} />
          </span>
        </nav>

        <div className="col-start-3 flex items-stretch">
          <button
            type="button"
            onClick={toggleTheme}
            className="ss-drop border-l border-ink px-4 font-jet text-sm transition-colors hover:bg-paper"
            style={stagger(6)}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <HalfCircle />
          </button>
          <Link
            href={routes.contact}
            className="ss-drop ss-chev-btn hidden items-center gap-1 bg-ink px-5 font-jet text-xs font-bold uppercase tracking-widest text-stock transition-opacity hover:opacity-90 sm:flex"
            style={stagger(7)}
          >
            Let&apos;s Talk <ArrowUpRight className="ss-chev" />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="ss-drop whitespace-nowrap border-l border-ink px-4 font-jet text-[11px] uppercase tracking-widest max-[374px]:px-3 md:hidden"
            style={stagger(8)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? '[ close ]' : '[ menu ]'}
          </button>
        </div>

        <div ref={progressRef} className="ss-progress absolute -bottom-[2px] left-0 right-0 h-[3px] bg-primary" aria-hidden="true" />

        {menuOpen && (
          <nav id="mobile-menu" className="col-span-3 border-t border-ink bg-stock md:hidden" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`ss-display ss-cond flex justify-between border-b border-ink/15 px-5 py-4 text-3xl ${isActive(item.href) ? 'text-primary' : ''}`}
              >
                {item.name} <ArrowUpRight className="text-base" />
              </Link>
            ))}
            <Button href={routes.contact} onClick={closeMenu} size="md" attention="scramble" className="w-full text-left">
              Start a project
            </Button>
          </nav>
        )}
      </header>
    </>
  )
}
