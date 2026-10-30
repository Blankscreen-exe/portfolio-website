'use client'

import { useEffect, useRef } from 'react'

import SectionHeading, { Bar } from '@/components/ui/SectionHeading'
import type { Home } from '@/lib/content'
import { pad } from '@/lib/format'

type Props = { steps: Home['process']; label?: string; section?: string }

/** "Three steps." The cyan connector above the steps fills as the section scrolls through view. */
export default function Process({ steps, label = '[ 04 / how it works ]', section = '04 / how it works' }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const r = sectionRef.current?.getBoundingClientRect()
      if (!r) return
      const progress = Math.min(Math.max((window.innerHeight * 0.85 - r.top) / (r.height * 0.9), 0), 1)
      lineRef.current?.style.setProperty('--p', String(progress))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={sectionRef} id="process" data-section={section} className="border-b border-ink">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <SectionHeading label={label}>
          {steps.length === 3 ? 'Three' : steps.length} <Bar>steps.</Bar>
        </SectionHeading>

        <div className="relative mt-12">
          <div className="absolute -top-3 left-0 right-0 hidden h-[3px] bg-ink/15 md:block" aria-hidden="true">
            <div ref={lineRef} className="ss-progress h-full bg-primary" />
          </div>
          <ol className="grid grid-cols-1 gap-px border border-ink bg-ink md:grid-cols-3" data-reveal="rows">
            {steps.map((s, i) => (
              <li key={s.title} className="bg-paper p-7">
                <div className="ss-display text-6xl text-primary">{pad(i + 1)}</div>
                <h3 className="ss-display ss-cond mt-6 text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-ash">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
