import React from 'react'
import { Link } from 'react-router-dom'

import appConstants from '../../../constants/appConstants'
import homeContent from '../../../data/homeContent.json'
import socialLinks from '../../../data/socialLinks.json'
import { Scramble } from '../../../helpers/sheetMotion'
import { Bar } from '../../sheet/SectionHeading'

function AboutCard() {
  const { paragraphs, facts } = homeContent.about

  return (
    <section id="about" data-section="05 / about" className="scroll-mt-16 border-b border-ink">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="ss-label" data-reveal="up"><Scramble text="[ 05 / about ]" /></div>

        {/* Dossier card: punch holes, stamp thumps in when revealed */}
        <div className="ss-shake relative mt-6 border border-ink bg-paper py-10 pl-14 pr-6 sm:pr-8 md:pl-20 md:pr-12" data-reveal="up">
          <div className="ss-punch" aria-hidden="true" />
          <span className="ss-stamp right-8 top-8 hidden sm:block">Open to work</span>
          <h2 className="ss-display text-5xl sm:text-6xl">M. Hammad <Bar>Hassan</Bar></h2>

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="space-y-4 leading-relaxed text-ash">
              {paragraphs.map((p) => <p key={p}>{p}</p>)}
              <Link to={appConstants.routes.aboutMe} className="ss-chev-btn inline-block pt-2 font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline">
                More about me <span className="ss-chev">▸▸▸</span>
              </Link>
            </div>
            <dl className="border-t border-ink font-jet text-xs" data-reveal="rows">
              {facts.map((f) => (
                <div key={f.key} className="flex gap-4 border-b border-ink/15 py-3">
                  <dt className="ss-label w-28 shrink-0">{f.key}</dt><dd>{f.value}</dd>
                </div>
              ))}
              <div className="flex gap-4 py-3">
                <dt className="ss-label w-28 shrink-0">Profile</dt>
                <dd><a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">LinkedIn ↗</a></dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutCard
