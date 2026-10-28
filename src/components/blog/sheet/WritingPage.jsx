import React, { useMemo, useState } from 'react'

import blogList from '../../../data/blogList.json'
import socialLinks from '../../../data/socialLinks.json'
import PageHero from '../../sheet/PageHero'
import { Bar } from '../../sheet/SectionHeading'
import CtaBand from '../../sheet/CtaBand'

const postUrl = (p) => p.mediumUrl || (p.hashnodeUrl !== '#' ? p.hashnodeUrl : null)

// Most used tags first, for the filter row
const TOP_TAGS = Object.entries(
  blogList.flatMap((p) => p.tags || []).reduce((acc, t) => ({ ...acc, [t.toLowerCase()]: (acc[t.toLowerCase()] || 0) + 1 }), {})
).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t]) => t)

function WritingPage() {
  const [tag, setTag] = useState(null)
  const [search, setSearch] = useState('')

  const posts = useMemo(() => {
    const q = search.trim().toLowerCase()
    return blogList.filter((p) =>
      (!tag || (p.tags || []).some((t) => t.toLowerCase() === tag)) &&
      (!q || p.title.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q))
    )
  }, [tag, search])

  const [lead, ...rest] = posts
  const filtering = Boolean(tag || search.trim())

  const elsewhere = (
    <div className="border border-ink bg-paper">
      <div className="border-b border-ink px-4 py-2.5 font-jet text-[10px] font-bold uppercase tracking-widest">[ Read me elsewhere ]</div>
      {[{ n: 'Medium', h: socialLinks.medium }, { n: 'Hashnode', h: socialLinks.hashnode }, { n: 'Dev In Trenches', h: 'https://dev-in-trenches.com' }].map((l) => (
        <a key={l.n} href={l.h} target="_blank" rel="noopener noreferrer" className="ss-wipe flex justify-between border-b border-ink/15 px-4 py-3 last:border-b-0">
          <span className="ss-display ss-cond text-lg">{l.n}</span><span className="ss-arrow font-jet text-primary">↗</span>
        </a>
      ))}
    </div>
  )

  return (
    <>
      <PageHero
        label="[ writing ]"
        section="writing"
        intro="Articles on Python, AI, software design and the lessons I've learned building real products."
        aside={elsewhere}
      >
        Notes from <Bar>the trenches.</Bar>
      </PageHero>

      <section className="border-b border-ink" data-section="articles">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          {/* Filters */}
          <div className="border border-ink bg-paper" data-reveal="up">
            <label className="flex items-center gap-3 border-b border-ink px-5 py-3">
              <span className="font-jet text-xs text-ash">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…"
                className="w-full border-0 bg-transparent p-0 font-inter text-sm outline-none placeholder:text-ash/70 focus:ring-0"
              />
            </label>
            <div className="flex flex-wrap gap-2 px-5 py-3">
              {[null, ...TOP_TAGS].map((t) => (
                <button
                  key={t || 'all'}
                  type="button"
                  aria-pressed={tag === t}
                  onClick={() => setTag(t)}
                  className={`border px-2.5 py-1 font-jet text-[11px] uppercase tracking-[.08em] transition-colors ${tag === t ? 'border-primary bg-primary text-onprimary' : 'border-ink/25 hover:border-primary'}`}
                >
                  {t || 'All'}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-4 font-jet text-[11px] uppercase tracking-[.14em] text-ash" aria-live="polite">
            {posts.length} article{posts.length === 1 ? '' : 's'}
          </p>

          {!lead && (
            <div className="mt-6 border border-dashed border-ink p-12 text-center">
              <p className="ss-display ss-cond text-3xl">Nothing matches that.</p>
              <button type="button" onClick={() => { setTag(null); setSearch('') }} className="mt-4 font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline">Clear filters</button>
            </div>
          )}

          {/* Latest (or best match) */}
          {lead && (
            <a href={postUrl(lead)} target="_blank" rel="noopener noreferrer" className="ss-spot ss-finder group mt-6 grid border border-ink bg-paper md:grid-cols-[1.1fr_1fr]" data-reveal="up">
              <span className="ss-glow" />
              <div className="relative min-h-[220px] overflow-hidden border-b border-ink md:border-b-0 md:border-r">
                {lead.thumbnailUrl && <img src={lead.thumbnailUrl} alt="" loading="lazy" className="ss-shot absolute inset-0 h-full w-full object-cover" />}
              </div>
              <div className="relative z-[2] flex flex-col p-7 sm:p-9">
                <div className="flex justify-between font-jet text-[10px] uppercase tracking-[.15em]">
                  <span className="bg-primary px-2 py-0.5 text-onprimary">{filtering ? 'Top match' : 'Latest'}</span>
                  <span className="text-ash">{lead.publishDate}</span>
                </div>
                <h2 className="ss-display mt-6 text-3xl leading-[.95] sm:text-4xl">{lead.title}</h2>
                <p className="mt-4 text-ash">{lead.description}</p>
                <p className="mt-auto pt-6 font-jet text-[10px] uppercase tracking-[.1em] text-ash">{(lead.tags || []).slice(0, 4).join(' · ')}</p>
                <span className="ss-chev-btn mt-4 font-jet text-[11px] font-bold uppercase tracking-[.2em] text-primary">Read on Medium <span className="ss-chev">↗</span></span>
              </div>
            </a>
          )}

          {/* The rest, as an index */}
          {rest.length > 0 && (
            <ol className="mt-6 border-t border-ink">
              {rest.map((p) => (
                <li key={p.title} data-reveal="up">
                  <a href={postUrl(p)} target="_blank" rel="noopener noreferrer" className="ss-wipe grid items-center gap-3 border-b border-ink/15 px-2 py-5 md:grid-cols-12">
                    <span className="ss-dim font-jet text-[11px] uppercase tracking-[.12em] md:col-span-2">{p.publishDate}</span>
                    <span className="md:col-span-7">
                      <span className="ss-display ss-cond block text-2xl leading-tight">{p.title}</span>
                      <span className="ss-dim mt-1 block text-sm">{p.description}</span>
                    </span>
                    <span className="ss-dim hidden font-jet text-[10px] uppercase tracking-[.08em] md:col-span-2 md:block">{(p.tags || []).slice(0, 2).join(' · ')}</span>
                    <span className="hidden text-right font-jet text-primary md:col-span-1 md:block"><span className="ss-arrow">↗</span></span>
                  </a>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <CtaBand label="[ like what you read? ]" title={<>Let&apos;s build <Bar>something.</Bar></>} />
    </>
  )
}

export default WritingPage
