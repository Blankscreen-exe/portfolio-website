import React, { useState } from 'react'

/**
 * Numbered accordion of { question, answer } items. Answers are trusted HTML authored in
 * src/data/faq.json (rendered the same way as the original FAQ component).
 * Only one item is open at a time: opening one closes the others.
 */
function FaqAccordion({ questions, openFirst = true }) {
  const [openIndex, setOpenIndex] = useState(openFirst ? 0 : -1)

  // The browser flips `open` on click; mirror it into state so the previous item closes.
  // Closing events from items React itself just closed are ignored by the functional update.
  const onToggle = (i) => (e) => {
    const isOpen = e.currentTarget.open
    setOpenIndex((cur) => (isOpen ? i : cur === i ? -1 : cur))
  }

  return (
    <div className="border-t border-ink" data-reveal="rows">
      {questions.map((q, i) => (
        <details key={q.question} className="ss-faq group border-b border-ink" open={openIndex === i} onToggle={onToggle(i)}>
          <summary className="flex items-start justify-between gap-6 py-5">
            <span className="flex gap-4">
              <span className="pt-1 font-jet text-xs text-ash">{String(i + 1).padStart(2, '0')}</span>
              <span className="ss-display ss-cond text-2xl group-hover:text-primary">{q.question}</span>
            </span>
            <span className="ss-faq-icon font-jet text-2xl leading-none text-primary" aria-hidden="true">+</span>
          </summary>
          <div className="ss-faq-body pb-6 pl-9 leading-relaxed text-ash" dangerouslySetInnerHTML={{ __html: q.answer }} />
        </details>
      ))}
    </div>
  )
}

export default FaqAccordion
