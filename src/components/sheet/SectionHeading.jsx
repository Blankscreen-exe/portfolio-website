import React from 'react'
import { Scramble } from '../../helpers/sheetMotion'

/**
 * `[ 01 / services ]` label + big uppercase heading.
 * Wrap the accent words of `title` in <Bar>…</Bar> to get the cyan bar.
 */
export function Bar({ children }) {
  return <span className="ss-bar">{children}</span>
}

function SectionHeading({ label, children, className = '', size = 'text-5xl sm:text-6xl' }) {
  return (
    <div className={className}>
      <div className="ss-label" data-reveal="up">
        <Scramble text={label} />
      </div>
      <h2 className={`ss-display mt-4 ${size}`} data-reveal="focus">{children}</h2>
    </div>
  )
}

export default SectionHeading
