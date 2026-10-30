'use client'

import { Check, Copy } from '@/components/ui/Decor'
import { useCopy } from '@/hooks/useCopy'

/** A contact card for channels without a useful link: clicking copies the username. */
export default function CopyChannel({ name, value }: { name: string; value: string }) {
  const { copied, copy } = useCopy()

  return (
    <button type="button" onClick={() => copy(value)} aria-label={`Copy ${name} username ${value}`} className="ss-wipe block bg-paper p-6 text-left">
      <span className="flex justify-between">
        <span className="ss-display ss-cond text-2xl">{name}</span>
        {copied ? <Check className="text-primary" /> : <Copy className="text-primary" />}
      </span>
      <span className="ss-dim mt-2 block font-jet text-xs" aria-live="polite">
        {copied ? 'Copied!' : value}
      </span>
    </button>
  )
}
