import type { Metadata } from 'next'

import WritingBrowser from '@/components/blog/WritingBrowser'
import CtaBand from '@/components/ui/CtaBand'
import { ArrowUpRight } from '@/components/ui/Decor'
import PageHero from '@/components/ui/PageHero'
import { Bar } from '@/components/ui/SectionHeading'
import { getPosts, getSite } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Writing',
  description: "Articles on Python, AI, software design and the lessons I've learned building real products.",
}

export default async function WritingPage() {
  const [posts, site] = await Promise.all([getPosts(), getSite()])
  const elsewhere = [
    { name: 'Medium', href: site.social.medium },
    { name: 'Hashnode', href: site.social.hashnode },
    { name: 'Dev In Trenches', href: 'https://dev-in-trenches.com' },
  ].filter((l) => l.href)

  return (
    <>
      <PageHero
        label="[ writing ]"
        section="writing"
        intro="Software Engineering is certainly not a walk in the park ... or a park anyone willingly walks into without knowing what lies ahead. Therefore I call it the trenches where corporate meets brain power to convert ideas into reality."
        aside={
          <div className="border border-ink bg-paper">
            <div className="border-b border-ink px-4 py-2.5 font-jet text-[10px] font-bold uppercase tracking-widest">[ Read me elsewhere ]</div>
            {elsewhere.map((l) => (
              <a key={l.name} href={l.href ?? undefined} target="_blank" rel="noopener noreferrer" className="ss-wipe flex justify-between border-b border-ink/15 px-4 py-3 last:border-b-0">
                <span className="ss-display ss-cond text-lg">{l.name}</span>
                <ArrowUpRight className="ss-arrow text-primary" />
              </a>
            ))}
          </div>
        }
      >
        Notes from <Bar>the trenches.</Bar>
      </PageHero>

      <section className="border-b border-ink" data-section="articles">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <WritingBrowser posts={posts} />
        </div>
      </section>

      <CtaBand
        label="[ like what you read? ]"
        title={
          <>
            Let&apos;s build <Bar>something.</Bar>
          </>
        }
      />
    </>
  )
}
