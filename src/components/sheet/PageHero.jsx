import React from 'react'
import { Scramble } from '../../helpers/sheetMotion'

/**
 * Top of an inner page: `[ label ]`, a big heading (use <Bar> for accent words),
 * an optional intro paragraph and an optional right-hand slot.
 */
function PageHero({ label, children, intro, aside, section }) {
  return (
    <section className="border-b border-ink" data-section={section}>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-14 md:px-8 lg:grid-cols-12 lg:pt-20">
        <div className={aside ? 'lg:col-span-8' : 'lg:col-span-10'}>
          <div className="ss-label" data-reveal="up"><Scramble text={label} /></div>
          <h1 className="ss-display mt-6 text-[12vw] sm:text-7xl lg:text-[88px]" data-reveal="focus" style={{ '--i': 1 }}>{children}</h1>
          {intro && (
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ash" data-reveal="up" style={{ '--i': 4 }}>{intro}</p>
          )}
        </div>
        {aside && <div className="self-end lg:col-span-4" data-reveal="up" style={{ '--i': 3 }}>{aside}</div>}
      </div>
    </section>
  )
}

export default PageHero
