import React from 'react'
import { Link } from 'react-router-dom'

import appConstants from '../../../constants/appConstants'
import projectList from '../../../data/projectList.json'
import { resolveProjectThumbnail } from '../../../helpers/projects'
import SectionHeading, { Bar } from '../../sheet/SectionHeading'

const featured = projectList.filter((p) => p.featured)

// "AMOS - AI Powered CRM System" → { name: "AMOS", subtitle: "AI Powered CRM System" }
function splitTitle(title) {
  const [name, ...rest] = title.split(' - ')
  return { name, subtitle: rest.join(' - ') }
}

// First sentence of the (long, technical) description, for card copy
function firstSentence(text = '') {
  const para = text.split('\n')[0]
  const m = para.match(/^.*?[.!?](\s|$)/)
  return (m ? m[0] : para).trim()
}

function statusBadge(p) {
  if (p.status === 'ongoing') return p.projUrl ? 'Live' : 'Ongoing'
  return 'Shipped'
}

// External live link when there is one, otherwise the projects page
function ProjectLink({ project, className, children }) {
  return project.projUrl
    ? <a href={project.projUrl} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
    : <Link to={appConstants.routes.projects} className={className}>{children}</Link>
}

function SelectedWork() {
  if (!featured.length) return null
  const [lead, ...rest] = featured
  const leadTitle = splitTitle(lead.title)

  return (
    <section id="work" data-section="02 / work" className="scroll-mt-16 border-b border-ink bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading label="[ 02 / selected work ]">Built, <Bar>shipped.</Bar></SectionHeading>
          <Link to={appConstants.routes.projects} className="ss-chev-btn font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline" data-reveal="up">
            All projects <span className="ss-chev">▸▸▸</span>
          </Link>
        </div>

        {/* Lead project */}
        <ProjectLink project={lead} className="ss-spot ss-finder group mt-12 grid border border-ink bg-stock md:grid-cols-[1fr_1.15fr]">
          <span className="ss-glow" />
          <div className="relative z-[2] flex flex-col justify-between p-7 sm:p-9" data-reveal="up">
            <div>
              <div className="flex items-center justify-between font-jet text-[10px] uppercase tracking-[.15em]">
                <span className="flex items-center gap-2 bg-primary px-2 py-0.5 text-onprimary">
                  {statusBadge(lead) === 'Live' && <span className="ss-blink inline-block h-1.5 w-1.5 bg-onprimary" />}
                  {statusBadge(lead)}
                </span>
                <span className="text-ash">Featured</span>
              </div>
              <h3 className="ss-display mt-6 text-4xl sm:text-5xl">{leadTitle.name}</h3>
              {leadTitle.subtitle && <p className="mt-2 font-jet text-xs uppercase tracking-[.12em]">{leadTitle.subtitle}</p>}
              <p className="mt-4 max-w-md text-ash">{firstSentence(lead.description)}</p>
              <dl className="mt-7 border-t border-ink/15 font-jet text-xs">
                <div className="flex gap-4 border-b border-ink/15 py-2.5"><dt className="ss-label w-24 shrink-0">Status</dt><dd>{lead.publishDate}</dd></div>
                <div className="flex gap-4 border-b border-ink/15 py-2.5"><dt className="ss-label w-24 shrink-0">Built with</dt><dd>{(lead.tags || []).slice(0, 4).join(' · ')}</dd></div>
              </dl>
            </div>
            <span className="ss-chev-btn mt-8 font-jet text-[11px] font-bold uppercase tracking-[.2em] text-primary">
              {lead.projUrl ? 'Visit live site' : 'See the project'} <span className="ss-chev">↗</span>
            </span>
          </div>
          <div className="ss-shutter relative min-h-[260px] border-t border-ink md:border-l md:border-t-0" data-reveal="shutter">
            <img src={resolveProjectThumbnail(lead.thumbnailUrl)} alt={lead.title} loading="lazy" className="ss-shot absolute inset-0 h-full w-full object-cover object-top" />
          </div>
        </ProjectLink>

        {/* The rest of the featured projects */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {rest.map((p, i) => {
            const t = splitTitle(p.title)
            return (
              <ProjectLink key={p.title} project={p} className="ss-spot ss-finder group flex flex-col border border-ink bg-stock">
                <span className="ss-glow" />
                <div className="ss-shutter relative aspect-[16/8] border-b border-ink" data-reveal="shutter">
                  <img src={resolveProjectThumbnail(p.thumbnailUrl)} alt={p.title} loading="lazy" className="ss-shot absolute inset-0 h-full w-full object-cover object-top" />
                </div>
                <div className="relative z-[2] flex flex-1 flex-col p-6" data-reveal="up" style={{ '--i': i % 2 }}>
                  <div className="flex justify-between font-jet text-[10px] uppercase tracking-[.15em] text-ash">
                    <span>{statusBadge(p)}</span>
                    <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">open ↗</span>
                  </div>
                  <h3 className="ss-display ss-cond mt-4 text-3xl">{t.name}</h3>
                  {t.subtitle && <p className="mt-1 font-jet text-[11px] uppercase tracking-[.12em]">{t.subtitle}</p>}
                  <p className="mt-3 text-sm text-ash">{firstSentence(p.description)}</p>
                </div>
              </ProjectLink>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default SelectedWork
