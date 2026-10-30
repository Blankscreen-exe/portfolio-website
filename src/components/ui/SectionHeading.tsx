import type { ReactNode } from 'react'
import Scramble from './Scramble'

/** Accent words inside a heading become a solid cyan bar that wipes in on reveal. */
export function Bar({ children }: { children: ReactNode }) {
  return <span className="ss-bar">{children}</span>
}

type Props = {
  /** e.g. "[ 01 / services ]" */
  label: string
  children: ReactNode
  className?: string
  size?: string
  as?: 'h1' | 'h2'
}

/** `[ label ]` above a big uppercase heading; the label scrambles and the heading racks into focus. */
export default function SectionHeading({ label, children, className = '', size = 'text-[min(10.5vw,3rem)] sm:text-6xl', as: Heading = 'h2' }: Props) {
  return (
    <div className={className}>
      <div className="ss-label" data-reveal="up">
        <Scramble text={label} />
      </div>
      <Heading className={`ss-display mt-4 ${size}`} data-reveal="focus">
        {children}
      </Heading>
    </div>
  )
}
