'use client'

import { type ReactNode, useMemo, useRef, useState } from 'react'

import FilterBar from '@/components/ui/FilterBar'
import Pagination from '@/components/ui/Pagination'
import { usePagedQuery } from '@/hooks/usePagedQuery'
import { useQueryParams } from '@/hooks/useQueryParams'
import { type Facet, hasValue, topFacets } from '@/lib/facets'

type Props<T> = {
  items: readonly T[]
  /** Text the search box matches against */
  searchText: (item: T) => string
  /** Values the filter chips are built from (tags, category…) */
  facetValues: (item: T) => readonly string[]
  renderItem: (item: T) => ReactNode
  getKey: (item: T) => string
  noun: string
  placeholder: string
  pageSize?: number
  facetLimit?: number
}

/**
 * Generic searchable, filterable, paginated list. The facet and page are kept in the URL
 * (?f=security&page=2); the search text is local.
 */
export default function ListBrowser<T>({ items, searchText, facetValues, renderItem, getKey, noun, placeholder, pageSize = 12, facetLimit = 12 }: Props<T>) {
  const listTop = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [params, update] = useQueryParams()
  const facet = params.get('f')
  const q = query.trim().toLowerCase()

  const facets: Facet[] = useMemo(() => topFacets(items, facetValues, facetLimit), [items, facetValues, facetLimit])
  const filtered = useMemo(
    () => items.filter((item) => (!facet || hasValue(facetValues(item), facet)) && (!q || searchText(item).toLowerCase().includes(q))),
    [items, facet, q, facetValues, searchText]
  )
  const { page, pageCount, visible, goTo } = usePagedQuery(filtered, pageSize)

  return (
    <>
      <FilterBar
        label={`Search ${noun}`}
        query={query}
        onQuery={(value) => {
          setQuery(value)
          if (page > 1) update({ page: null })
        }}
        placeholder={placeholder}
        options={facets}
        selected={facet}
        onSelect={(value) => update({ f: value, page: null })}
      />

      <div ref={listTop} className="scroll-mt-24 pt-8">
        <p className="font-jet text-[11px] uppercase tracking-[.14em] text-ash" aria-live="polite">
          {filtered.length} {noun}
          {facet ? ` · ${facet}` : ''}
        </p>
        {filtered.length === 0 ? (
          <div className="mt-6 border border-dashed border-ink p-12 text-center">
            <p className="ss-display ss-cond text-3xl">Nothing matches that.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('')
                update({ f: null, page: null })
              }}
              className="mt-4 font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="mt-4 border-t border-ink">
            {visible.map((item) => (
              <li key={getKey(item)} className="border-b border-ink/15" data-reveal="up">
                {renderItem(item)}
              </li>
            ))}
          </ul>
        )}
        <Pagination
          page={page}
          pageCount={pageCount}
          total={filtered.length}
          pageSize={pageSize}
          noun={noun}
          onChange={(p) => {
            goTo(p)
            listTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        />
      </div>
    </>
  )
}
