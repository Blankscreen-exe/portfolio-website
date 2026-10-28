import React from 'react'

import socialLinks from '../../../data/socialLinks.json'
import { Scramble } from '../../../helpers/sheetMotion'
import { Bar } from '../../sheet/SectionHeading'
import ContactForm from './ContactForm'

const NEXT_STEPS = [
  'I read your message and reply, usually within a day.',
  'We have a short call to understand what you need.',
  'You get a clear plan and quote before any work starts.',
]

// Inverted (ink) panel; every "Start a project" button on the site lands here.
function Contact() {
  return (
    <section id="contact" data-section="07 / contact" className="scroll-mt-16 bg-ink text-stock transition-colors duration-500">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 lg:grid-cols-2">
        <div>
          <div className="ss-label !text-stock/60" data-reveal="up"><Scramble text="[ 07 / contact ]" /></div>
          <h2 className="ss-display mt-4 text-6xl sm:text-7xl" data-reveal="focus">Let&apos;s <Bar>talk.</Bar></h2>
          <p className="mt-6 max-w-md text-lg text-stock/75" data-reveal="up">
            A sentence or two is enough, no technical details needed.
          </p>

          <div className="mt-10 max-w-md" data-reveal="up">
            <div className="ss-label !text-stock/60">[ what happens next ]</div>
            <ol className="mt-4 border-t border-stock/25" data-reveal="rows">
              {NEXT_STEPS.map((s, i) => (
                <li key={s} className="flex gap-4 border-b border-stock/25 py-3 text-sm">
                  <span className="font-jet text-xs text-primary">{String(i + 1).padStart(2, '0')}</span>{s}
                </li>
              ))}
            </ol>
            <a href={socialLinks.calendarBooking} target="_blank" rel="noopener noreferrer" className="ss-chev-btn mt-6 inline-block font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline">
              Prefer to talk? Book a call <span className="ss-chev">↗</span>
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  )
}

export default Contact
