import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import appConstants from '../../../constants/appConstants'
import servicesData from '../../../data/services.json'
import faqData from '../../../data/faq.json'
import { capitalizeFirstLetter } from '../../../helpers/common'
import PageHero from '../../sheet/PageHero'
import SectionHeading, { Bar } from '../../sheet/SectionHeading'
import FaqAccordion from '../../sheet/FaqAccordion'
import CtaBand from '../../sheet/CtaBand'
import Process from '../../home/sheet/Process'

const pad = (n) => String(n).padStart(2, '0')
const FAQ_GROUPS = [
  { key: 'development', label: 'Working with me' },
  { key: 'mentorship', label: 'Mentorship' },
]

function ServicesPage() {
  const [params] = useSearchParams()
  const [faqGroup, setFaqGroup] = useState(FAQ_GROUPS[0].key)

  // Old links use /services?servicetype=N; jump to that service
  useEffect(() => {
    const n = params.get('servicetype')
    if (n === null) return
    const el = document.getElementById(`service-${n}`)
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 150)
  }, [params])

  const index = (
    <nav className="border border-ink bg-paper" aria-label="Services on this page">
      <div className="border-b border-ink px-4 py-2.5 font-jet text-[10px] font-bold uppercase tracking-widest">[ On this page ]</div>
      <ol data-reveal="rows">
        {servicesData.map((s, i) => (
          <li key={s.title}>
            <a href={`#service-${i}`} className="ss-wipe flex items-baseline gap-3 border-b border-ink/15 px-4 py-2.5 last:border-b-0">
              <span className="ss-dim font-jet text-[11px]">{pad(i + 1)}</span>
              <span className="ss-display ss-cond text-lg">{capitalizeFirstLetter(s.title)}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )

  return (
    <>
      <PageHero
        label="[ services ]"
        section="services"
        intro="Whether you're starting from an idea, adding AI to your business or rescuing software that's holding you back, here's how I can help. Every engagement starts with a conversation, not a contract."
        aside={index}
      >
        What I can <Bar>do for you.</Bar>
      </PageHero>

      {/* Services */}
      {servicesData.map((s, i) => (
        <section key={s.title} id={`service-${i}`} data-section={`${pad(i + 1)} / ${s.title.toLowerCase()}`} className={`scroll-mt-16 border-b border-ink ${i % 2 ? 'bg-paper' : ''}`}>
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="ss-display text-7xl text-primary" data-reveal="up">{pad(i + 1)}</div>
              <h2 className="ss-display mt-4 text-4xl sm:text-5xl" data-reveal="focus">{capitalizeFirstLetter(s.title)}</h2>
              <p className="mt-5 text-lg leading-relaxed text-ash" data-reveal="up">{capitalizeFirstLetter(s.description)}</p>
            </div>

            <div className="lg:col-span-7">
              {s.goodFitIf && (
                <div className="border-l-4 border-primary bg-primary/10 px-5 py-4" data-reveal="up">
                  <div className="ss-label">Good fit if</div>
                  <p className="mt-1 text-lg">{s.goodFitIf}</p>
                </div>
              )}
              <div className="ss-label mt-8" data-reveal="up">[ what you get ]</div>
              <ul className="mt-3 grid border-t border-ink sm:grid-cols-2" data-reveal="rows">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-3 border-b border-ink/15 py-3 pr-4">
                    <span className="h-2 w-2 shrink-0 bg-primary" />{d}
                  </li>
                ))}
              </ul>
              <Link
                to={`${appConstants.routes.contacts}?topic=${encodeURIComponent(s.contactTopic || '')}`}
                className="ss-chev-btn mt-8 inline-block bg-ink px-6 py-3.5 font-jet text-xs font-bold uppercase tracking-[.14em] text-stock hover:opacity-90"
                data-reveal="up"
              >
                Talk to me about this <span className="ss-chev">↗</span>
              </Link>
            </div>
          </div>
        </section>
      ))}

      <Process label="[ how it works ]" section="how it works" />

      {/* Full FAQ */}
      <section id="faq" data-section="questions" className="scroll-mt-16 border-b border-ink bg-paper">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading label="[ questions ]">Common <Bar>questions.</Bar></SectionHeading>
            <div className="mt-8 flex border border-ink" role="tablist" aria-label="Question topics" data-reveal="up">
              {FAQ_GROUPS.map((g, i) => (
                <button
                  key={g.key}
                  type="button"
                  role="tab"
                  aria-selected={faqGroup === g.key}
                  onClick={() => setFaqGroup(g.key)}
                  className={`flex-1 px-4 py-3 font-jet text-[11px] uppercase tracking-[.14em] transition-colors ${i ? 'border-l border-ink' : ''} ${faqGroup === g.key ? 'bg-primary text-onprimary' : 'hover:bg-stock'}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion key={faqGroup} questions={faqData[faqGroup] || []} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

export default ServicesPage
