'use client'

import { ArrowLeft, ArrowRight } from '@/components/ui/Decor'
import { pad } from '@/lib/format'
import { pageWindow } from '@/lib/pagination'

type Props = {
  page: number
  pageCount: number
  total: number
  pageSize: number
  onChange: (page: number) => void
  /** e.g. "articles" → "Showing 9–16 of 23 articles" */
  noun?: string
}

const cell = 'grid min-w-11 place-items-center border-r border-ink px-3 py-3 font-jet text-xs uppercase tracking-[.12em] transition-colors'

/** `[ ← ][ 01 ][ 02 ] … [ 09 ][ → ]` with a "showing x–y of z" readout. Renders nothing for a single page. */
export default function Pagination({ page, pageCount, total, pageSize, onChange, noun = 'items' }: Props) {
  if (pageCount <= 1) return null
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex border-y border-l border-ink bg-paper">
        <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1} className={`${cell} hover:bg-ink hover:text-stock disabled:pointer-events-none disabled:opacity-30`} aria-label="Previous page">
          <ArrowLeft className="!h-4 !w-4" />
        </button>
        {pageWindow(page, pageCount).map((p, i) =>
          p === null ? (
            <span key={`gap-${i}`} className={`${cell} text-ash`} aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-current={p === page ? 'page' : undefined}
              aria-label={`Page ${p}`}
              className={`${cell} ${p === page ? 'bg-primary text-onprimary' : 'hover:bg-stock'}`}
            >
              {pad(p)}
            </button>
          )
        )}
        <button type="button" onClick={() => onChange(page + 1)} disabled={page === pageCount} className={`${cell} hover:bg-primary hover:text-onprimary disabled:pointer-events-none disabled:opacity-30`} aria-label="Next page">
          <ArrowRight className="!h-4 !w-4" />
        </button>
      </div>
      <p className="font-jet text-[11px] uppercase tracking-[.14em] text-ash">
        Showing {from}–{to} of {total} {noun}
      </p>
    </nav>
  )
}
