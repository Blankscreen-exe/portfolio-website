import Link from 'next/link'

import SiteShell from '@/components/layout/SiteShell'
import { routes } from '@/lib/routes'

export const metadata = { title: 'Page not found' }

// The root not-found renders outside the (site) group, so it brings its own shell
export default function NotFound() {
  const links = [
    { name: 'Home', href: routes.home },
    { name: 'See my work', href: routes.work },
    { name: 'Contact me', href: routes.contact },
  ]
  return (
    <SiteShell>
      <section className="border-b border-ink" data-section="404">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-32">
          <div className="ss-label">[ error 404 / sheet not found ]</div>
          <h1 className="ss-display mt-6 text-[22vw] leading-[.8] sm:text-[180px]" data-reveal="focus">
            4<span className="ss-bar">0</span>4
          </h1>
          <p className="mt-8 max-w-xl text-lg text-ash">This page doesn&apos;t exist, or it moved during the redesign. Try one of these instead.</p>
          <div className="mt-10 grid max-w-3xl gap-px border border-ink bg-ink sm:grid-cols-3">
            {links.map((l) => (
              <Link key={l.name} href={l.href} className="ss-wipe flex justify-between bg-paper px-5 py-5">
                <span className="ss-display ss-cond text-2xl">{l.name}</span>
                <span className="ss-arrow font-jet text-primary">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
