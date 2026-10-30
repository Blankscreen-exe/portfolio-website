'use client'

import { ArrowUpRight, Check, Copy } from '@/components/ui/Decor'
import { useCopy } from '@/hooks/useCopy'

type Props = {
  links: { name: string; href: string }[]
  /** A channel without a useful link: its cell copies the value instead */
  copyable: { name: string; value: string }
}

const cell = 'ss-wipe flex min-w-0 items-center justify-between gap-2 bg-paper p-3 text-left font-jet text-[11px] font-bold uppercase tracking-[.1em]'

/** The compact grid of ways to reach me on the business card. */
export default function CardLinks({ links, copyable }: Props) {
  const { copied, copy } = useCopy()

  return (
    <div className="grid grid-cols-2 gap-px border border-ink bg-ink">
      {links.map((l) => (
        <a key={l.name} href={l.href} target={l.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" className={cell}>
          {l.name} <ArrowUpRight className="ss-arrow text-primary" />
        </a>
      ))}
      <button type="button" onClick={() => copy(copyable.value)} aria-label={`Copy ${copyable.name} username ${copyable.value}`} className={`${cell} col-span-2`}>
        <span aria-live="polite">{copied ? 'Copied!' : `${copyable.name}: ${copyable.value}`}</span>
        {copied ? <Check className="text-primary" /> : <Copy className="text-primary" />}
      </button>
    </div>
  )
}
