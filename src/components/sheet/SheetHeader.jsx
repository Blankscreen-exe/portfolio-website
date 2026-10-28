import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import appConstants from '../../constants/appConstants'
import { toggleThemeAction } from '../../redux/reducers/colorThemeSlice'
import { Scramble, prefersReducedMotion } from '../../helpers/sheetMotion'

const NAV = [
  { name: 'Work', url: appConstants.routes.projects },
  { name: 'Services', url: appConstants.routes.services },
  { name: 'About', url: appConstants.routes.aboutMe },
  { name: 'Writing', url: appConstants.routes.blog },
]

const IDLE_STATUS = 'Taking new projects'

function SheetHeader() {
  const dispatch = useDispatch()
  const location = useLocation()
  // Only a literal `true` is dark (older persisted state may hold a truthy object)
  const isDarkMode = useSelector((state) => state.persistedReducer.isDarkMode === true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [status, setStatus] = useState(IDLE_STATUS)
  const progressRef = useRef(null)
  const curtainRef = useRef(null)

  // Same attribute the rest of the site (and daisyUI) reads for dark mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => setMenuOpen(false), [location.pathname, location.hash])

  // Scroll progress bar + "which section am I in" readout
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      progressRef.current?.style.setProperty('--p', max > 0 ? h.scrollTop / max : 0)

      let current = IDLE_STATUS
      document.querySelectorAll('[data-section]').forEach((s) => {
        if (s.getBoundingClientRect().top < window.innerHeight * 0.4) current = s.dataset.section
      })
      setStatus(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  const toggleTheme = () => {
    const curtain = curtainRef.current
    if (prefersReducedMotion() || !curtain) return dispatch(toggleThemeAction())
    curtain.classList.remove('go')
    void curtain.offsetWidth // restart the animation
    curtain.classList.add('go')
    setTimeout(() => dispatch(toggleThemeAction()), 350)
  }

  const cell = 'flex items-center border-r border-ink/15 px-6 font-jet text-xs uppercase tracking-widest transition-colors hover:bg-paper'

  return (
    <>
      <div ref={curtainRef} className="ss-curtain" aria-hidden="true" />
      <header className="ss-sticky z-40 grid grid-cols-[auto_1fr_auto] border-b border-ink bg-stock transition-colors duration-500">
        <Link to={appConstants.routes.home} className="ss-drop flex items-center gap-3 border-r border-ink px-4 py-3.5 sm:px-5" style={{ '--i': 0 }}>
          <span className="grid h-7 w-7 place-items-center bg-primary font-jet text-[11px] font-bold text-onprimary">MH</span>
          <span className="ss-display ss-cond text-xl">Hammad Hassan</span>
        </Link>

        <nav className="hidden items-stretch md:flex" aria-label="Main">
          {NAV.map((item, i) => (
            <NavLink
              key={item.name}
              to={item.url}
              className={({ isActive }) => `ss-drop ${cell} ${isActive ? 'bg-paper text-primary' : ''}`}
              style={{ '--i': i + 1 }}
            >
              {item.name}
            </NavLink>
          ))}
          <span className="ss-drop ml-auto hidden items-center gap-2 border-l border-ink/15 px-5 font-jet text-[11px] uppercase tracking-widest text-ash lg:flex" style={{ '--i': 5 }}>
            <span className="ss-blink inline-block h-2 w-2 bg-primary" />
            <Scramble text={status} />
          </span>
        </nav>

        <div className="col-start-3 flex items-stretch">
          <button
            type="button"
            onClick={toggleTheme}
            className="ss-drop border-l border-ink px-4 font-jet text-sm transition-colors hover:bg-paper"
            style={{ '--i': 6 }}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            ◐
          </button>
          <Link
            to={appConstants.routes.contacts}
            className="ss-drop ss-chev-btn hidden items-center gap-1 bg-ink px-5 font-jet text-xs font-bold uppercase tracking-widest text-stock transition-opacity hover:opacity-90 sm:flex"
            style={{ '--i': 7 }}
          >
            Start a project <span className="ss-chev">↗</span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="ss-drop border-l border-ink px-4 font-jet text-[11px] uppercase tracking-widest md:hidden"
            style={{ '--i': 8 }}
            aria-expanded={menuOpen}
            aria-controls="ss-mobile-menu"
          >
            {menuOpen ? '[ close ]' : '[ menu ]'}
          </button>
        </div>

        {/* scroll progress */}
        <div ref={progressRef} className="ss-progress absolute -bottom-[2px] left-0 right-0 h-[3px] bg-primary" aria-hidden="true" />

        {menuOpen && (
          <nav id="ss-mobile-menu" className="col-span-3 border-t border-ink bg-stock md:hidden" aria-label="Main">
            {NAV.map((item) => (
              <NavLink
                key={item.name}
                to={item.url}
                className={({ isActive }) => `ss-display ss-cond flex justify-between border-b border-ink/15 px-5 py-4 text-3xl ${isActive ? 'text-primary' : ''}`}
              >
                {item.name} <span className="font-jet text-base">↗</span>
              </NavLink>
            ))}
            <Link
              to={appConstants.routes.contacts}
              className="block bg-primary px-5 py-4 font-jet text-xs font-bold uppercase tracking-widest text-onprimary"
            >
              Start a project ↗
            </Link>
          </nav>
        )}
      </header>
    </>
  )
}

export default SheetHeader
