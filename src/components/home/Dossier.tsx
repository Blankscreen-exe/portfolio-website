import Link from 'next/link'
import type { ReactNode } from 'react'

import type { Home } from '@/lib/content'
import { routes } from '@/lib/routes'

type Props = {
  title?: ReactNode
  paragraphs: readonly string[]
  facts: Home['aboutFacts']
  linkedin?: string | null
  /** Show the "More about me" link (hidden on the About page itself) */
  showMoreLink?: boolean
}

/** The "dossier" card: punch holes, a stamp that thumps in, a short bio and a facts table. */
export default function Dossier({ title, paragraphs, facts, linkedin, showMoreLink = true }: Props) {
  return (
    <div className="ss-shake relative border border-ink bg-paper py-10 pl-14 pr-6 sm:pr-8 md:pl-20 md:pr-12" data-reveal="up">
      <div className="ss-punch" aria-hidden="true" />
      <span className="ss-stamp right-8 top-8 hidden sm:block">Open to work</span>
      {title ?? <div className="ss-label">[ in short ]</div>}

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4 text-lg leading-relaxed text-ash">
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {showMoreLink && (
            <Link href={routes.about} className="ss-chev-btn inline-block pt-2 font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline">
              More about me <span className="ss-chev">▸▸▸</span>
            </Link>
          )}
        </div>
        <dl className="border-t border-ink font-jet text-xs" data-reveal="rows">
          {facts.map((f) => (
            <div key={f.label} className="flex gap-4 border-b border-ink/15 py-3">
              <dt className="ss-label w-28 shrink-0">{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
          {linkedin && (
            <div className="flex gap-4 py-3">
              <dt className="ss-label w-28 shrink-0">Profile</dt>
              <dd>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">
                  LinkedIn ↗
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}
