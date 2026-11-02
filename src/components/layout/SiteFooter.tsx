import Link from 'next/link'

import { ArrowUpRight, Barcode } from '@/components/ui/Decor'
import type { Site } from '@/lib/content'
import { routes } from '@/lib/routes'
import BackToTop from './BackToTop'
import CurrentYear from './CurrentYear'

type FooterLink = { name: string; href: string; external?: boolean }

// Social links are optional in the CMS; drop the empty ones
const external = (links: { name: string; href: string | null }[]): FooterLink[] =>
  links.flatMap((l) => (l.href ? [{ name: l.name, href: l.href, external: true }] : []))

export default function SiteFooter({ site }: { site: Site }) {
  const { social } = site
  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: 'Explore',
      links: [
        { name: 'Work', href: routes.work },
        { name: 'Services', href: routes.services },
        { name: 'About', href: routes.about },
        { name: 'Writing', href: routes.writing },
        { name: 'Contact', href: routes.contact },
      ],
    },
    {
      title: 'More',
      links: [
        { name: 'Awards & talks', href: routes.awards },
        { name: 'Books', href: routes.books },
        { name: 'Bookmarks', href: routes.bookmarks },
        { name: 'Sketches', href: routes.sketches },
        { name: 'Business card', href: routes.card },
      ],
    },
    {
      title: 'Elsewhere',
      links: external([
        { name: 'LinkedIn', href: social.linkedin },
        { name: 'GitHub', href: social.github },
        { name: 'Hashnode', href: social.hashnode },
        { name: 'Book a call', href: social.calendarBooking },
      ]),
    },
  ]
  const linkClass = 'transition-colors hover:text-primary'

  return (
    <footer className="border-t border-ink">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-12 px-5 py-14 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="ss-label mb-3">[ end of sheet ]</div>
          <div className="ss-display text-4xl sm:text-5xl">{site.name.replace(/^M\.\s*/, '')}</div>
          <p className="mt-3 font-jet text-xs uppercase tracking-[.12em] text-ash">{site.role}</p>
          <Barcode className="mt-6 h-8 w-56" />
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <div className="ss-label mb-4">[ {col.title} ]</div>
              <ul className="space-y-2.5 font-jet text-xs uppercase tracking-[.12em]">
                {col.links.map((l) => (
                  <li key={l.name}>
                    {l.external ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        {l.name} <ArrowUpRight />
                      </a>
                    ) : (
                      <Link href={l.href} className={linkClass}>
                        {l.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-ink/15">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 font-jet text-[11px] uppercase tracking-[.16em] text-ash md:px-8">
          <span>
            © <CurrentYear builtIn={new Date().getFullYear()} /> {site.name}
          </span>
          <BackToTop className={linkClass} />
        </div>
      </div>
    </footer>
  )
}
