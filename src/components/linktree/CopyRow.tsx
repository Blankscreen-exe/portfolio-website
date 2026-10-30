'use client'

import { Check, Copy } from '@/components/ui/Decor'
import { useCopy } from '@/hooks/useCopy'
import { nameClass, rowClass } from './LinkRow'

type Props = { title: string; value: string; featured: boolean }

/** A row for a channel without a useful link: tapping copies the value, which stays visible. */
export default function CopyRow({ title, value, featured }: Props) {
  const { copied, copy } = useCopy()
  const Icon = copied ? Check : Copy

  return (
    <button type="button" onClick={() => copy(value)} aria-label={`Copy ${title}: ${value}`} className={rowClass}>
      <span className="flex min-w-0 flex-wrap items-baseline gap-x-4">
        <span className={`${nameClass} ${featured ? 'text-primary' : ''}`}>{title}</span>
        <span className="ss-dim-on-ink font-jet text-[11px] md:text-sm" aria-live="polite">
          {copied ? 'Copied!' : value}
        </span>
      </span>
      <Icon className="shrink-0 text-xl text-primary md:text-3xl" />
    </button>
  )
}
