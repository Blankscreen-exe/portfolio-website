import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import appConstants from '../../../constants/appConstants'
import imgList from '../../../constants/img'
import homeContent from '../../../data/homeContent.json'
import socialLinks from '../../../data/socialLinks.json'
import awards from '../../../data/awards.json'
import techStack from '../../../data/techStack.json'
import communities from '../../../data/communities.json'
import hobbies from '../../../data/hobbies.json'
import languages from '../../../data/language.json'
import { capitalizeFirstLetter } from '../../../helpers/common'
import PageHero from '../../sheet/PageHero'
import SectionHeading, { Bar } from '../../sheet/SectionHeading'
import CtaBand from '../../sheet/CtaBand'
import Accordion from '../../sheet/Accordion'
import Drawer from '../../sheet/Drawer'
import ProfilePhoto from '../../sheet/ProfilePhoto'

// HTML in these strings is authored in src/data/*.json (the old About page renders it the same way)
const html = (s) => ({ __html: s })

const TOOLKIT_LABELS = { languages: 'Languages', backend: 'Backend', frontend: 'Frontend', database: 'Databases', 'ML DS AI': 'AI & data', other: 'Infra & tools' }

const resolveCommunityImage = (url) => {
  if (typeof url === 'string' && url.startsWith('img:')) return imgList.communities?.[url.slice(4)]
  return url
}

function Portrait() {
  return (
    <figure className="border border-ink bg-paper p-3">
      <ProfilePhoto />
      <figcaption className="mt-3 flex justify-between font-jet text-[10px] uppercase tracking-widest text-ash">
        <span>Fig. 01</span><span>M. Hammad Hassan</span>
      </figcaption>
    </figure>
  )
}

const awardKind = (a) => (a.type === 'workshop' ? 'Workshop' : 'Award')

// Full details of one award, shown in the right-hand drawer
function AwardDetails({ award }) {
  return (
    <div className="p-6 sm:p-8">
      <div className="aspect-[16/10] overflow-hidden border border-ink">
        <img src={imgList.awards[award.imgUrl]} alt={award.title} className="h-full w-full object-cover contrast-[1.05] grayscale" />
      </div>
      <div className="mt-6 flex flex-wrap gap-2 font-jet text-[10px] uppercase tracking-[.15em]">
        <span className="bg-primary px-2 py-0.5 text-onprimary">{awardKind(award)}</span>
        <span className="border border-ink px-2 py-0.5">{award.date}</span>
      </div>
      <h3 className="ss-display mt-5 text-4xl leading-[.95]">{award.title}</h3>
      <p className="mt-5 text-lg leading-relaxed text-ash">{award.description}</p>
      {award.publishLinks?.length > 0 && (
        <div className="mt-8 border-t border-ink">
          {award.publishLinks.map((href, i) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="ss-wipe flex justify-between border-b border-ink/15 px-1 py-4">
              <span className="ss-display ss-cond text-xl">{award.publishLinks.length > 1 ? `View post ${i + 1}` : 'View the post'}</span>
              <span className="ss-arrow font-jet text-primary">↗</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

// "Code" reads best as the punchline, so it goes last
const orderedLanguages = [...languages].sort((a, b) => (a.language === 'code') - (b.language === 'code'))

// Experience and education are left off on purpose: the page should spark a conversation,
// not answer every question a recruiter might have.
function AboutPage() {
  const { paragraphs, facts } = homeContent.about
  const [activeAward, setActiveAward] = useState(null) // index of the award shown in the drawer
  const award = activeAward === null ? null : awards[activeAward]
  // Keep the last award rendered while the drawer slides closed
  const [shownAward, setShownAward] = useState(null)
  if (award && award !== shownAward) setShownAward(award)
  const step = (d) => setActiveAward((i) => (i + d + awards.length) % awards.length)

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

      {/* Awards */}
      <section id="awards" className="scroll-mt-16 border-b border-ink bg-paper" data-section="recognition">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionHeading label="[ recognition ]">Awards &amp; <Bar>talks.</Bar></SectionHeading>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {awards.map((a, i) => (
              <article key={a.title} className="ss-spot ss-finder group relative flex flex-col border border-ink bg-stock" data-reveal="up" style={{ '--i': i % 3 }}>
                <span className="ss-glow" />
                <div className="relative aspect-[16/9] overflow-hidden border-b border-ink">
                  {/* Award photos stay grayscale on hover (only the zoom remains), unlike other cards */}
                  <img src={imgList.awards[a.imgUrl]} alt="" loading="lazy" className="h-full w-full object-cover contrast-[1.05] grayscale transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="relative z-[2] flex flex-1 flex-col p-5">
                  <div className="flex justify-between font-jet text-[10px] uppercase tracking-[.15em] text-ash">
                    <span>{awardKind(a)} · {a.date}</span>
                    <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">details →</span>
                  </div>
                  <h3 className="ss-display ss-cond mt-3 text-xl leading-tight">{a.title}</h3>
                  <p className="mt-2 line-clamp-4 text-sm text-ash">{a.description}</p>
                </div>
                {/* Whole card opens the drawer */}
                <button type="button" onClick={() => setActiveAward(i)} aria-haspopup="dialog" aria-label={`Details: ${a.title}`} className="absolute inset-0 z-[3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
              </article>
            ))}
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

      {/* Communities */}
      <section id="communities" className="scroll-mt-16 border-b border-ink bg-paper" data-section="communities">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionHeading label="[ communities ]">Giving <Bar>back.</Bar></SectionHeading>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {communities.map((c, i) => (
              <a key={c.title} href={c.websiteUrl} target="_blank" rel="noopener noreferrer" className="ss-spot ss-finder group flex flex-col border border-ink bg-stock" data-reveal="up" style={{ '--i': i }}>
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
      <section id="beyond" className="scroll-mt-16 border-b border-ink" data-section="beyond work">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 md:px-8 lg:grid-cols-2">
          <div>
            <SectionHeading label="[ beyond work ]" size="text-4xl sm:text-5xl">When I&apos;m <Bar>off the clock.</Bar></SectionHeading>
            <div className="mt-10">
              <Accordion size="sm" items={hobbies.map((h) => ({ title: h.name, html: h.desc }))} />
            </div>
          </div>
          <div>
            <SectionHeading label="[ languages ]" size="text-4xl sm:text-5xl">How I <Bar>talk.</Bar></SectionHeading>
            <div className="mt-10">
              <Accordion size="sm" items={orderedLanguages.map((l) => ({ title: capitalizeFirstLetter(l.language), html: l.description }))} />
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

      <Drawer
        open={award !== null}
        onClose={() => setActiveAward(null)}
        label={`recognition / ${String(awards.indexOf(shownAward) + 1).padStart(2, '0')} of ${String(awards.length).padStart(2, '0')}`}
        title={shownAward?.title}
        footer={
          <div className="grid grid-cols-2">
            <button type="button" onClick={() => step(-1)} className="border-r border-ink px-5 py-4 text-left font-jet text-xs uppercase tracking-[.16em] transition-colors hover:bg-ink hover:text-stock">← Previous</button>
            <button type="button" onClick={() => step(1)} className="px-5 py-4 text-right font-jet text-xs uppercase tracking-[.16em] transition-colors hover:bg-primary hover:text-onprimary">Next →</button>
          </div>
        }
      >
        {shownAward && <AwardDetails key={shownAward.title} award={shownAward} />}
      </Drawer>
    </>
  )
}

export default AboutPage
