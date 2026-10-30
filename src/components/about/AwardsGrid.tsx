'use client'

import Image from 'next/image'
import { useState } from 'react'

import { ArrowUpRight } from '@/components/ui/Decor'
import Drawer from '@/components/ui/Drawer'
import type { Award } from '@/lib/content'
import { formatMonth, pad } from '@/lib/format'
import { stagger } from '@/lib/style'

const kindLabel = (a: Award) => (a.kind === 'workshop' ? 'Workshop' : 'Award')

/** Full details of one award, shown in the right-hand drawer. */
function AwardDetails({ award }: { award: Award }) {
  return (
    <div className="p-6 sm:p-8">
      {award.image && (
        <div className="relative aspect-[16/10] overflow-hidden border border-ink">
          <Image src={award.image} alt={award.title} fill sizes="560px" className="object-cover contrast-[1.05] grayscale" />
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-2 font-jet text-[10px] uppercase tracking-[.15em]">
        <span className="bg-primary px-2 py-0.5 text-onprimary">{kindLabel(award)}</span>
        <span className="border border-ink px-2 py-0.5">{formatMonth(award.date)}</span>
      </div>
      <h3 className="ss-display mt-5 text-4xl leading-[.95]">{award.title}</h3>
      <p className="mt-5 text-lg leading-relaxed text-ash">{award.description}</p>
      {award.links.length > 0 && (
        <div className="mt-8 border-t border-ink">
          {award.links.filter(Boolean).map((href, i) => (
            <a key={href} href={href ?? undefined} target="_blank" rel="noopener noreferrer" className="ss-wipe flex justify-between border-b border-ink/15 px-1 py-4">
              <span className="ss-display ss-cond text-xl">{award.links.length > 1 ? `View post ${i + 1}` : 'View the post'}</span>
              <ArrowUpRight className="ss-arrow text-primary" />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

/** Award cards; each opens a drawer with the full details and previous / next navigation. */
export default function AwardsGrid({ awards }: { awards: readonly Award[] }) {
  const [active, setActive] = useState<number | null>(null)
  // Keep the last award rendered while the drawer slides closed
  const [shown, setShown] = useState<number>(0)
  const open = (i: number) => {
    setShown(i)
    setActive(i)
  }
  const step = (d: number) => open(((active ?? 0) + d + awards.length) % awards.length)
  const award = awards[shown]

  return (
    <>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {awards.map((a, i) => (
          <article key={a.title} className="ss-spot ss-finder group relative flex flex-col border border-ink bg-stock" data-reveal="up" style={stagger(i % 3)}>
            <span className="ss-glow" />
            <div className="relative aspect-[16/9] overflow-hidden border-b border-ink">
              {/* Award photos stay grayscale (only the zoom reacts to hover) */}
              {a.image && <Image src={a.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover contrast-[1.05] grayscale transition-transform duration-500 group-hover:scale-[1.03]" />}
            </div>
            <div className="relative z-[2] flex flex-1 flex-col p-5">
              <div className="flex justify-between font-jet text-[10px] uppercase tracking-[.15em] text-ash">
                <span>
                  {kindLabel(a)} · {formatMonth(a.date)}
                </span>
                <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">details →</span>
              </div>
              <h3 className="ss-display ss-cond mt-3 text-xl leading-tight">{a.title}</h3>
              <p className="mt-2 line-clamp-4 text-sm text-ash">{a.description}</p>
            </div>
            {/* The whole card opens the drawer */}
            <button
              type="button"
              onClick={() => open(i)}
              aria-haspopup="dialog"
              aria-label={`Details: ${a.title}`}
              className="absolute inset-0 z-[3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
          </article>
        ))}
      </div>

      <Drawer
        open={active !== null}
        onClose={() => setActive(null)}
        label={`recognition / ${pad(shown + 1)} of ${pad(awards.length)}`}
        title={award?.title ?? ''}
        footer={
          <div className="grid grid-cols-2">
            <button type="button" onClick={() => step(-1)} className="border-r border-ink px-5 py-4 text-left font-jet text-xs uppercase tracking-[.16em] transition-colors hover:bg-ink hover:text-stock">
              ← Previous
            </button>
            <button type="button" onClick={() => step(1)} className="px-5 py-4 text-right font-jet text-xs uppercase tracking-[.16em] transition-colors hover:bg-primary hover:text-onprimary">
              Next →
            </button>
          </div>
        }
      >
        {award && <AwardDetails key={award.title} award={award} />}
      </Drawer>
    </>
  )
}
