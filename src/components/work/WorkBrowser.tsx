'use client'

import { useMemo, useState } from 'react'

import { useQueryParams } from '@/hooks/useQueryParams'
import type { Project } from '@/lib/content'
import { matchesQuery } from '@/lib/projects'
import WorkCard from './WorkCard'

const TABS = [
  { key: 'client', label: 'Client work', test: (p: Project) => p.kind === 'client' },
  { key: 'side', label: 'Side projects', test: (p: Project) => p.kind === 'side' },
  { key: 'all', label: 'Everything', test: () => true },
] as const

/** Tabs (kept in the URL as ?show=) + free-text search over the project grid. */
export default function WorkBrowser({ projects }: { projects: Project[] }) {
  const [params, update] = useQueryParams()
  const tab = TABS.find((t) => t.key === params.get('show')) ?? TABS[0]
  const [query, setQuery] = useState('')

  const results = useMemo(() => projects.filter(tab.test).filter((p) => matchesQuery(p, query)), [projects, tab, query])

  return (
    <>
      <div className="flex flex-col border border-ink bg-paper md:flex-row md:items-stretch" data-reveal="up">
        <div className="flex overflow-x-auto" role="tablist" aria-label="Filter projects">
          {TABS.map((t) => {
            const active = t.key === tab.key
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => update({ show: t.key === 'client' ? null : t.key })}
                className={`whitespace-nowrap border-r border-ink px-5 py-4 font-jet text-xs uppercase tracking-[.14em] transition-colors ${active ? 'bg-primary text-onprimary' : 'hover:bg-stock'}`}
              >
                {t.label} <span className="opacity-60">({projects.filter(t.test).length})</span>
              </button>
            )
          })}
        </div>
        <label className="flex flex-1 items-center gap-3 border-t border-ink px-5 py-3 md:border-t-0">
          <span className="font-jet text-xs text-ash" aria-hidden="true">
            ⌕
          </span>
          <span className="sr-only">Search projects</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, industry or tech…"
            className="w-full border-0 bg-transparent p-0 font-inter text-sm outline-none placeholder:text-ash/70"
          />
        </label>
      </div>

      <p className="mt-4 font-jet text-[11px] uppercase tracking-[.14em] text-ash" aria-live="polite">
        {results.length} project{results.length === 1 ? '' : 's'}
      </p>

      {results.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p, i) => (
            <WorkCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="mt-6 border border-dashed border-ink p-12 text-center">
          <p className="ss-display ss-cond text-3xl">Nothing matches that.</p>
          <button type="button" onClick={() => setQuery('')} className="mt-4 font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline">
            Clear search
          </button>
        </div>
      )}
    </>
  )
}
