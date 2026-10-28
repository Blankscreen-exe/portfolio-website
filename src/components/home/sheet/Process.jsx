import React, { useEffect, useRef } from 'react'

import homeContent from '../../../data/homeContent.json'
import SectionHeading, { Bar } from '../../sheet/SectionHeading'

// `label` / `section` let other pages reuse the block without the home page's numbering
function Process({ label = '[ 04 / how it works ]', section = '04 / how it works' }) {
  const sectionRef = useRef(null)
  const lineRef = useRef(null)

  // The connector above the steps fills as the section scrolls through the viewport
  useEffect(() => {
    const onScroll = () => {
      const r = sectionRef.current?.getBoundingClientRect()
      if (!r) return
      const p = Math.min(Math.max((window.innerHeight * 0.85 - r.top) / (r.height * 0.9), 0), 1)
      lineRef.current?.style.setProperty('--p', p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const steps = homeContent.process

  return (
    <section ref={sectionRef} id="process" data-section={section} className="border-b border-ink">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <SectionHeading label={label}>Three <Bar>steps.</Bar></SectionHeading>

        <div className="relative mt-12">
          <div className="absolute -top-3 left-0 right-0 hidden h-[3px] bg-ink/15 md:block" aria-hidden="true">
            <div ref={lineRef} className="ss-progress h-full bg-primary" />
          </div>
          <ol className="grid border border-ink md:grid-cols-3" data-reveal="rows">
            {steps.map((s, i) => (
              <li key={s.title} className={`bg-paper p-7 ${i < steps.length - 1 ? 'border-b border-ink md:border-b-0 md:border-r' : ''}`}>
                <div className="ss-display text-6xl text-primary">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="ss-display ss-cond mt-6 text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-ash">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default Process
