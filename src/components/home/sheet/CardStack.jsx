import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import appConstants from '../../../constants/appConstants'
import homeContent from '../../../data/homeContent.json'
import metrics from '../../../data/metrics.json'
import { prefersReducedMotion } from '../../../helpers/sheetMotion'

// "20+ Production Systems Delivered"
const delivered = metrics[0]

const CARD_NAMES = ['Who I am', "Industries I've built for", 'Why work with me']

function MiniBarcode() {
  const xs = [[0, 2], [4, 1], [7, 4], [13, 1], [16, 2], [21, 1], [24, 5], [31, 1], [34, 2], [38, 4], [44, 1], [47, 2], [51, 1], [54, 5], [61, 1], [63, 1]]
  return (
    <svg className="h-4 w-16 opacity-80" viewBox="0 0 64 16" fill="currentColor" aria-hidden="true">
      {xs.map(([x, w]) => <rect key={x} x={x} width={w} height={16} />)}
    </svg>
  )
}

/**
 * Hero profile cards. Clicking / tapping / Enter / Space sends the front card to the back:
 * it flies out (.fly), then takes the back slot while the others move forward.
 */
function CardStack() {
  // order[0] is the card in front; values are card indexes
  const [order, setOrder] = useState([0, 1, 2])
  const [flying, setFlying] = useState(null)
  const [turns, setTurns] = useState(0)
  const busy = useRef(false)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const shuffle = () => {
    if (busy.current) return
    busy.current = true
    setTurns((t) => t + 1)
    const settle = () => {
      setFlying(null)
      setOrder((o) => [...o.slice(1), o[0]])
      timers.current.push(setTimeout(() => { busy.current = false }, prefersReducedMotion() ? 0 : 450))
    }
    if (prefersReducedMotion()) return settle()
    setFlying(order[0])
    timers.current.push(setTimeout(settle, 380))
  }

  const onClick = (e) => { if (!e.target.closest('a')) shuffle() }
  const onKeyDown = (e) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); shuffle() }
  }

  const front = order[0]
  const cardProps = (index, extra = '') => {
    const pos = order.indexOf(index)
    return {
      className: `ss-card ${extra} ${flying === index ? 'fly' : ''}`,
      'data-pos': pos,
      'aria-hidden': pos !== 0,
    }
  }
  const tab = (index) => (front === index ? 0 : -1)

  return (
    <div className="mx-auto w-full max-w-[360px] self-end lg:col-span-4 lg:mx-0 lg:max-w-none" data-reveal="up" style={{ '--i': 3 }}>
      <div
        className="ss-stack group"
        role="button"
        tabIndex={0}
        aria-label="Profile cards. Press to show the next card."
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        {/* 01 — Who */}
        <article {...cardProps(0, 'border border-ink bg-paper p-3')}>
          <div className="mb-2 flex justify-between font-jet text-[10px] uppercase tracking-widest text-ash"><span>ID card</span><span>01/03</span></div>
          <div className="ss-shutter" data-reveal="shutter">
            <div className="relative">
              <div className="ss-scan" />
              <img src="/profile_pic.png" alt="M. Hammad Hassan" className="ss-shot aspect-square w-full border border-ink/15 object-cover" />
            </div>
          </div>
          <div className="ss-display ss-cond mt-4 text-[34px] leading-none">Product Engineer</div>
          <div className="mt-1 font-jet text-xs text-ash">&amp; Technical Consultant</div>
          <div className="mt-3 flex items-center justify-between border-t border-ink/15 pt-3">
            <span className="flex items-center gap-2 font-jet text-[11px] uppercase tracking-widest">
              <span className="ss-blink inline-block h-2 w-2 bg-primary" />Available for work
            </span>
            <MiniBarcode />
          </div>
        </article>

        {/* 02 — Industries */}
        <article {...cardProps(1, 'flex flex-col border border-ink bg-paper')}>
          <div className="flex justify-between border-b border-ink bg-primary px-4 py-2.5 font-jet text-[10px] font-bold uppercase tracking-widest text-onprimary">
            <span>[ Industries I&apos;ve built for ]</span><span>02/03</span>
          </div>
          <ul className="flex-1 px-4">
            {homeContent.industries.map((item, i, arr) => (
              <li key={item.name} className={`flex items-baseline justify-between gap-3 py-3 ${i < arr.length - 1 ? 'border-b border-ink/15' : ''}`}>
                <span className="ss-display ss-cond text-xl">{item.name}</span>
                <span className="text-right font-jet text-[11px] text-ash">{item.built}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-ink px-4 py-3">
            <span className="ss-display text-2xl">{delivered.value} <span className="font-jet text-[11px] font-normal normal-case tracking-normal text-ash">systems delivered</span></span>
            <Link to={appConstants.routes.projects} tabIndex={tab(1)} className="font-jet text-[11px] font-bold uppercase tracking-widest text-primary hover:underline">See work ↗</Link>
          </div>
        </article>

        {/* 03 — Why work with me */}
        <article {...cardProps(2, 'flex flex-col border border-ink bg-paper')}>
          <div className="flex justify-between bg-ink px-4 py-2.5 font-jet text-[10px] font-bold uppercase tracking-widest text-stock">
            <span>[ Why work with me ]</span><span>03/03</span>
          </div>
          <ul className="flex-1 space-y-4 px-4 py-5">
            {homeContent.whyMe.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center bg-primary text-[11px] font-bold text-onprimary">✓</span>
                <div>
                  <div className="ss-display ss-cond text-xl leading-none">{item.title}</div>
                  <p className="mt-1 text-[13px] leading-snug text-ash">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-3 border-t border-ink px-4 py-3">
            <span className="ss-stamp-inline">Open to work</span>
            <span className="font-jet text-[11px] text-ash">Contract · Full-time · Consulting</span>
          </div>
        </article>
      </div>

      {/* controls */}
      <div className="mt-9 flex items-center justify-between font-jet text-[11px] uppercase tracking-widest text-ash">
        <span className="flex items-center gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <i key={i} className="inline-block h-1.5 transition-all duration-500" style={{ width: front === i ? 20 : 6, backgroundColor: front === i ? 'rgb(var(--color-primary))' : 'rgb(var(--ss-ash))' }} />
          ))}
        </span>
        <span>
          <span className="hidden sm:inline">Click</span><span className="sm:hidden">Tap</span> to shuffle{' '}
          <span className="inline-block transition-transform duration-700" style={{ transform: `rotate(${turns * 360}deg)` }}>↻</span>
        </span>
      </div>
      <p className="sr-only" aria-live="polite">{`Showing ${CARD_NAMES[front]}, card ${front + 1} of 3`}</p>
    </div>
  )
}

export default CardStack
