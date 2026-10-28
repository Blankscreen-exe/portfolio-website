import React from 'react'
import { Link } from 'react-router-dom'

import appConstants from '../../../constants/appConstants'
import imgList from '../../../constants/img'
import homeContent from '../../../data/homeContent.json'
import socialLinks from '../../../data/socialLinks.json'
import workTimeline from '../../../data/workTimeline.json'
import awards from '../../../data/awards.json'
import education from '../../../data/educationTimeLine.json'
import techStack from '../../../data/techStack.json'
import communities from '../../../data/communities.json'
import hobbies from '../../../data/hobbies.json'
import languages from '../../../data/language.json'
import { capitalizeFirstLetter } from '../../../helpers/common'
import PageHero from '../../sheet/PageHero'
import SectionHeading, { Bar } from '../../sheet/SectionHeading'
import CtaBand from '../../sheet/CtaBand'

// HTML in these strings is authored in src/data/*.json (the old About/Experience pages render it the same way)
const html = (s) => ({ __html: s })

const TOOLKIT_LABELS = { languages: 'Languages', backend: 'Backend', frontend: 'Frontend', database: 'Databases', 'ML DS AI': 'AI & data', other: 'Infra & tools' }

const resolveCommunityImage = (url) => {
  if (typeof url === 'string' && url.startsWith('img:')) return imgList.communities?.[url.slice(4)]
  return url
}

function Portrait() {
  return (
    <figure className="group border border-ink bg-paper p-3">
      <div className="ss-shutter relative" data-reveal="shutter">
        <div className="ss-scan" />
        <img src="/profile_pic.png" alt="M. Hammad Hassan" className="ss-shot aspect-square w-full border border-ink/15 object-cover" />
      </div>
      <figcaption className="mt-3 flex justify-between font-jet text-[10px] uppercase tracking-widest text-ash">
        <span>Fig. 01</span><span>M. Hammad Hassan</span>
      </figcaption>
    </figure>
  )
}

function AboutPage() {
  const { paragraphs, facts } = homeContent.about

  return (
    <>
      <PageHero label="[ about ]" section="about" intro={paragraphs[0]} aside={<Portrait />}>
        M. Hammad <Bar>Hassan</Bar>
      </PageHero>

      {/* Dossier */}
      <section className="border-b border-ink" data-section="in short">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <div className="ss-shake relative border border-ink bg-paper py-10 pl-14 pr-6 sm:pr-8 md:pl-20 md:pr-12" data-reveal="up">
            <div className="ss-punch" aria-hidden="true" />
            <span className="ss-stamp right-8 top-8 hidden sm:block">Open to work</span>
            <div className="ss-label">[ in short ]</div>
            <div className="mt-6 grid gap-10 lg:grid-cols-2">
              <div className="space-y-4 text-lg leading-relaxed">
                {paragraphs.slice(1).map((p) => <p key={p}>{p}</p>)}
              </div>
              <dl className="border-t border-ink font-jet text-xs" data-reveal="rows">
                {facts.map((f) => (
                  <div key={f.key} className="flex gap-4 border-b border-ink/15 py-3"><dt className="ss-label w-28 shrink-0">{f.key}</dt><dd>{f.value}</dd></div>
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

      {/* Experience */}
      <section id="experience" className="scroll-mt-16 border-b border-ink" data-section="experience">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionHeading label="[ experience ]">Where I&apos;ve <Bar>worked.</Bar></SectionHeading>
          <div className="mt-12 border-t border-ink">
            {workTimeline.map((job, i) => (
              <details key={job.title} className="ss-faq group border-b border-ink" open={i === 0} data-reveal="up">
                <summary className="grid gap-2 py-6 md:grid-cols-12 md:items-baseline">
                  <span className="font-jet text-xs uppercase tracking-[.12em] text-ash md:col-span-3">{job.date}</span>
                  <span className="md:col-span-8">
                    <span className="ss-display ss-cond block text-3xl group-hover:text-primary">{job.title}</span>
                    <span className="mt-1 block font-jet text-xs uppercase tracking-[.12em]">{job.tooltip}</span>
                  </span>
                  <span className="ss-faq-icon hidden text-right font-jet text-2xl text-primary md:col-span-1 md:block" aria-hidden="true">+</span>
                </summary>
                <div className="pb-8 md:grid md:grid-cols-12">
                  <ul className="space-y-2 text-ash md:col-span-8 md:col-start-4">
                    {job.description.map((d) => (
                      <li key={d} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" /><span dangerouslySetInnerHTML={html(d)} /></li>
                    ))}
                    {job.orgUrl && (
                      <li className="pt-2"><a href={job.orgUrl} target="_blank" rel="noopener noreferrer" className="font-jet text-xs font-bold uppercase tracking-[.14em] text-primary hover:underline">{job.title} ↗</a></li>
                    )}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section id="awards" className="scroll-mt-16 border-b border-ink bg-paper" data-section="recognition">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionHeading label="[ recognition ]">Awards &amp; <Bar>talks.</Bar></SectionHeading>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {awards.map((a, i) => {
              const Wrapper = a.publishLinks?.[0] ? 'a' : 'div'
              const props = a.publishLinks?.[0] ? { href: a.publishLinks[0], target: '_blank', rel: 'noopener noreferrer' } : {}
              return (
                <Wrapper key={a.title} {...props} className="ss-spot ss-finder group flex flex-col border border-ink bg-stock" data-reveal="up" style={{ '--i': i % 3 }}>
                  <span className="ss-glow" />
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-ink">
                    <img src={imgList.awards[a.imgUrl]} alt="" loading="lazy" className="ss-shot h-full w-full object-cover" />
                  </div>
                  <div className="relative z-[2] flex flex-1 flex-col p-5">
                    <div className="flex justify-between font-jet text-[10px] uppercase tracking-[.15em] text-ash">
                      <span>{a.type === 'workshop' ? 'Workshop' : 'Award'} · {a.date}</span>
                      {Wrapper === 'a' && <span className="text-primary">↗</span>}
                    </div>
                    <h3 className="ss-display ss-cond mt-3 text-xl leading-tight">{a.title}</h3>
                    <p className="mt-2 line-clamp-4 text-sm text-ash">{a.description}</p>
                  </div>
                </Wrapper>
              )
            })}
          </div>
          <Link to={appConstants.routes.experienceCertificates} className="ss-chev-btn mt-8 inline-block font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline" data-reveal="up">
            Certificates <span className="ss-chev">▸▸▸</span>
          </Link>
        </div>
      </section>

      {/* Toolkit */}
      <section id="toolkit" className="scroll-mt-16 border-b border-ink" data-section="toolkit">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionHeading label="[ toolkit ]">What I <Bar>work with.</Bar></SectionHeading>
          <div className="mt-12 border-t border-ink" data-reveal="rows">
            {Object.entries(techStack).map(([group, items]) => (
              <div key={group} className="grid gap-3 border-b border-ink/15 py-5 md:grid-cols-12">
                <div className="ss-display ss-cond text-2xl md:col-span-3">{TOOLKIT_LABELS[group] || group}</div>
                <ul className="flex flex-wrap gap-2 md:col-span-9">
                  {items.map((t) => (
                    <li key={t.name}>
                      <a href={t.url} target="_blank" rel="noopener noreferrer" className="inline-block border border-ink/25 bg-paper px-2.5 py-1 font-jet text-[11px] transition-colors hover:border-primary hover:bg-primary hover:text-onprimary">{t.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="scroll-mt-16 border-b border-ink bg-paper" data-section="education">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionHeading label="[ education ]">Where I <Bar>studied.</Bar></SectionHeading>
          <div className="mt-12 border-t border-ink">
            {education.map((e) => (
              <div key={e.degreeTitle} className="grid gap-3 border-b border-ink/15 py-8 md:grid-cols-12" data-reveal="up">
                <span className="font-jet text-xs uppercase tracking-[.12em] text-ash md:col-span-3">{e.startDate} – {e.endDate}</span>
                <div className="md:col-span-9">
                  <h3 className="ss-display ss-cond text-3xl">{e.degreeTitle}</h3>
                  <p className="ss-about-html mt-1 font-jet text-xs uppercase tracking-[.12em]" dangerouslySetInnerHTML={html(e.organization)} />
                  <p className="ss-about-html mt-4 leading-relaxed text-ash" dangerouslySetInnerHTML={html(e.description)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communities */}
      <section id="communities" className="scroll-mt-16 border-b border-ink" data-section="communities">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionHeading label="[ communities ]">Giving <Bar>back.</Bar></SectionHeading>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {communities.map((c, i) => (
              <a key={c.title} href={c.websiteUrl} target="_blank" rel="noopener noreferrer" className="ss-spot ss-finder group flex flex-col border border-ink bg-paper" data-reveal="up" style={{ '--i': i }}>
                <span className="ss-glow" />
                <div className="relative grid aspect-[16/9] place-items-center overflow-hidden border-b border-ink bg-stock p-6">
                  <img src={resolveCommunityImage(c.imageUrl)} alt="" loading="lazy" className="ss-shot max-h-full max-w-full object-contain" />
                </div>
                <div className="relative z-[2] p-5">
                  <h3 className="ss-display ss-cond text-xl leading-tight">{c.title} <span className="font-jet text-sm text-primary">↗</span></h3>
                  <p className="mt-2 text-sm text-ash">{c.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Beyond work */}
      <section id="beyond" className="scroll-mt-16 border-b border-ink bg-paper" data-section="beyond work">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 md:px-8 lg:grid-cols-2">
          <div>
            <SectionHeading label="[ beyond work ]" size="text-4xl sm:text-5xl">When I&apos;m <Bar>off the clock.</Bar></SectionHeading>
            <div className="mt-10 border-t border-ink">
              {hobbies.map((h) => (
                <details key={h.name} className="ss-faq group border-b border-ink/15" data-reveal="up">
                  <summary className="flex justify-between gap-4 py-4">
                    <span className="ss-display ss-cond text-xl group-hover:text-primary">{h.name}</span>
                    <span className="ss-faq-icon font-jet text-xl leading-none text-primary" aria-hidden="true">+</span>
                  </summary>
                  <p className="ss-about-html pb-5 text-ash" dangerouslySetInnerHTML={html(h.desc)} />
                </details>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading label="[ languages ]" size="text-4xl sm:text-5xl">How I <Bar>talk.</Bar></SectionHeading>
            <div className="mt-10 border-t border-ink">
              {languages.map((l) => (
                <details key={l.language} className="ss-faq group border-b border-ink/15" data-reveal="up">
                  <summary className="flex justify-between gap-4 py-4">
                    <span className="ss-display ss-cond text-xl group-hover:text-primary">{capitalizeFirstLetter(l.language)}</span>
                    <span className="ss-faq-icon font-jet text-xl leading-none text-primary" aria-hidden="true">+</span>
                  </summary>
                  <p className="ss-about-html pb-5 text-ash" dangerouslySetInnerHTML={html(l.description)} />
                </details>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-jet text-xs font-bold uppercase tracking-[.16em]" data-reveal="up">
              <Link to={appConstants.routes.listsBooks} className="text-primary hover:underline">Books I read ▸</Link>
              <Link to={appConstants.routes.listsBookmarks} className="text-primary hover:underline">Bookmarks ▸</Link>
              <Link to={appConstants.routes.blog} className="text-primary hover:underline">My writing ▸</Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand title={<>Let&apos;s work <Bar>together.</Bar></>} />
    </>
  )
}

export default AboutPage
