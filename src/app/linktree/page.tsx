import type { Metadata } from 'next'

import BareShell from '@/components/layout/BareShell'
import CopyRow from '@/components/linktree/CopyRow'
import LinkRow from '@/components/linktree/LinkRow'
import { Bar } from '@/components/ui/SectionHeading'
import { getLinktree, getSite } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Links',
  description: 'Every way to reach me and see my work, in one place.',
}

// The list is edited in Keystatic (Pages → Link tree)
export default async function LinktreePage() {
  const [site, links] = await Promise.all([getSite(), getLinktree()])
  const nameParts = site.name.split(' ')
  const lastName = nameParts.pop()

  return (
    <BareShell>
      <main id="main" className="ss-poster flex flex-col bg-ink text-stock">
        <header className="px-5 pb-5 pt-6 md:px-8 md:pt-8">
          <h1 className="ss-display text-[clamp(1.75rem,min(7vw,5.5vh),4rem)]" data-reveal="focus">
            {nameParts.join(' ')} <Bar>{lastName}</Bar>
          </h1>
          <p className="mt-3 font-jet text-[11px] text-stock/75 md:text-sm">{site.role}</p>
        </header>
        <nav aria-label="Links" className="flex flex-1 flex-col border-b border-stock/20">
          {links.map(({ title, action, target, featured }) =>
            action === 'copy' ? <CopyRow key={title} title={title} value={target} featured={featured} /> : <LinkRow key={title} title={title} target={target} featured={featured} />
          )}
        </nav>
      </main>
    </BareShell>
  )
}
