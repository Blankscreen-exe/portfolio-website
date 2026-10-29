import type { Metadata } from 'next'
import Link from 'next/link'

import Process from '@/components/home/Process'
import ServicesFaq from '@/components/services/ServicesFaq'
import CtaBand from '@/components/ui/CtaBand'
import PageHero from '@/components/ui/PageHero'
import SectionHeading, { Bar } from '@/components/ui/SectionHeading'
import { getFaq, getHome, getServices } from '@/lib/content'
import { pad } from '@/lib/format'
import { routes } from '@/lib/routes'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Product and AI engineering, rescuing struggling software, automation, consulting and mentorship.',
}

export default async function ServicesPage() {
  const [services, faq, home] = await Promise.all([getServices(), getFaq(), getHome()])

  const onThisPage = (
    <nav className="border border-ink bg-paper" aria-label="Services on this page">
      <div className="border-b border-ink px-4 py-2.5 font-jet text-[10px] font-bold uppercase tracking-widest">[ On this page ]</div>
      <ol data-reveal="rows">
        {services.map((s, i) => (
          <li key={s.title}>
            <a href={`#service-${i}`} className="ss-wipe flex items-baseline gap-3 border-b border-ink/15 px-4 py-2.5 last:border-b-0">
              <span className="ss-dim font-jet text-[11px]">{pad(i + 1)}</span>
              <span className="ss-display ss-cond text-lg">{s.title}</span>
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
        aside={onThisPage}
      >
        What I can <Bar>do for you.</Bar>
      </PageHero>

      {services.map((s, i) => (
        <section key={s.title} id={`service-${i}`} data-section={`${pad(i + 1)} / ${s.title.toLowerCase()}`} className={`scroll-mt-16 border-b border-ink ${i % 2 ? 'bg-paper' : ''}`}>
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="ss-display text-7xl text-primary" data-reveal="up">
                {pad(i + 1)}
              </div>
              <h2 className="ss-display mt-4 text-4xl sm:text-5xl" data-reveal="focus">
                {s.title}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ash" data-reveal="up">
                {s.description}
              </p>
            </div>

            <div className="lg:col-span-7">
              {s.goodFitIf && (
                <div className="border-l-4 border-primary bg-primary/10 px-5 py-4" data-reveal="up">
                  <div className="ss-label">Good fit if</div>
                  <p className="mt-1 text-lg">{s.goodFitIf}</p>
                </div>
              )}
              <div className="ss-label mt-8" data-reveal="up">
                [ what you get ]
              </div>
              <ul className="mt-3 grid border-t border-ink sm:grid-cols-2" data-reveal="rows">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-3 border-b border-ink/15 py-3 pr-4">
                    <span className="h-2 w-2 shrink-0 bg-primary" />
                    {d}
                  </li>
                ))}
              </ul>
              <Link
                href={routes.contactAbout(s.contactTopic)}
                className="ss-chev-btn mt-8 inline-block bg-ink px-6 py-3.5 font-jet text-xs font-bold uppercase tracking-[.14em] text-stock hover:opacity-90"
                data-reveal="up"
              >
                Talk to me about this <span className="ss-chev">↗</span>
              </Link>
            </div>
          </div>
        </section>
      ))}

      <Process steps={home.process} label="[ how it works ]" section="how it works" />

      <section id="faq" data-section="questions" className="scroll-mt-16 border-b border-ink bg-paper">
        <ServicesFaq
          heading={
            <SectionHeading label="[ questions ]">
              Common <Bar>questions.</Bar>
            </SectionHeading>
          }
          groups={[
            { key: 'development', label: 'Working with me', questions: faq.development },
            { key: 'mentorship', label: 'Mentorship', questions: faq.mentorship },
          ]}
        />
      </section>

      <CtaBand />
    </>
  )
}
