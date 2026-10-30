'use client'

import { useEffect, useState } from 'react'

import { Check, Copy } from '@/components/ui/Decor'

/** A contact card for channels without a useful link: clicking copies the username. */
export default function CopyChannel({ name, value }: { name: string; value: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      // Clipboard access denied: the username stays on the card to copy by hand
    }
  }

  return (
    <button type="button" onClick={copy} aria-label={`Copy ${name} username ${value}`} className="ss-wipe block bg-paper p-6 text-left">
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
