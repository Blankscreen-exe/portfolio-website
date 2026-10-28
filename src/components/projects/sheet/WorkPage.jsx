import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import projectList from '../../../data/projectList.json'
import { isClientWork } from '../../../helpers/projects'
import PageHero from '../../sheet/PageHero'
import { Bar } from '../../sheet/SectionHeading'
import CtaBand from '../../sheet/CtaBand'
import WorkCard from './WorkCard'

const TABS = [
  { key: 'client', label: 'Client work', test: isClientWork },
  { key: 'side', label: 'Side projects', test: (p) => !isClientWork(p) },
  { key: 'all', label: 'Everything', test: () => true },
]

// Featured first, then the original order
const ordered = [...projectList].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))

function WorkPage() {
  // Tab lives in the URL (?show=side) so it survives back-navigation from a project page
  const [params, setParams] = useSearchParams()
  const tab = TABS.find((t) => t.key === params.get('show')) || TABS[0]
  const [search, setSearch] = useState('')

  const results = useMemo(() => {
    const q = search.trim().toLowerCase()
    return ordered.filter(tab.test).filter((p) =>
      !q ||
      (p.title || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(q))
    )
  }, [tab, search])

  const setTab = (key) => setParams(key === 'client' ? {} : { show: key }, { replace: true })

  return (
    <>
      <PageHero
        label="[ work ]"
        section="work"
        intro="Products, platforms and tools I've built for clients, plus the side projects I build to try new ideas. Open any project for the full story."
      >
        Things I&apos;ve <Bar>built.</Bar>
      </PageHero>

      <section className="border-b border-ink" data-section="projects">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          {/* Controls */}
          <div className="flex flex-col gap-4 border border-ink bg-paper md:flex-row md:items-stretch" data-reveal="up">
            <div className="flex overflow-x-auto" role="tablist" aria-label="Filter projects">
              {TABS.map((t) => {
                const count = ordered.filter(t.test).length
                const active = t.key === tab.key
                return (
                  <button
                    key={t.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTab(t.key)}
                    className={`whitespace-nowrap border-r border-ink px-5 py-4 font-jet text-xs uppercase tracking-[.14em] transition-colors ${active ? 'bg-primary text-onprimary' : 'hover:bg-stock'}`}
                  >
                    {t.label} <span className="opacity-60">({count})</span>
                  </button>
                )
              })}
            </div>
            <label className="flex flex-1 items-center gap-3 border-t border-ink px-5 py-3 md:border-t-0">
              <span className="font-jet text-xs text-ash">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, industry or tech…"
                className="w-full border-0 bg-transparent p-0 font-inter text-sm outline-none placeholder:text-ash/70 focus:ring-0"
              />
            </label>
          </div>

          <p className="mt-4 font-jet text-[11px] uppercase tracking-[.14em] text-ash" aria-live="polite">
            {results.length} project{results.length === 1 ? '' : 's'}
          </p>

          {results.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p, i) => <WorkCard key={p.title} project={p} index={i} />)}
            </div>
          ) : (
            <div className="mt-6 border border-dashed border-ink p-12 text-center">
              <p className="ss-display ss-cond text-3xl">Nothing matches that.</p>
              <button type="button" onClick={() => setSearch('')} className="mt-4 font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline">Clear search</button>
            </div>
          )}
        </div>
      </section>

      <CtaBand title={<>Need something <Bar>like this?</Bar></>} />
    </>
  )
}

export default WorkPage
