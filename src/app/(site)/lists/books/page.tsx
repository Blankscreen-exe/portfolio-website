import type { Metadata } from 'next'

import { BooksBrowser } from '@/components/lists/ShelfBrowsers'
import PageHero from '@/components/ui/PageHero'
import { Bar } from '@/components/ui/SectionHeading'
import { getBooks } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Books',
  description: 'Technical books on software development, security, networking, Linux, machine learning and AI.',
}

export default async function BooksPage() {
  const books = await getBooks()
  return (
    <>
      <PageHero
        label="[ shelf / books ]"
        section="books"
        intro="Technical books covering software development, cybersecurity, networking, Linux, machine learning and AI: essential reading for understanding modern engineering practice."
      >
        On my <Bar>shelf.</Bar>
      </PageHero>
      <section className="border-b border-ink" data-section="books">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <BooksBrowser books={books} />
        </div>
      </section>
    </>
  )
}
