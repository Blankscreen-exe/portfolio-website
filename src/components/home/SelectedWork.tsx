import Image from 'next/image'
import Link from 'next/link'

import { ArrowUpRight, TripleArrow } from '@/components/ui/Decor'
import SectionHeading, { Bar } from '@/components/ui/SectionHeading'
import type { Project } from '@/lib/content'
import { firstSentence, splitTitle, statusLabel } from '@/lib/projects'
import { routes } from '@/lib/routes'
import { stagger } from '@/lib/style'

function Shot({ project, sizes }: { project: Project; sizes: string }) {
  if (!project.images[0]) return <div className="ss-hatch absolute inset-0" />
  return <Image src={project.images[0]} alt="" fill sizes={sizes} className="ss-shot object-cover object-top" />
}

/** Featured projects: one lead card plus a grid. Every card opens the project's own page. */
export default function SelectedWork({ projects }: { projects: Project[] }) {
  const [lead, ...rest] = projects
  if (!lead) return null
  const leadTitle = splitTitle(lead.title)
  const leadStatus = statusLabel(lead)

  return (
    <section id="work" data-section="02 / work" className="scroll-mt-16 border-b border-ink bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading label="[ 02 / selected work ]">
            Built, <Bar>shipped.</Bar>
          </SectionHeading>
          <Link href={routes.work} className="ss-chev-btn font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline" data-reveal="up">
            All projects <TripleArrow />
          </Link>
        </div>

        <Link href={routes.project(lead.slug)} className="ss-spot ss-finder group mt-12 grid grid-cols-1 border border-ink bg-stock md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <span className="ss-glow" />
          <div className="relative z-[2] flex flex-col justify-between p-7 sm:p-9" data-reveal="up">
            <div>
              <div className="flex items-center justify-between font-jet text-[10px] uppercase tracking-[.15em]">
                <span className="flex items-center gap-2 bg-primary px-2 py-0.5 text-onprimary">
                  {leadStatus === 'Live' && <span className="ss-blink inline-block h-1.5 w-1.5 bg-onprimary" />}
                  {leadStatus}
                </span>
                <span className="text-ash">Featured</span>
              </div>
              <h3 className="ss-display mt-6 text-4xl sm:text-5xl">{leadTitle.name}</h3>
              {leadTitle.subtitle && <p className="mt-2 font-jet text-xs uppercase tracking-[.12em]">{leadTitle.subtitle}</p>}
              <p className="mt-4 max-w-md text-ash">{firstSentence(lead.description)}</p>
              <dl className="mt-7 border-t border-ink/15 font-jet text-xs">
                <div className="flex gap-4 border-b border-ink/15 py-2.5">
                  <dt className="ss-label w-24 shrink-0">Status</dt>
                  <dd>{lead.dateLabel}</dd>
                </div>
                <div className="flex gap-4 border-b border-ink/15 py-2.5">
                  <dt className="ss-label w-24 shrink-0">Built with</dt>
                  <dd>{lead.tags.slice(0, 4).join(' · ')}</dd>
                </div>
              </dl>
            </div>
            <span className="ss-chev-btn mt-8 font-jet text-[11px] font-bold uppercase tracking-[.2em] text-primary">
              Read the full story <ArrowUpRight className="ss-chev" />
            </span>
          </div>
          <div className="ss-shutter relative min-h-[260px] border-t border-ink md:border-l md:border-t-0" data-reveal="shutter">
            <Shot project={lead} sizes="(min-width: 768px) 55vw, 100vw" />
          </div>
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {rest.map((p, i) => {
            const t = splitTitle(p.title)
            return (
              <Link key={p.slug} href={routes.project(p.slug)} className="ss-spot ss-finder group flex flex-col border border-ink bg-stock">
                <span className="ss-glow" />
                <div className="ss-shutter relative aspect-[16/8] border-b border-ink" data-reveal="shutter">
                  <Shot project={p} sizes="(min-width: 768px) 45vw, 100vw" />
                </div>
                <div className="relative z-[2] flex flex-1 flex-col p-6" data-reveal="up" style={stagger(i % 2)}>
                  <div className="flex justify-between font-jet text-[10px] uppercase tracking-[.15em] text-ash">
                    <span>{statusLabel(p)}</span>
                    <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">open <ArrowUpRight /></span>
                  </div>
                  <h3 className="ss-display ss-cond mt-4 text-3xl">{t.name}</h3>
                  {t.subtitle && <p className="mt-1 font-jet text-[11px] uppercase tracking-[.12em]">{t.subtitle}</p>}
                  <p className="mt-3 text-sm text-ash">{firstSentence(p.description)}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
