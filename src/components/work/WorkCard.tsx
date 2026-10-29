import Image from 'next/image'
import Link from 'next/link'

import type { Project } from '@/lib/content'
import { firstSentence, kindLabel, splitTitle, statusLabel } from '@/lib/projects'
import { routes } from '@/lib/routes'
import { stagger } from '@/lib/style'

/** Project card for the Work grid; the whole card opens the project's page. */
export default function WorkCard({ project, index = 0 }: { project: Project; index?: number }) {
  const { name, subtitle } = splitTitle(project.title)
  return (
    <Link href={routes.project(project.slug)} className="ss-spot ss-finder group flex flex-col border border-ink bg-paper" data-reveal="up" style={stagger(index % 3)}>
      <span className="ss-glow" />
      <div className="relative aspect-[16/10] overflow-hidden border-b border-ink bg-stock">
        {project.images[0] ? (
          <Image src={project.images[0]} alt="" fill loading={index < 3 ? 'eager' : 'lazy'} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="ss-shot object-cover object-top" />
        ) : (
          <div className="ss-hatch absolute inset-0" />
        )}
        {project.featured && <span className="absolute left-0 top-0 bg-primary px-2 py-0.5 font-jet text-[10px] font-bold uppercase tracking-[.15em] text-onprimary">Featured</span>}
      </div>
      <div className="relative z-[2] flex flex-1 flex-col p-5">
        <div className="flex justify-between font-jet text-[10px] uppercase tracking-[.15em] text-ash">
          <span>
            {kindLabel(project)} · {statusLabel(project)}
          </span>
          <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">open ↗</span>
        </div>
        <h3 className="ss-display ss-cond mt-4 text-2xl leading-none">{name}</h3>
        {subtitle && <p className="mt-1.5 font-jet text-[11px] uppercase tracking-[.1em]">{subtitle}</p>}
        <p className="mt-3 line-clamp-3 text-sm text-ash">{firstSentence(project.description)}</p>
        <p className="mt-auto pt-4 font-jet text-[10px] uppercase tracking-[.1em] text-ash">{project.tags.slice(0, 3).join(' · ')}</p>
      </div>
    </Link>
  )
}
