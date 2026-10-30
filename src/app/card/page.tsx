import type { Metadata } from 'next'
import Link from 'next/link'

import CardLinks from '@/components/card/CardLinks'
import BareShell from '@/components/layout/BareShell'
import Button from '@/components/ui/Button'
import { Download, TripleArrow } from '@/components/ui/Decor'
import IdCardFace from '@/components/ui/IdCardFace'
import { getSite } from '@/lib/content'
import { routes } from '@/lib/routes'

export const metadata: Metadata = {
  title: 'Business card',
  description: 'Save my contact details, book a call or find me online.',
}

// A phone-first page to share on its own, so it sits outside the (site) header and footer
export default async function BusinessCardPage() {
  const site = await getSite()
  const { social } = site
  const links = [
    { name: 'Email', href: `mailto:${site.email}` },
    { name: 'LinkedIn', href: social.linkedin },
    { name: 'GitHub', href: social.github },
    { name: 'X', href: social.x },
  ].flatMap(({ name, href }) => (href ? [{ name, href }] : []))

  return (
    <BareShell>
      <main id="main" className="mx-auto w-full max-w-[400px] space-y-3 px-4 py-6">
        <h1 className="sr-only">{site.name}</h1>
        <article className="border border-ink bg-paper p-3">
          <IdCardFace name={site.name} role={site.role} label="Business card" index="01/01" />
        </article>
        <div className="grid grid-cols-2 gap-2">
          <Button href={routes.cardContact} download size="xs" icon={<Download />}>
            Save contact
          </Button>
          {social.calendarBooking && (
            <Button href={social.calendarBooking} external variant="ink" size="xs">
              Book a call
            </Button>
          )}
        </div>
        <CardLinks links={links} copyable={{ name: 'Discord', value: site.discordUsername }} />
        <Link href={routes.home} className="ss-chev-btn block py-2 text-center font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline">
          See my full portfolio <TripleArrow />
        </Link>
      </main>
    </BareShell>
  )
}
