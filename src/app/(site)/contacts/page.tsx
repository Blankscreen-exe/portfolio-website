import type { Metadata } from 'next'

import ContactPanel from '@/components/contact/ContactPanel'
import Accordion from '@/components/ui/Accordion'
import SectionHeading, { Bar } from '@/components/ui/SectionHeading'
import { getFaq, getHome, getSite } from '@/lib/content'
import { faqToItems } from '@/lib/faq'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Tell me about your project. A sentence or two is enough, no technical details needed.',
}

// Every "Start a project" button lands here, optionally with ?topic=… pre-selected
export default async function ContactPage() {
  const [home, site, faq] = await Promise.all([getHome(), getSite(), getFaq()])
  const { social } = site
  const channels = [
    { name: 'Book a call', detail: 'Pick a time that suits you', href: social.calendarBooking },
    { name: 'LinkedIn', detail: 'Message me directly', href: social.linkedin },
    { name: 'Upwork', detail: 'Hire me through Upwork', href: social.upwork },
    { name: 'Discord', detail: 'blankscreen.exe', href: social.discord },
  ].filter((c) => c.href)

  return (
    <>
      <ContactPanel topics={home.contactTopics} linkedin={social.linkedin} bookingUrl={social.calendarBooking} label="[ contact ]" section="contact" id="message" headingAs="h1" />

      <section className="border-b border-ink" data-section="other ways">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <SectionHeading label="[ other ways ]" size="text-4xl sm:text-5xl">
            Prefer something <Bar>else?</Bar>
          </SectionHeading>
          {/* gap-px over an ink background draws the dividers at every breakpoint */}
          <div className="mt-10 grid gap-px border border-ink bg-ink sm:grid-cols-2 lg:grid-cols-4" data-reveal="rows">
            {channels.map((c) => (
              <a key={c.name} href={c.href ?? undefined} target="_blank" rel="noopener noreferrer" className="ss-wipe block bg-paper p-6">
                <span className="flex justify-between">
                  <span className="ss-display ss-cond text-2xl">{c.name}</span>
                  <span className="ss-arrow font-jet text-primary">↗</span>
                </span>
                <span className="ss-dim mt-2 block font-jet text-xs">{c.detail}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-ink bg-paper" data-section="questions">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading label="[ questions ]" size="text-4xl sm:text-5xl">
              Good to <Bar>know.</Bar>
            </SectionHeading>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={faqToItems(faq.development.filter((q) => q.featured).slice(0, 3))} initialOpen={0} numbered />
          </div>
        </div>
      </section>

      {social.linkedin && (
        <section className="border-b border-ink" data-section="worked together?">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-16 md:px-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="ss-label" data-reveal="up">
                [ worked together before? ]
              </div>
              <p className="mt-4 text-2xl leading-snug" data-reveal="up">
                If you&apos;ve learned from me or enjoyed working together, a recommendation on LinkedIn would mean the world to me.
              </p>
            </div>
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="ss-chev-btn shrink-0 border-2 border-ink px-6 py-3.5 font-jet text-xs font-bold uppercase tracking-[.14em] hover:bg-ink hover:text-stock"
              data-reveal="up"
            >
              Recommend me <span className="ss-chev">↗</span>
            </a>
          </div>
        </section>
      )}
    </>
  )
}
