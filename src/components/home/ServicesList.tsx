import Link from 'next/link'

import SectionHeading, { Bar } from '@/components/ui/SectionHeading'
import type { Home } from '@/lib/content'
import { routes } from '@/lib/routes'

export default function ServicesList({ services }: { services: Home['services'] }) {
  return (
    <section id="services" data-section="01 / services" className="scroll-mt-16 border-b border-ink">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <SectionHeading label="[ 01 / services ]">
          How I can <Bar>help.</Bar>
        </SectionHeading>

        <div className="mt-12 border-t border-ink" data-reveal="rows">
          {services.map((s, i) => (
            <Link key={s.title} href={routes.service(s.serviceIndex ?? 0)} className="ss-wipe grid items-baseline gap-2 border-b border-ink/15 px-2 py-6 md:grid-cols-12">
              <span className="ss-dim font-jet text-xs md:col-span-1">{String.fromCharCode(65 + i)}</span>
              <h3 className="ss-display ss-cond text-3xl md:col-span-4">{s.title}</h3>
              <p className="ss-dim md:col-span-6">{s.description}</p>
              <span className="hidden text-right font-jet text-primary md:col-span-1 md:block">
                <span className="ss-arrow">↗</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8" data-reveal="up">
          <Link href={routes.services} className="ss-chev-btn font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline">
            All services &amp; common questions <span className="ss-chev">▸▸▸</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
