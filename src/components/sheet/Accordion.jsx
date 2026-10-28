import React, { useId, useState } from 'react'

/**
 * The site's one accordion. Only one item is open at a time, and panels slide open/closed
 * (grid-template-rows 0fr → 1fr, see .ss-acc-* in sheet.css).
 *
 * items:   [{ title, html }]  — `html` is trusted HTML authored in src/data/*.json
 * size:    'lg' (FAQ lists) | 'sm' (compact lists, e.g. About page)
 * numbered: prefix each title with 01, 02, …
 */
function Accordion({ items, initialOpen = -1, size = 'lg', numbered = false }) {
  const [openIndex, setOpenIndex] = useState(initialOpen)
  const uid = useId()
  const lg = size === 'lg'

  return (
    <div className="border-t border-ink" data-reveal="rows">
      {items.map((item, i) => {
        const open = openIndex === i
        const headId = `${uid}-h${i}`
        const panelId = `${uid}-p${i}`
        return (
          <div key={item.title} className={`ss-acc border-b ${lg ? 'border-ink' : 'border-ink/15'}`} data-open={open || undefined}>
            <h3>
              <button
                type="button"
                id={headId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? -1 : i)}
                className={`group flex w-full items-start justify-between gap-6 text-left ${lg ? 'py-5' : 'py-4'}`}
              >
                <span className="flex gap-4">
                  {numbered && <span className="pt-1 font-jet text-xs text-ash">{String(i + 1).padStart(2, '0')}</span>}
                  <span className={`ss-display ss-cond transition-colors group-hover:text-primary ${lg ? 'text-2xl' : 'text-xl'} ${open ? 'text-primary' : ''}`}>{item.title}</span>
                </span>
                <span className={`ss-acc-icon font-jet leading-none text-primary ${lg ? 'text-2xl' : 'text-xl'}`} aria-hidden="true">+</span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headId}
              className="ss-acc-panel"
              // keep closed panels out of the tab order / accessibility tree while they stay in the DOM for the animation
              inert={open ? undefined : ''}
            >
              <div>
                <div
                  className={`ss-acc-body ss-faq-body leading-relaxed text-ash ${lg ? 'pb-6' : 'pb-5'} ${numbered ? 'pl-9' : ''}`}
                  dangerouslySetInnerHTML={{ __html: item.html }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// FAQ data ({ question, answer }) → accordion items
export const faqItems = (questions) => questions.map((q) => ({ title: q.question, html: q.answer }))

export default Accordion
