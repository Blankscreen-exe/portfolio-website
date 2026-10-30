import type { ReactNode } from 'react'
import MotionRoot from './MotionRoot'

/** The sheet and motion wiring without the header and footer, for pages shared on their own. */
export default function BareShell({ children }: { children: ReactNode }) {
  return (
    <div className="ss-sheet">
      {children}
      <MotionRoot />
    </div>
  )
}
