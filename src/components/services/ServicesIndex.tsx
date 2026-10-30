'use client'

import type { MouseEvent } from 'react'

import { CaretLeft } from '@/components/ui/Decor'
import { pad } from '@/lib/format'
import { goToService, serviceId, useActiveService } from './serviceNav'

/** The hero's "[ On this page ]" list. Each entry selects its slide in the carousel below. */
export default function ServicesIndex({ titles }: { titles: string[] }) {
  const active = useActiveService(titles.length)

  const select = (e: MouseEvent, i: number) => {
    e.preventDefault()
    goToService(i)
    document.getElementById('services-carousel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="border border-ink bg-paper" aria-label="Services">
      <div className="border-b border-ink px-4 py-2.5 font-jet text-[10px] font-bold uppercase tracking-widest">[ On this page ]</div>
      <ol data-reveal="rows">
        {titles.map((title, i) => (
          <li key={title}>
            {/* Real anchors, so the list still works before JavaScript loads */}
            <a
              href={`#${serviceId(i)}`}
              onClick={(e) => select(e, i)}
              aria-current={i === active ? 'true' : undefined}
              className={`ss-wipe flex items-baseline gap-3 border-b border-ink/15 px-4 py-2.5 last:border-b-0 ${i === active ? 'bg-primary/15' : ''}`}
            >
              <span className={`font-jet text-[11px] ${i === active ? 'text-primary' : 'ss-dim'}`}>{pad(i + 1)}</span>
              <span className="ss-display ss-cond text-lg">{title}</span>
              {i === active && (
                <span className="ml-auto font-jet text-[10px] text-primary" aria-hidden="true">
                  <CaretLeft />
                </span>
              )}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
