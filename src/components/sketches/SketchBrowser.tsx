'use client'

import Image from 'next/image'
import { useState } from 'react'

import { useQueryParams } from '@/hooks/useQueryParams'
import type { Sketch } from '@/lib/content'
import { sketchCategories } from '@/lib/sketches'
import { stagger } from '@/lib/style'
import SketchViewer from './SketchViewer'

// With only a few drawings, tabs would be more clutter than help
const MIN_FOR_TABS = 10

/** Grid of drawings, optional category tabs (kept in the URL as ?show=) and the full-size viewer. */
export default function SketchBrowser({ sketches }: { sketches: Sketch[] }) {
  const [params, update] = useQueryParams()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (sketches.length === 0) {
    return (
      <div className="border border-dashed border-ink p-12 text-center">
        <p className="ss-display ss-cond text-3xl">Sketches on the way.</p>
        <p className="mt-3 text-ash">I&apos;m still scanning them, so check back soon.</p>
      </div>
    )
  }

  const categories = sketchCategories
    .map((c) => ({ key: c.value as string, label: c.label, count: sketches.filter((s) => s.category === c.value).length }))
    .filter((c) => c.count > 0)
  const showTabs = sketches.length >= MIN_FOR_TABS && categories.length > 1
  const tabs = [{ key: 'all', label: 'Everything', count: sketches.length }, ...categories]
  const tab = (showTabs && tabs.find((t) => t.key === params.get('show'))) || tabs[0]
  const results = tab.key === 'all' ? sketches : sketches.filter((s) => s.category === tab.key)

  return (
    <>
      {showTabs && (
        <div className="mb-6 flex overflow-x-auto border border-ink bg-paper" role="tablist" aria-label="Filter drawings" data-reveal="up">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={t.key === tab.key}
              onClick={() => update({ show: t.key === 'all' ? null : t.key })}
              className={`whitespace-nowrap border-r border-ink px-5 py-4 font-jet text-xs uppercase tracking-[.14em] transition-colors ${t.key === tab.key ? 'bg-primary text-onprimary' : 'hover:bg-stock'}`}
            >
              {t.label} <span className="opacity-60">({t.count})</span>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {results.map((sketch, i) => (
          <button
            key={sketch.slug}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="ss-finder group flex flex-col border border-ink bg-paper text-left"
            data-reveal="up"
            style={stagger(i % 4)}
          >
            {/* object-contain, so a drawing is never cropped whatever its shape */}
            <span className="relative block aspect-[4/5] w-full">
              <Image
                src={sketch.image}
                alt={sketch.alt || sketch.title}
                fill
                loading={i < 4 ? 'eager' : 'lazy'}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-contain p-2"
              />
            </span>
            <span className="flex items-baseline justify-between gap-3 border-t border-ink px-3 py-2.5 font-jet text-[10px] uppercase tracking-[.12em] sm:text-[11px]">
              <span className="truncate transition-colors group-hover:text-primary">{sketch.title}</span>
              {sketch.date && <span className="shrink-0 text-ash">{sketch.date.slice(0, 4)}</span>}
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && <SketchViewer sketches={results} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />}
    </>
  )
}
