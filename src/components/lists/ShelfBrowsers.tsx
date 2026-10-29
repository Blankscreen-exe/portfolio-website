'use client'

// Thin wrappers that give ListBrowser its render functions (functions can't be passed
// from a server page to a client component, so they're defined here on the client side).

import type { Book, Bookmark } from '@/lib/content'
import ListBrowser from './ListBrowser'

const bookText = (b: Book) => `${b.title} ${b.author} ${b.tags.join(' ')}`
const bookTags = (b: Book) => b.tags

export function BooksBrowser({ books }: { books: readonly Book[] }) {
  return (
    <ListBrowser
      items={books}
      searchText={bookText}
      facetValues={bookTags}
      getKey={(b) => b.title}
      noun="books"
      placeholder="Search by title, author or topic…"
      renderItem={(b) => (
        <div className="grid gap-2 px-2 py-4 md:grid-cols-12 md:items-baseline">
          <span className="ss-display ss-cond text-2xl leading-tight md:col-span-6">{b.title}</span>
          <span className="text-ash md:col-span-3">{b.author}</span>
          <span className="font-jet text-[10px] uppercase tracking-[.08em] text-ash md:col-span-3 md:text-right">{b.tags.join(' · ')}</span>
        </div>
      )}
    />
  )
}

const bookmarkText = (b: Bookmark) => `${b.title} ${b.description} ${b.category} ${b.tags.join(' ')}`
const bookmarkCategory = (b: Bookmark) => (b.category ? [b.category] : [])

export function BookmarksBrowser({ bookmarks }: { bookmarks: readonly Bookmark[] }) {
  return (
    <ListBrowser
      items={bookmarks}
      searchText={bookmarkText}
      facetValues={bookmarkCategory}
      getKey={(b) => b.url ?? b.title}
      noun="bookmarks"
      placeholder="Search tools, docs and resources…"
      renderItem={(b) => (
        <a href={b.url ?? undefined} target="_blank" rel="noopener noreferrer" className="ss-wipe grid gap-2 px-2 py-4 md:grid-cols-12 md:items-baseline">
          <span className="md:col-span-4">
            <span className="ss-display ss-cond block text-2xl leading-tight">
              {b.title}
              {b.featured && <span className="ml-2 align-middle font-jet text-[10px] text-primary">★</span>}
            </span>
          </span>
          <span className="ss-dim text-sm md:col-span-6">{b.description}</span>
          <span className="ss-dim font-jet text-[10px] uppercase tracking-[.08em] md:col-span-2 md:text-right">
            {b.category} <span className="ss-arrow text-primary">↗</span>
          </span>
        </a>
      )}
    />
  )
}
