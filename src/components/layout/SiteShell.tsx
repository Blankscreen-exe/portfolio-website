import type { ReactNode } from 'react'

import { getSite } from '@/lib/content'
import MotionRoot from './MotionRoot'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'

/** The grid "sheet" every page sits on: header, page content, footer, plus the motion wiring. */
export default async function SiteShell({ children }: { children: ReactNode }) {
  const site = await getSite()
  return (
    <div className="ss-sheet">
      <SiteHeader name={site.name} availability={site.availability} />
      <main id="main">{children}</main>
      <SiteFooter site={site} />
      <MotionRoot />
    </div>
  )
}
