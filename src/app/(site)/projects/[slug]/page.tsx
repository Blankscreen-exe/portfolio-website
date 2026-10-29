import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import CtaBand from '@/components/ui/CtaBand'
import Scramble from '@/components/ui/Scramble'
import { Bar } from '@/components/ui/SectionHeading'
import ProjectGallery from '@/components/work/ProjectGallery'
import { getProject, getProjects } from '@/lib/content'
import { firstSentence, kindLabel, splitTitle, statusLabel } from '@/lib/projects'
import { routes } from '@/lib/routes'
import { stagger } from '@/lib/style'

// Every project page is generated at build time
export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }))
}
export const dynamicParams = false

export async function generateMetadata(props: PageProps<'/projects/[slug]'>): Promise<Metadata> {
  const project = await getProject((await props.params).slug)
  if (!project) return {}
  return { title: splitTitle(project.title).name, description: firstSentence(project.description) }
}

export default async function ProjectPage(props: PageProps<'/projects/[slug]'>) {
  const { slug } = await props.params
  const projects = await getProjects()
  const index = projects.findIndex((p) => p.slug === slug)
  const project = projects[index]
  if (!project) notFound()

  const { name, subtitle } = splitTitle(project.title)
  const status = statusLabel(project)
  const prev = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const facts = [
    { label: 'Type', value: kindLabel(project) },
    { label: 'Status', value: project.dateLabel || status },
    { label: 'Built with', value: project.tags.join(' · ') },
  ]

  return (
    <>
      <section className="border-b border-ink" data-section="project">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-10 md:px-8">
          <Link href={routes.work} className="font-jet text-[11px] uppercase tracking-[.16em] text-ash hover:text-primary">
            ← <Scramble text="[ work ]" /> / {name.toLowerCase()}
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-3 font-jet text-[10px] uppercase tracking-[.15em]" data-reveal="up">
                <span className="flex items-center gap-2 bg-primary px-2 py-0.5 text-onprimary">
                  {status === 'Live' && <span className="ss-blink inline-block h-1.5 w-1.5 bg-onprimary" />}
                  {status}
                </span>
                {project.featured && <span className="border border-ink px-2 py-0.5">Featured</span>}
              </div>
              <h1 className="ss-display mt-6 text-6xl sm:text-7xl lg:text-[88px]" data-reveal="focus">
                <Bar>{name}</Bar>
              </h1>
              {subtitle && (
                <p className="mt-5 font-jet text-sm uppercase tracking-[.12em]" data-reveal="up">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="flex flex-col justify-end gap-3 lg:col-span-5" data-reveal="up" style={stagger(2)}>
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="ss-chev-btn bg-ink px-6 py-4 text-center font-jet text-xs font-bold uppercase tracking-[.16em] text-stock hover:opacity-90">
                  Visit the live site <span className="ss-chev">↗</span>
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="ss-chev-btn border-2 border-ink px-6 py-3.5 text-center font-jet text-xs font-bold uppercase tracking-[.16em] hover:bg-ink hover:text-stock">
                  View the code <span className="ss-chev">↗</span>
                </a>
              )}
              {!project.liveUrl && project.liveUrlNote && <p className="border border-dashed border-ink px-4 py-3 font-jet text-[11px] text-ash">{project.liveUrlNote}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink bg-paper" data-section="screens">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <ProjectGallery key={project.slug} images={project.images} name={name} />
        </div>
      </section>

      <section className="border-b border-ink" data-section="the story">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="ss-label" data-reveal="up">
              [ the story ]
            </div>
            <div className="mt-6 space-y-5 text-lg leading-relaxed" data-reveal="rows">
              {project.description
                .split('\n\n')
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
            </div>
          </div>
          <aside className="lg:col-span-5">
            <div className="ss-label" data-reveal="up">
              [ project facts ]
            </div>
            <dl className="mt-6 border-t border-ink font-jet text-xs" data-reveal="rows">
              {facts.map((f) => (
                <div key={f.label} className="flex gap-4 border-b border-ink/15 py-3">
                  <dt className="ss-label w-24 shrink-0">{f.label}</dt>
                  <dd className="leading-relaxed">{f.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <nav className="grid border-b border-ink sm:grid-cols-2" aria-label="More projects">
        {[
          { p: prev, dir: '← Previous' },
          { p: next, dir: 'Next →' },
        ].map(({ p, dir }, i) => (
          <Link key={dir} href={routes.project(p.slug)} className={`ss-wipe block px-5 py-8 md:px-8 ${i === 0 ? 'border-b border-ink sm:border-b-0 sm:border-r' : 'sm:text-right'}`}>
            <span className="ss-dim font-jet text-[11px] uppercase tracking-[.16em]">{dir}</span>
            <span className="ss-display ss-cond mt-2 block text-3xl">{splitTitle(p.title).name}</span>
          </Link>
        ))}
      </nav>

      <CtaBand
        title={
          <>
            Want something <Bar>like {name.length > 14 ? 'this' : name}?</Bar>
          </>
        }
      />
    </>
  )
}
