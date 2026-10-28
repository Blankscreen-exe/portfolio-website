import React from 'react'
import { Link } from 'react-router-dom'

import appConstants from '../../../constants/appConstants'
import faqData from '../../../data/faq.json'
import homeContent from '../../../data/homeContent.json'
import SectionHeading, { Bar } from '../../sheet/SectionHeading'

// The client-facing questions, picked from the full development FAQ
const questions = homeContent.faqIndexes.map((i) => faqData.development[i]).filter(Boolean)

function Faq() {
  return (
    <section id="faq" data-section="06 / questions" className="scroll-mt-16 border-b border-ink bg-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading label="[ 06 / questions ]">Before you <Bar>ask.</Bar></SectionHeading>
          <p className="mt-6 max-w-sm text-ash" data-reveal="up">The things people usually want to know before we start.</p>
          <Link to={appConstants.routes.servicesFaq} className="ss-chev-btn mt-6 inline-block font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline" data-reveal="up">
            All questions <span className="ss-chev">▸▸▸</span>
          </Link>
        </div>

        <div className="border-t border-ink lg:col-span-8" data-reveal="rows">
          {questions.map((q, i) => (
            <details key={q.question} className="ss-faq group border-b border-ink" open={i === 0}>
              <summary className="flex items-start justify-between gap-6 py-5">
                <span className="flex gap-4">
                  <span className="pt-1 font-jet text-xs text-ash">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ss-display ss-cond text-2xl group-hover:text-primary">{q.question}</span>
                </span>
                <span className="ss-faq-icon font-jet text-2xl leading-none text-primary" aria-hidden="true">+</span>
              </summary>
              {/* Answers are trusted HTML authored in faq.json (same as the existing FAQ component) */}
              <div className="ss-faq-body pb-6 pl-9 leading-relaxed text-ash" dangerouslySetInnerHTML={{ __html: q.answer }} />
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faq
