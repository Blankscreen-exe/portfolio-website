import type { ReactNode } from 'react'
import SiteShell from '@/components/layout/SiteShell'

// Every public page shares the sheet layout; /keystatic (the CMS) sits outside this group.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>
}
