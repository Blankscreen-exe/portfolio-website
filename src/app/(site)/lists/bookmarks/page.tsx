import type { Metadata } from 'next'

import { BookmarksBrowser } from '@/components/lists/ShelfBrowsers'
import PageHero from '@/components/ui/PageHero'
import { Bar } from '@/components/ui/SectionHeading'
import { getBookmarks } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Bookmarks',
  description: 'Tools, docs, APIs and resources I keep coming back to.',
}

export default async function BookmarksPage() {
  const bookmarks = await getBookmarks()
  // Featured bookmarks first
  const ordered = [...bookmarks].sort((a, b) => Number(b.featured) - Number(a.featured))
  return (
    <>
      <PageHero label="[ shelf / bookmarks ]" section="bookmarks" intro="Tools, docs, APIs and resources I keep coming back to. Starred ones are my favourites.">
        Worth <Bar>saving.</Bar>
      </PageHero>
      <section className="border-b border-ink" data-section="bookmarks">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <BookmarksBrowser bookmarks={ordered} />
        </div>
      </section>
    </>
  )
}
