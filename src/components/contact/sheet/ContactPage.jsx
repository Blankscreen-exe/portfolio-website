import React from 'react'

import socialLinks from '../../../data/socialLinks.json'
import faqData from '../../../data/faq.json'
import homeContent from '../../../data/homeContent.json'
import Contact from '../../home/sheet/Contact'
import SectionHeading, { Bar } from '../../sheet/SectionHeading'
import FaqAccordion from '../../sheet/FaqAccordion'

const CHANNELS = [
  { name: 'Book a call', detail: 'Pick a time that suits you', href: socialLinks.calendarBooking },
  { name: 'LinkedIn', detail: 'Message me directly', href: socialLinks.linkedin },
  { name: 'Upwork', detail: 'Hire me through Upwork', href: socialLinks.upwork },
  { name: 'Discord', detail: 'blankscreen.exe', href: socialLinks.discord },
]

const questions = homeContent.faqIndexes.slice(0, 3).map((i) => faqData.development[i]).filter(Boolean)

// Every "Start a project" button on the site lands here (optionally with ?topic=…)
function ContactPage() {
  return (
    <>
      <Contact label="[ contact ]" section="contact" id="message" headingAs="h1" />

      {/* Other ways to reach me */}
      <section className="border-b border-ink" data-section="other ways">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <SectionHeading label="[ other ways ]" size="text-4xl sm:text-5xl">Prefer something <Bar>else?</Bar></SectionHeading>
          {/* gap-px over an ink background draws the dividing lines at every breakpoint */}
          <div className="mt-10 grid gap-px border border-ink bg-ink sm:grid-cols-2 lg:grid-cols-4" data-reveal="rows">
            {CHANNELS.map((c) => (
              <a
                key={c.name}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ss-wipe group block bg-paper p-6"
              >
                <div className="flex justify-between">
                  <span className="ss-display ss-cond text-2xl">{c.name}</span>
                  <span className="ss-arrow font-jet text-primary">↗</span>
                </div>
                <p className="ss-dim mt-2 font-jet text-xs">{c.detail}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Quick questions */}
      <section className="border-b border-ink bg-paper" data-section="questions">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading label="[ questions ]" size="text-4xl sm:text-5xl">Good to <Bar>know.</Bar></SectionHeading>
          </div>
          <div className="lg:col-span-8"><FaqAccordion questions={questions} /></div>
        </div>
      </section>

      {/* Past clients and students */}
      <section className="border-b border-ink" data-section="worked together?">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-16 md:px-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="ss-label" data-reveal="up">[ worked together before? ]</div>
            <p className="mt-4 text-2xl leading-snug" data-reveal="up">
              If you&apos;ve learned from me or enjoyed working together, a recommendation on LinkedIn would mean the world to me.
            </p>
          </div>
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="ss-chev-btn shrink-0 border-2 border-ink px-6 py-3.5 font-jet text-xs font-bold uppercase tracking-[.14em] hover:bg-ink hover:text-stock" data-reveal="up">
            Recommend me <span className="ss-chev">↗</span>
          </a>
        </div>
      </section>
    </>
  )
}

export default ContactPage
