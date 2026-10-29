'use client'

import { useMemo, useRef, useState } from 'react'

import FilterBar from '@/components/ui/FilterBar'
import Pagination from '@/components/ui/Pagination'
import { usePagedQuery } from '@/hooks/usePagedQuery'
import { useQueryParams } from '@/hooks/useQueryParams'
import type { Post } from '@/lib/content'
import { hasValue, topFacets } from '@/lib/facets'
import { formatMonth } from '@/lib/format'
import PostBento from './PostBento'

const BENTO_SIZE = 4
const PAGE_SIZE = 8

const matchesText = (p: Post, q: string) => !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)

/**
 * Latest posts as a bento, the rest as a paginated archive.
 * The bento only shows on page 1 with no filters: "latest" means nothing for a filtered set,
 * so filtering puts every match in the archive list instead.
 * Tag and page live in the URL (?tag=python&page=2); the search text stays local.
 */
export default function WritingBrowser({ posts }: { posts: Post[] }) {
  const listTop = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [params, update] = useQueryParams()
  const tag = params.get('tag')
  const q = query.trim().toLowerCase()
  const filtering = Boolean(tag || q)

  const tags = useMemo(() => topFacets(posts, (p) => p.tags), [posts])
  const archive = useMemo(
    () => (filtering ? posts.filter((p) => (!tag || hasValue(p.tags, tag)) && matchesText(p, q)) : posts.slice(BENTO_SIZE)),
    [posts, tag, q, filtering]
  )
  const { page, pageCount, visible, goTo } = usePagedQuery(archive, PAGE_SIZE)
  const showBento = !filtering && page === 1

  const changePage = (p: number) => {
    goTo(p)
    listTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const clearFilters = () => {
    setQuery('')
    update({ tag: null, page: null })
  }

  return (
    <>
      <FilterBar
        label="Search articles"
        query={query}
        onQuery={(value) => {
          setQuery(value)
          if (page > 1) update({ page: null })
        }}
        placeholder="Search articles…"
        options={tags}
        selected={tag}
        onSelect={(value) => update({ tag: value, page: null })}
      />

      {showBento && (
        <div className="mt-6">
          <PostBento posts={posts.slice(0, BENTO_SIZE)} />
        </div>
      )}

      <div ref={listTop} className="scroll-mt-24 pt-12">
        <div className="flex items-baseline justify-between gap-4">
          <div className="ss-label">{filtering ? '[ results ]' : '[ archive ]'}</div>
          <p className="font-jet text-[11px] uppercase tracking-[.14em] text-ash" aria-live="polite">
            {archive.length} article{archive.length === 1 ? '' : 's'}
            {tag ? ` tagged "${tag}"` : ''}
          </p>
        </div>

        {archive.length === 0 ? (
          <div className="mt-6 border border-dashed border-ink p-12 text-center">
            <p className="ss-display ss-cond text-3xl">Nothing matches that.</p>
            <button type="button" onClick={clearFilters} className="mt-4 font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <ol className="mt-4 border-t border-ink">
            {visible.map((p) => (
              <li key={p.slug} data-reveal="up">
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="ss-wipe grid items-center gap-3 border-b border-ink/15 px-2 py-5 md:grid-cols-12">
                  <span className="ss-dim font-jet text-[11px] uppercase tracking-[.12em] md:col-span-2">{formatMonth(p.published)}</span>
                  <span className="md:col-span-7">
                    <span className="ss-display ss-cond block text-2xl leading-tight">{p.title}</span>
                    <span className="ss-dim mt-1 block text-sm">{p.description}</span>
                  </span>
                  <span className="ss-dim hidden font-jet text-[10px] uppercase tracking-[.08em] md:col-span-2 md:block">{p.tags.slice(0, 2).join(' · ')}</span>
                  <span className="hidden text-right font-jet text-primary md:col-span-1 md:block">
                    <span className="ss-arrow">↗</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        )}

        <Pagination page={page} pageCount={pageCount} total={archive.length} pageSize={PAGE_SIZE} onChange={changePage} noun="articles" />
      </div>
    </>
  )
}
