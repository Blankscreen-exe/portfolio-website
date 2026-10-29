'use client'

import Image from 'next/image'
import { useState } from 'react'

import SectionHeading, { Bar } from '@/components/ui/SectionHeading'
import type { Testimonial } from '@/lib/content'
import { pad } from '@/lib/format'

export default function Testimonials({ items }: { items: readonly Testimonial[] }) {
  const [index, setIndex] = useState(0)
  if (!items.length) return null
  const t = items[index]
  const go = (step: number) => setIndex((i) => (i + step + items.length) % items.length)

  return (
    <section id="testimonials" data-section="03 / testimonials" className="scroll-mt-16 border-b border-ink">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <SectionHeading label="[ 03 / testimonials ]">
          What people <Bar>say.</Bar>
        </SectionHeading>

        <div className="mt-12 grid border border-ink lg:grid-cols-12" data-reveal="up">
          <figure className="relative flex flex-col justify-between bg-paper p-7 sm:p-10 lg:col-span-8 lg:border-r lg:border-ink">
            <span className="ss-display pointer-events-none absolute right-6 top-2 select-none text-[140px] leading-none text-primary/25" aria-hidden="true">
              &ldquo;
            </span>
            {/* key → the swap animation replays for each quote */}
            <blockquote key={index} className="ss-swap relative text-xl leading-relaxed sm:text-2xl" aria-live="polite">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption key={`by-${index}`} className="ss-swap mt-10 flex items-center gap-4">
              {t.avatar && (
                <span className="relative h-14 w-14 shrink-0 overflow-hidden border border-ink">
                  <Image src={t.avatar} alt="" fill sizes="56px" className="object-cover grayscale" />
                </span>
              )}
              <div>
                <div className="ss-display ss-cond text-2xl">{t.name}</div>
                <div className="font-jet text-[11px] uppercase tracking-[.12em] text-ash">{t.role}</div>
              </div>
            </figcaption>
            <div className="mt-8 flex items-center justify-between border-t border-ink/15 pt-5 font-jet text-xs">
              <span className="text-ash">
                {pad(index + 1)} / {pad(items.length)}
              </span>
              <div className="flex">
                <button type="button" onClick={() => go(-1)} className="border border-ink px-4 py-2 transition-colors hover:bg-ink hover:text-stock" aria-label="Previous testimonial">
                  ←
                </button>
                <button type="button" onClick={() => go(1)} className="-ml-px border border-ink bg-ink px-4 py-2 text-stock transition-colors hover:bg-primary hover:text-onprimary" aria-label="Next testimonial">
                  →
                </button>
              </div>
            </div>
          </figure>

          {/* Index of names (desktop) */}
          <ol className="hidden max-h-[560px] overflow-y-auto lg:col-span-4 lg:block">
            {items.map((item, i) => (
              <li key={item.name}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-current={i === index}
                  className={`flex w-full items-baseline gap-4 border-b border-ink/15 px-5 py-3.5 text-left transition-colors ${i === index ? 'bg-primary text-onprimary' : 'hover:bg-paper'}`}
                >
                  <span className="font-jet text-[11px]">{pad(i + 1)}</span>
                  <span>
                    <span className="block font-semibold">{item.name}</span>
                    <span className={`block font-jet text-[10px] uppercase tracking-[.1em] ${i === index ? '' : 'text-ash'}`}>{item.role}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
