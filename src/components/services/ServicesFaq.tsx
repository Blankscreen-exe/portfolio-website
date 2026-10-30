'use client'

import { type ReactNode, useState } from 'react'

import Accordion from '@/components/ui/Accordion'
import type { FaqItem } from '@/lib/content'
import { faqToItems } from '@/lib/faq'

type Group = { key: string; label: string; questions: readonly FaqItem[] }

/** FAQ with topic tabs ("Working with me" / "Mentorship"): heading + tabs on the left, answers on the right. */
export default function ServicesFaq({ heading, groups }: { heading: ReactNode; groups: Group[] }) {
  const [active, setActive] = useState(groups[0]?.key)
  const group = groups.find((g) => g.key === active) ?? groups[0]

  return (
    <div className="mx-auto grid grid-cols-1 max-w-7xl gap-12 px-5 py-20 md:px-8 lg:grid-cols-12">
      <div className="lg:col-span-4">
        {heading}
        <div className="mt-8 flex border border-ink" role="tablist" aria-label="Question topics" data-reveal="up">
          {groups.map((g, i) => (
            <button
              key={g.key}
              type="button"
              role="tab"
              aria-selected={g.key === group.key}
              onClick={() => setActive(g.key)}
              className={`flex-1 px-4 py-3 font-jet text-[11px] uppercase tracking-[.14em] transition-colors ${i ? 'border-l border-ink' : ''} ${g.key === group.key ? 'bg-primary text-onprimary' : 'hover:bg-stock'}`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
      <div className="lg:col-span-8">
        {/* key → switching tabs resets which question is open */}
        <Accordion key={group.key} items={faqToItems(group.questions)} initialOpen={0} numbered />
      </div>
    </div>
  )
}
