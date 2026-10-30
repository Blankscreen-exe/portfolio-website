import Button from '@/components/ui/Button'
import CountUp from '@/components/ui/CountUp'
import { ChevronDown } from '@/components/ui/Decor'
import Scramble from '@/components/ui/Scramble'
import type { Home, Site } from '@/lib/content'
import { parseMetric } from '@/lib/format'
import { routes } from '@/lib/routes'
import { stagger } from '@/lib/style'
import CardStack from './CardStack'

export default function Hero({ home, site }: { home: Home; site: Site }) {
  // Only the stats marked for the strip, in CMS order; the first also appears on the hero card
  const metrics = home.metrics.filter((m) => m.showInStrip)

  return (
    <section className="border-b border-ink">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-12 px-5 pb-12 pt-14 md:px-8 lg:grid-cols-12 lg:gap-10 lg:pt-24">
        <div className="lg:col-span-8">
          <div className="ss-label" data-reveal="up">
            <Scramble text={home.heroLabel} />
          </div>
          <h1 className="ss-display mt-6 text-[13vw] sm:text-7xl lg:text-[96px] xl:text-[104px]">
            <span className="block" data-reveal="focus" style={stagger(1)}>
              I build software
            </span>
            <span className="block" data-reveal="focus" style={stagger(2)}>
              that <span className="ss-bar">runs your</span>
              <br />
              <span className="ss-bar">business.</span>
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ash" data-reveal="up" style={stagger(5)}>
            {home.heroIntro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3" data-reveal="up" style={stagger(6)}>
            <Button href="#contact" variant="ink" attention="pop">
              Start a project
            </Button>
            <Button href={`${routes.home}#work`} variant="outline" shadow icon={<ChevronDown className="ss-chev" />}>
              See the work
            </Button>
          </div>
        </div>

        <CardStack industries={home.industries} whyMe={home.whyMe} delivered={metrics[0]} name={site.name} role={site.role} />
      </div>

      {/* Stats strip: 2 columns on mobile, 4 from md */}
      <div className="mx-auto max-w-7xl px-5 pb-14 md:px-8">
        <div className="grid grid-cols-2 gap-px border border-ink bg-ink md:grid-cols-4" data-reveal="rows">
          {metrics.map((m, i) => {
            const { prefix, number, suffix } = parseMetric(m.value)
            const accent = i === metrics.length - 1
            return (
              <div key={m.label} className={`px-5 py-4 ${accent ? 'bg-primary text-onprimary' : 'bg-paper'}`}>
                <div className="ss-display text-4xl">
                  {prefix}
                  {number !== null && <CountUp to={number} />}
                  {suffix}
                </div>
                <div className={`ss-label mt-1 ${accent ? '!text-onprimary' : ''}`}>{m.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
