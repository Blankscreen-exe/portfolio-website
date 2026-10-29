import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import AwardsGrid from '@/components/about/AwardsGrid'
import Dossier from '@/components/home/Dossier'
import Accordion from '@/components/ui/Accordion'
import CtaBand from '@/components/ui/CtaBand'
import PageHero from '@/components/ui/PageHero'
import ProfilePhoto from '@/components/ui/ProfilePhoto'
import SectionHeading, { Bar } from '@/components/ui/SectionHeading'
import { getAbout, getHome, getSite } from '@/lib/content'
import { routes } from '@/lib/routes'
import { stagger } from '@/lib/style'

export const metadata: Metadata = {
  title: 'About',
  description: 'Product engineer and technical consultant: awards, toolkit, communities and life off the clock.',
}

// Work history and education are left off on purpose: the page should start a conversation,
// not answer every question up front.
export default async function AboutPage() {
  const [about, home, site] = await Promise.all([getAbout(), getHome(), getSite()])
  const [intro, ...rest] = home.aboutParagraphs

  const portrait = (
    <figure className="border border-ink bg-paper p-3">
      <ProfilePhoto eager />
      <figcaption className="mt-3 flex justify-between font-jet text-[10px] uppercase tracking-widest text-ash">
        <span>Fig. 01</span>
        <span>{site.name}</span>
      </figcaption>
    </figure>
  )

  return (
    <>
      <PageHero label="[ about ]" section="about" intro={intro} aside={portrait}>
        M. Hammad <Bar>Hassan</Bar>
      </PageHero>

      <section className="border-b border-ink" data-section="in short">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <Dossier paragraphs={rest} facts={home.aboutFacts} linkedin={site.social.linkedin} showMoreLink={false} />
        </div>
      </section>

      <section id="awards" className="scroll-mt-16 border-b border-ink bg-paper" data-section="recognition">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionHeading label="[ recognition ]">
            Awards &amp; <Bar>talks.</Bar>
          </SectionHeading>
          <AwardsGrid awards={about.awards} />
        </div>
      </section>

      <section id="toolkit" className="scroll-mt-16 border-b border-ink" data-section="toolkit">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionHeading label="[ toolkit ]">
            What I <Bar>work with.</Bar>
          </SectionHeading>
          <div className="mt-12 border-t border-ink" data-reveal="rows">
            {about.toolkit.map((group) => (
              <div key={group.group} className="grid gap-3 border-b border-ink/15 py-5 md:grid-cols-12">
                <div className="ss-display ss-cond text-2xl md:col-span-3">{group.group}</div>
                <ul className="flex flex-wrap gap-2 md:col-span-9">
                  {group.items.map((tool) => (
                    <li key={tool.name}>
                      <a
                        href={tool.url ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block border border-ink/25 bg-paper px-2.5 py-1 font-jet text-[11px] transition-colors hover:border-primary hover:bg-primary hover:text-onprimary"
                      >
                        {tool.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="communities" className="scroll-mt-16 border-b border-ink bg-paper" data-section="communities">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionHeading label="[ communities ]">
            Giving <Bar>back.</Bar>
          </SectionHeading>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.communities.map((c, i) => (
              <a key={c.title} href={c.url ?? undefined} target="_blank" rel="noopener noreferrer" className="ss-spot ss-finder group flex flex-col border border-ink bg-stock" data-reveal="up" style={stagger(i)}>
                <span className="ss-glow" />
                <div className="relative aspect-[16/9] overflow-hidden border-b border-ink">
                  {c.image && <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="ss-shot object-contain p-6" />}
                </div>
                <div className="relative z-[2] p-5">
                  <h3 className="ss-display ss-cond text-xl leading-tight">
                    {c.title} <span className="font-jet text-sm text-primary">↗</span>
                  </h3>
                  <p className="mt-2 text-sm text-ash">{c.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="beyond" className="scroll-mt-16 border-b border-ink" data-section="beyond work">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 md:px-8 lg:grid-cols-2">
          <div>
            <SectionHeading label="[ beyond work ]" size="text-4xl sm:text-5xl">
              When I&apos;m <Bar>off the clock.</Bar>
            </SectionHeading>
            <div className="mt-10">
              <Accordion size="sm" items={about.hobbies.map((h) => ({ title: h.title, body: h.body }))} />
            </div>
          </div>
          <div>
            <SectionHeading label="[ languages ]" size="text-4xl sm:text-5xl">
              How I <Bar>talk.</Bar>
            </SectionHeading>
            <div className="mt-10">
              <Accordion size="sm" items={about.languages.map((l) => ({ title: l.title, body: l.body }))} />
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-jet text-xs font-bold uppercase tracking-[.16em]" data-reveal="up">
              <Link href={routes.books} className="text-primary hover:underline">
                Books I read ▸
              </Link>
              <Link href={routes.bookmarks} className="text-primary hover:underline">
                Bookmarks ▸
              </Link>
              <Link href={routes.writing} className="text-primary hover:underline">
                My writing ▸
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Let&apos;s work <Bar>together.</Bar>
          </>
        }
      />
    </>
  )
}
