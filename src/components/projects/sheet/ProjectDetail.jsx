import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import appConstants from '../../../constants/appConstants'
import projectList from '../../../data/projectList.json'
import {
  resolveProjectImages, splitTitle, statusLabel, projectSlug, isClientWork,
} from '../../../helpers/projects'
import { Scramble } from '../../../helpers/sheetMotion'
import { Bar } from '../../sheet/SectionHeading'
import CtaBand from '../../sheet/CtaBand'
import Error404 from '../../common/404'

function ProjectDetail() {
  const { slug } = useParams()
  const index = projectList.findIndex((p) => projectSlug(p) === slug)
  const project = projectList[index]
  const [shot, setShot] = useState(0)

  useEffect(() => setShot(0), [slug])

  if (!project) return <Error404 />

  const { name, subtitle } = splitTitle(project.title)
  const images = resolveProjectImages(project.thumbnailUrl)
  const paragraphs = (project.description || '').split('\n\n').filter(Boolean)
  const prev = projectList[(index - 1 + projectList.length) % projectList.length]
  const next = projectList[(index + 1) % projectList.length]

  const facts = [
    { k: 'Type', v: isClientWork(project) ? 'Client work' : 'Side project' },
    { k: 'Status', v: project.publishDate || statusLabel(project) },
    { k: 'Built with', v: (project.tags || []).join(' · ') },
  ]

  return (
    <>
      <section className="border-b border-ink" data-section="project">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-10 md:px-8">
          <Link to={appConstants.routes.projects} className="ss-chev-btn font-jet text-[11px] uppercase tracking-[.16em] text-ash hover:text-primary">
            ← <Scramble text="[ work ]" /> / {name.toLowerCase()}
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-3 font-jet text-[10px] uppercase tracking-[.15em]" data-reveal="up">
                <span className="flex items-center gap-2 bg-primary px-2 py-0.5 text-onprimary">
                  {statusLabel(project) === 'Live' && <span className="ss-blink inline-block h-1.5 w-1.5 bg-onprimary" />}
                  {statusLabel(project)}
                </span>
                {project.featured && <span className="border border-ink px-2 py-0.5">Featured</span>}
              </div>
              <h1 className="ss-display mt-6 text-6xl sm:text-7xl lg:text-[88px]" data-reveal="focus"><Bar>{name}</Bar></h1>
              {subtitle && <p className="mt-5 font-jet text-sm uppercase tracking-[.12em]" data-reveal="up">{subtitle}</p>}
            </div>

            <div className="flex flex-col justify-end gap-3 lg:col-span-5" data-reveal="up" style={{ '--i': 2 }}>
              {project.projUrl && (
                <a href={project.projUrl} target="_blank" rel="noopener noreferrer" className="ss-chev-btn bg-ink px-6 py-4 text-center font-jet text-xs font-bold uppercase tracking-[.16em] text-stock hover:opacity-90">
                  Visit the live site <span className="ss-chev">↗</span>
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="ss-chev-btn border-2 border-ink px-6 py-3.5 text-center font-jet text-xs font-bold uppercase tracking-[.16em] hover:bg-ink hover:text-stock">
                  View the code <span className="ss-chev">↗</span>
                </a>
              )}
              {!project.projUrl && project.liveUrlNote && (
                <p className="border border-dashed border-ink px-4 py-3 font-jet text-[11px] text-ash">{project.liveUrlNote}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="border-b border-ink bg-paper" data-section="screens">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <div className="ss-shutter relative aspect-[16/9] border border-ink bg-stock" data-reveal="shutter">
            <img key={shot} src={images[shot]} alt={`${name} screenshot ${shot + 1}`} className="ss-swap absolute inset-0 h-full w-full object-contain" />
            {images.length > 1 && (
              <>
                <button type="button" onClick={() => setShot((s) => (s - 1 + images.length) % images.length)} className="absolute bottom-0 left-0 z-[3] border-r border-t border-ink bg-paper px-4 py-2 font-jet hover:bg-primary hover:text-onprimary" aria-label="Previous screenshot">←</button>
                <button type="button" onClick={() => setShot((s) => (s + 1) % images.length)} className="absolute bottom-0 right-0 z-[3] border-l border-t border-ink bg-ink px-4 py-2 font-jet text-stock hover:bg-primary hover:text-onprimary" aria-label="Next screenshot">→</button>
                <span className="absolute bottom-0 left-1/2 z-[3] -translate-x-1/2 border-x border-t border-ink bg-paper px-3 py-2 font-jet text-[11px]">
                  {String(shot + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                </span>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setShot(i)}
                  aria-label={`Show screenshot ${i + 1}`}
                  aria-current={i === shot}
                  className={`h-16 w-24 shrink-0 border ${i === shot ? 'border-2 border-primary' : 'border-ink/30 opacity-60 grayscale hover:opacity-100 hover:grayscale-0'}`}
                >
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Story + facts */}
      <section className="border-b border-ink" data-section="the story">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="ss-label" data-reveal="up">[ the story ]</div>
            <div className="mt-6 space-y-5 text-lg leading-relaxed" data-reveal="rows">
              {paragraphs.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
            </div>
          </div>
          <aside className="lg:col-span-5">
            <div className="ss-label" data-reveal="up">[ project facts ]</div>
            <dl className="mt-6 border-t border-ink font-jet text-xs" data-reveal="rows">
              {facts.map((f) => (
                <div key={f.k} className="flex gap-4 border-b border-ink/15 py-3">
                  <dt className="ss-label w-24 shrink-0">{f.k}</dt><dd className="leading-relaxed">{f.v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* Prev / next */}
      <nav className="grid border-b border-ink sm:grid-cols-2" aria-label="More projects">
        {[{ p: prev, dir: '← Previous' }, { p: next, dir: 'Next →' }].map(({ p, dir }, i) => (
          <Link
            key={dir}
            to={`/projects/${projectSlug(p)}`}
            className={`ss-wipe group block px-5 py-8 md:px-8 ${i === 0 ? 'border-b border-ink sm:border-b-0 sm:border-r' : 'sm:text-right'}`}
          >
            <span className="ss-dim font-jet text-[11px] uppercase tracking-[.16em]">{dir}</span>
            <span className="ss-display ss-cond mt-2 block text-3xl">{splitTitle(p.title).name}</span>
          </Link>
        ))}
      </nav>

      <CtaBand title={<>Want something <Bar>like {name.length > 14 ? 'this' : name}?</Bar></>} />
    </>
  )
}

export default ProjectDetail
