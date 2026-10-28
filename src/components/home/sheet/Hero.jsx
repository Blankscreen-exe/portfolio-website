import React from 'react'
import { Link } from 'react-router-dom'

import appConstants from '../../../constants/appConstants'
import homeContent from '../../../data/homeContent.json'
import metrics from '../../../data/metrics.json'
import { Scramble, CountUp, parseMetric } from '../../../helpers/sheetMotion'
import CardStack from './CardStack'

function Hero() {
  const strip = homeContent.metricIndexes.map((i) => metrics[i]).filter(Boolean)

  return (
    <section className="border-b border-ink">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-12 pt-14 md:px-8 lg:grid-cols-12 lg:gap-10 lg:pt-24">
        <div className="lg:col-span-8">
          <div className="ss-label" data-reveal="up"><Scramble text={homeContent.hero.label} /></div>
          <h1 className="ss-display mt-6 text-[13vw] sm:text-7xl lg:text-[96px] xl:text-[104px]">
            <span className="block" data-reveal="focus" style={{ '--i': 1 }}>I build software</span>
            <span className="block" data-reveal="focus" style={{ '--i': 2 }}>
              that <span className="ss-bar">runs your</span><br /><span className="ss-bar">business.</span>
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ash" data-reveal="up" style={{ '--i': 5 }}>
            {homeContent.hero.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3" data-reveal="up" style={{ '--i': 6 }}>
            <Link to={`${appConstants.routes.home}#contact`} className="ss-magnet ss-chev-btn inline-block bg-ink px-6 py-3.5 font-jet text-xs font-bold uppercase tracking-[.14em] text-stock transition-[transform] duration-300">
              Start a project <span className="ss-chev">↗</span>
            </Link>
            <a href="#work" className="ss-magnet ss-chev-btn inline-block border-2 border-ink px-6 py-3 font-jet text-xs font-bold uppercase tracking-[.14em] transition-colors duration-300 hover:bg-ink hover:text-stock">
              See the work <span className="ss-chev">▾</span>
            </a>
          </div>
        </div>

        <CardStack />
      </div>

      {/* Spec strip */}
      <div className="mx-auto max-w-7xl px-5 pb-14 md:px-8">
        <div className="grid grid-cols-2 border border-ink bg-paper md:grid-cols-4" data-reveal="rows">
          {strip.map((m, i) => {
            const { prefix, number, suffix } = parseMetric(m.value)
            const last = i === strip.length - 1
            return (
              <div
                key={m.label}
                className={[
                  'px-5 py-4',
                  // 2 columns on mobile, 4 from md: right borders between cells, none on the last
                  i % 2 === 0 ? 'border-r border-ink' : !last ? 'md:border-r md:border-ink' : '',
                  i < 2 ? 'border-b border-ink md:border-b-0' : '',
                  last ? 'bg-primary text-onprimary' : '',
                ].join(' ')}
              >
                <div className="ss-display text-4xl">
                  {prefix}{number === null ? '' : <CountUp to={number} />}{suffix}
                </div>
                <div className={`ss-label mt-1 ${last ? '!text-onprimary' : ''}`}>{m.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Hero
