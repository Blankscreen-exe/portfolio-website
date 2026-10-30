'use client'

// Thin wrappers that give ListBrowser its render functions (functions can't be passed
// from a server page to a client component, so they're defined here on the client side).

import { ArrowUpRight } from '@/components/ui/Decor'
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
        <div className="grid grid-cols-1 gap-2 px-2 py-4 md:grid-cols-12 md:items-baseline">
          <span className="ss-display ss-cond text-2xl leading-tight md:col-span-6">{b.title}</span>
          <span className="text-ash md:col-span-3">{b.author}</span>
          <span className="font-jet text-[10px] uppercase tracking-[.08em] text-ash md:col-span-3 md:text-right">{b.tags.join(' · ')}</span>
        </div>
      )}
    />
  )
}

const bookmarkText = (b: Bookmark) => `${b.title} ${b.description} ${b.provider} ${b.category} ${b.tags.join(' ')}`
const bookmarkCategory = (b: Bookmark) => (b.category ? [b.category] : [])
// Courses often have no write-up, just a provider
const bookmarkBlurb = (b: Bookmark) => b.description || (b.provider ? `A ${b.category === 'learning' ? 'course' : 'resource'} from ${b.provider}.` : '')

export function BookmarksBrowser({ bookmarks }: { bookmarks: readonly Bookmark[] }) {
  return (
    <ListBrowser
      items={bookmarks}
      searchText={bookmarkText}
      facetValues={bookmarkCategory}
      getKey={(b) => b.url ?? b.title}
      noun="bookmarks"
      placeholder="Search tools, docs, courses…"
      renderItem={(b) => (
        <a href={b.url ?? undefined} target="_blank" rel="noopener noreferrer" className="ss-wipe grid grid-cols-1 gap-2 px-2 py-4 md:grid-cols-12 md:items-baseline">
          <span className="md:col-span-4">
            <span className="ss-display ss-cond block text-2xl leading-tight">
              {b.title}
              {b.featured && (
                <span className="ml-2 align-middle font-jet text-[10px] text-primary" aria-label="Favourite">
                  ★
                </span>
              )}
            </span>
            {b.provider && <span className="ss-dim mt-1 block font-jet text-[10px] uppercase tracking-[.1em]">{b.provider}</span>}
          </span>
          <span className="ss-dim line-clamp-3 text-sm md:col-span-6">{bookmarkBlurb(b)}</span>
          <span className="ss-dim font-jet text-[10px] uppercase tracking-[.08em] md:col-span-2 md:text-right">
            {b.category} <ArrowUpRight className="ss-arrow text-primary" />
          </span>
        </a>
      )}
    />
  )
}
