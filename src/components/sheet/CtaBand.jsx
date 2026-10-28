import React from 'react'
import { Link } from 'react-router-dom'

import appConstants from '../../constants/appConstants'
import { Scramble } from '../../helpers/sheetMotion'
import { Bar } from './SectionHeading'

/**
 * Closing call to action used at the bottom of every inner page.
 * `topic` pre-selects the "What do you need?" option on the contact form.
 */
function CtaBand({ title = <>Have a project <Bar>in mind?</Bar></>, text = 'Tell me about it. A sentence or two is enough, no technical details needed.', topic, label = '[ next step ]' }) {
  const to = topic
    ? `${appConstants.routes.contacts}?topic=${encodeURIComponent(topic)}`
    : appConstants.routes.contacts

  return (
    <section className="bg-ink text-stock transition-colors duration-500" data-section="next step">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 px-5 py-20 md:px-8 lg:flex-row lg:items-end">
        <div>
          <div className="ss-label !text-stock/60" data-reveal="up"><Scramble text={label} /></div>
          <h2 className="ss-display mt-4 text-5xl sm:text-6xl" data-reveal="focus">{title}</h2>
          <p className="mt-6 max-w-lg text-lg text-stock/75" data-reveal="up">{text}</p>
        </div>
        <div data-reveal="up">
          <Link to={to} className="ss-magnet ss-chev-btn inline-block whitespace-nowrap bg-primary px-8 py-5 font-jet text-sm font-bold uppercase tracking-[.16em] text-onprimary transition-[transform,filter] duration-300 hover:brightness-110">
            Start a project <span className="ss-chev">↗</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CtaBand
