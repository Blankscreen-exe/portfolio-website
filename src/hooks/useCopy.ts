'use client'

import { useEffect, useState } from 'react'

/** Copies text to the clipboard; `copied` stays true for 2 seconds so the UI can confirm it. */
export function useCopy() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      // Clipboard access denied: callers keep the text on screen to copy by hand
    }
  }

  return { copied, copy }
}
