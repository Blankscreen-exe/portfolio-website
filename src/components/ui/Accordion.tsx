'use client'

import { useId, useState, type ReactNode } from 'react'
import { pad } from '@/lib/format'
import { Plus } from './Decor'
import RichText from './RichText'

export type AccordionItem = {
  title: string
  body: string
  /** Shown after the title. Titles get a minimum width so these line up down the list. */
  meta?: ReactNode
}

type Props = {
  items: AccordionItem[]
  /** Index open on first render, or -1 for none */
  initialOpen?: number
  /** 'lg' for FAQ lists, 'sm' for compact lists */
  size?: 'lg' | 'sm'
  /** Prefix titles with 01, 02, … */
  numbered?: boolean
}

/**
 * The site's one accordion. Only one item is open at a time, and panels slide open/closed
 * by animating grid-template-rows from 0fr to 1fr (see .ss-acc-* in globals.css).
 */
export default function Accordion({ items, initialOpen = -1, size = 'lg', numbered = false }: Props) {
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
                className={`group flex w-full justify-between text-left ${item.meta ? 'items-center gap-3' : 'items-start gap-6'} ${lg ? 'py-5' : 'py-4'}`}
              >
                <span className={`flex ${item.meta ? 'min-w-0 items-center gap-2.5 sm:gap-3.5' : 'gap-4'}`}>
                  {numbered && <span className="pt-1 font-jet text-xs text-ash">{pad(i + 1)}</span>}
                  <span className={`ss-display ss-cond transition-colors group-hover:text-primary ${lg ? 'text-2xl' : 'text-xl'} ${open ? 'text-primary' : ''} ${item.meta ? 'min-w-[5.25rem] sm:min-w-[6.5rem]' : ''}`}>
                    {item.title}
                  </span>
                  {item.meta}
                </span>
                <span className={`ss-acc-icon shrink-0 font-jet leading-none text-primary ${lg ? 'text-2xl' : 'text-xl'}`} aria-hidden="true">
                  <Plus />
                </span>
              </button>
            </h3>
            {/* Closed panels stay in the DOM for the slide, but `inert` keeps them out of the tab order */}
            <div id={panelId} role="region" aria-labelledby={headId} className="ss-acc-panel" inert={!open}>
              <div>
                <RichText text={item.body} className={`ss-acc-body leading-relaxed text-ash ${lg ? 'pb-6' : 'pb-5'} ${numbered ? 'pl-9' : ''}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
