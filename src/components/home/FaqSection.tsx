import Link from 'next/link'

import Accordion from '@/components/ui/Accordion'
import { TripleArrow } from '@/components/ui/Decor'
import SectionHeading, { Bar } from '@/components/ui/SectionHeading'
import type { FaqItem } from '@/lib/content'
import { faqToItems } from '@/lib/faq'
import { routes } from '@/lib/routes'

export default function FaqSection({ questions }: { questions: FaqItem[] }) {
  return (
    <section id="faq" data-section="06 / questions" className="scroll-mt-16 border-b border-ink bg-paper">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-12 px-5 py-20 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading label="[ 06 / questions ]">
            Before you <Bar>ask.</Bar>
          </SectionHeading>
          <p className="mt-6 max-w-sm text-ash" data-reveal="up">
            The things people usually want to know before we start.
          </p>
          <Link href={routes.servicesFaq} className="ss-chev-btn mt-6 inline-block font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline" data-reveal="up">
            All questions <TripleArrow />
          </Link>
        </div>
        <div className="lg:col-span-8">
          <Accordion items={faqToItems(questions)} initialOpen={0} numbered />
        </div>
      </div>
    </section>
  )
}
