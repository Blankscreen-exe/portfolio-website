import type { Metadata } from 'next'

import SketchBrowser from '@/components/sketches/SketchBrowser'
import CtaBand from '@/components/ui/CtaBand'
import PageHero from '@/components/ui/PageHero'
import { Bar } from '@/components/ui/SectionHeading'
import { getSketches } from '@/lib/content'

const intro = "I never went to art school. I taught myself to draw, and these are the realistic faces of famous characters, scenery and OCs I've sketched along the way."

export const metadata: Metadata = {
  title: 'Sketches',
  description: intro,
}

export default async function SketchesPage() {
  const sketches = await getSketches()

  return (
    <>
      <PageHero label="[ off the clock / sketches ]" section="sketches" intro={intro}>
        Off the <Bar>clock.</Bar>
      </PageHero>

      <section className="border-b border-ink" data-section="drawings">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <SketchBrowser sketches={sketches} />
        </div>
      </section>

      <CtaBand
        title={
          <>
            Want to see <Bar>more?</Bar>
          </>
        }
        text="Get in touch if you'd like to see more of my drawings."
        action="Get in touch"
      />
    </>
  )
}
