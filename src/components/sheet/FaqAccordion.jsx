import React from 'react'

/**
 * Numbered accordion of { question, answer } items. Answers are trusted HTML authored in
 * src/data/faq.json (rendered the same way as the original FAQ component).
 */
function FaqAccordion({ questions, openFirst = true }) {
  return (
    <div className="border-t border-ink" data-reveal="rows">
      {questions.map((q, i) => (
        <details key={q.question} className="ss-faq group border-b border-ink" open={openFirst && i === 0}>
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
