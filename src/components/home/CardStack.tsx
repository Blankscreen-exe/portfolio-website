'use client'

import Link from 'next/link'
import { type KeyboardEvent, type MouseEvent, useEffect, useRef, useState } from 'react'

import { ArrowUpRight, RotateArrow } from '@/components/ui/Decor'
import ProfilePhoto from '@/components/ui/ProfilePhoto'
import { prefersReducedMotion } from '@/hooks/useOnceVisible'
import type { Home } from '@/lib/content'
import { routes } from '@/lib/routes'
import { stagger } from '@/lib/style'

const CARD_NAMES = ['Who I am', "Industries I've built for", 'Why work with me']
const BARCODE: [number, number][] = [[0, 2], [4, 1], [7, 4], [13, 1], [16, 2], [21, 1], [24, 5], [31, 1], [34, 2], [38, 4], [44, 1], [47, 2], [51, 1], [54, 5], [61, 1], [63, 1]]

type Props = Pick<Home, 'industries' | 'whyMe'> & { delivered?: { value: string; label: string }; role: string }

/**
 * Hero profile cards. Click / tap / Enter / Space sends the front card to the back:
 * it flies out (.fly), then takes the back slot while the others move forward.
 */
export default function CardStack({ industries, whyMe, delivered, role }: Props) {
  // order[0] is the card in front; values are card indexes
  const [order, setOrder] = useState([0, 1, 2])
  const [flying, setFlying] = useState<number | null>(null)
  const [turns, setTurns] = useState(0)
  const busy = useRef(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const shuffle = () => {
    if (busy.current) return
    busy.current = true
    setTurns((t) => t + 1)
    const reduced = prefersReducedMotion()
    const settle = () => {
      setFlying(null)
      setOrder((o) => [...o.slice(1), o[0]])
      timers.current.push(setTimeout(() => (busy.current = false), reduced ? 0 : 450))
    }
    if (reduced) return settle()
    setFlying(order[0])
    timers.current.push(setTimeout(settle, 380))
  }

  const onClick = (e: MouseEvent) => {
    if (!(e.target as Element).closest('a')) shuffle()
  }
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      shuffle()
    }
  }

  const front = order[0]
  const cardProps = (index: number, extra: string) => {
    const pos = order.indexOf(index)
    return { className: `ss-card ${extra} ${flying === index ? 'fly' : ''}`, 'data-pos': pos, 'aria-hidden': pos !== 0 }
  }
  const [title, ...subtitle] = role.split(' & ')

  return (
    <div className="mx-auto w-full max-w-[360px] self-end lg:col-span-4 lg:mx-0 lg:max-w-none" data-reveal="up" style={stagger(3)}>
      <div className="ss-stack" role="button" tabIndex={0} aria-label="Profile cards. Press to show the next card." onClick={onClick} onKeyDown={onKeyDown}>
        {/* 01 — Who */}
        <article {...cardProps(0, 'border border-ink bg-paper p-3')}>
          <div className="mb-2 flex justify-between font-jet text-[10px] uppercase tracking-widest text-ash">
            <span>ID card</span>
            <span>01/03</span>
          </div>
          <ProfilePhoto eager />
          <div className="ss-display ss-cond mt-4 text-[34px] leading-none">{title}</div>
          {subtitle.length > 0 && <div className="mt-1 font-jet text-xs text-ash">&amp; {subtitle.join(' & ')}</div>}
          <div className="mt-3 flex items-center justify-between border-t border-ink/15 pt-3">
            <span className="flex items-center gap-2 font-jet text-[11px] uppercase tracking-widest">
              <span className="ss-blink inline-block h-2 w-2 bg-primary" />
              Available for work
            </span>
            <svg className="h-4 w-16 opacity-80" viewBox="0 0 64 16" fill="currentColor" aria-hidden="true">
              {BARCODE.map(([x, w]) => (
                <rect key={x} x={x} width={w} height={16} />
              ))}
            </svg>
          </div>
        </article>

        {/* 02 — Industries */}
        <article {...cardProps(1, 'flex flex-col border border-ink bg-paper')}>
          <div className="flex justify-between border-b border-ink bg-primary px-4 py-2.5 font-jet text-[10px] font-bold uppercase tracking-widest text-onprimary">
            <span>[ Industries I&apos;ve built for ]</span>
            <span>02/03</span>
          </div>
          <ul className="flex-1 px-4">
            {industries.map((item, i) => (
              <li key={item.name} className={`flex items-baseline justify-between gap-3 py-3 ${i < industries.length - 1 ? 'border-b border-ink/15' : ''}`}>
                <span className="ss-display ss-cond text-xl">{item.name}</span>
                <span className="text-right font-jet text-[11px] text-ash">{item.built}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-ink px-4 py-3">
            {delivered && (
              <span className="ss-display text-2xl">
                {delivered.value} <span className="font-jet text-[11px] font-normal normal-case tracking-normal text-ash">systems delivered</span>
              </span>
            )}
            <Link href={routes.work} tabIndex={front === 1 ? 0 : -1} className="font-jet text-[11px] font-bold uppercase tracking-widest text-primary hover:underline">
              See work <ArrowUpRight />
            </Link>
          </div>
        </article>

        {/* 03 — Why work with me */}
        <article {...cardProps(2, 'flex flex-col border border-ink bg-paper')}>
          <div className="flex justify-between bg-ink px-4 py-2.5 font-jet text-[10px] font-bold uppercase tracking-widest text-stock">
            <span>[ Why work with me ]</span>
            <span>03/03</span>
          </div>
          <ul className="flex-1 space-y-4 px-4 py-5">
            {whyMe.map((item) => (
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

      <div className="mt-9 flex items-center justify-between font-jet text-[11px] uppercase tracking-widest text-ash">
        <span className="flex items-center gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <i key={i} className="inline-block h-1.5 transition-all duration-500" style={{ width: front === i ? 20 : 6, backgroundColor: front === i ? 'rgb(var(--color-primary))' : 'rgb(var(--ss-ash))' }} />
          ))}
        </span>
        <span>
          <span className="hidden sm:inline">Click</span>
          <span className="sm:hidden">Tap</span> to shuffle{' '}
          <span className="inline-block transition-transform duration-700" style={{ transform: `rotate(${turns * 360}deg)` }}>
            <RotateArrow />
          </span>
        </span>
      </div>
      <p className="sr-only" aria-live="polite">
        {`Showing ${CARD_NAMES[front]}, card ${front + 1} of 3`}
      </p>
    </div>
  )
}
