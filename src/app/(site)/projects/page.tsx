import type { Metadata } from 'next'

import CtaBand from '@/components/ui/CtaBand'
import PageHero from '@/components/ui/PageHero'
import { Bar } from '@/components/ui/SectionHeading'
import WorkBrowser from '@/components/work/WorkBrowser'
import { getProjects } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Work',
  description: "Products, platforms and tools I've built for clients, plus the side projects I build to try new ideas.",
}

export default async function WorkPage() {
  const projects = await getProjects()

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
          <WorkBrowser projects={projects} />
        </div>
      </section>

      <CtaBand
        title={
          <>
            Need something <Bar>like this?</Bar>
          </>
        }
      />
    </>
  )
}
