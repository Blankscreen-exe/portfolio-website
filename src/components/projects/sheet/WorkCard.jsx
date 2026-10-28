import React from 'react'
import { Link } from 'react-router-dom'

import { resolveProjectThumbnail, splitTitle, firstSentence, statusLabel, projectSlug, isClientWork } from '../../../helpers/projects'

// Project card for the Work grid; the whole card opens the project's detail page.
function WorkCard({ project, index = 0 }) {
  const t = splitTitle(project.title)
  return (
    <Link
      to={`/projects/${projectSlug(project)}`}
      className="ss-spot ss-finder group flex flex-col border border-ink bg-paper"
      data-reveal="up"
      style={{ '--i': index % 3 }}
    >
      <span className="ss-glow" />
      <div className="relative aspect-[16/10] overflow-hidden border-b border-ink bg-stock">
        <img src={resolveProjectThumbnail(project.thumbnailUrl)} alt="" loading="lazy" className="ss-shot absolute inset-0 h-full w-full object-cover object-top" />
        {project.featured && (
          <span className="absolute left-0 top-0 bg-primary px-2 py-0.5 font-jet text-[10px] font-bold uppercase tracking-[.15em] text-onprimary">Featured</span>
        )}
      </div>
      <div className="relative z-[2] flex flex-1 flex-col p-5">
        <div className="flex justify-between font-jet text-[10px] uppercase tracking-[.15em] text-ash">
          <span>{isClientWork(project) ? 'Client work' : 'Side project'} · {statusLabel(project)}</span>
          <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">open ↗</span>
        </div>
        <h3 className="ss-display ss-cond mt-4 text-2xl leading-none">{t.name}</h3>
        {t.subtitle && <p className="mt-1.5 font-jet text-[11px] uppercase tracking-[.1em]">{t.subtitle}</p>}
        <p className="mt-3 line-clamp-3 text-sm text-ash">{firstSentence(project.description)}</p>
        <p className="mt-auto pt-4 font-jet text-[10px] uppercase tracking-[.1em] text-ash">
          {(project.tags || []).slice(0, 3).join(' · ')}
        </p>
      </div>
    </Link>
  )
}

export default WorkCard
