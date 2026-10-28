import React from 'react'
import { Link } from 'react-router-dom'

import appConstants from '../../../constants/appConstants'
import faqData from '../../../data/faq.json'
import homeContent from '../../../data/homeContent.json'
import SectionHeading, { Bar } from '../../sheet/SectionHeading'
import Accordion, { faqItems } from '../../sheet/Accordion'

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
        <div className="lg:col-span-8">
          <Accordion items={faqItems(questions)} initialOpen={0} numbered />
        </div>
      </div>
    </section>
  )
}

export default Faq
