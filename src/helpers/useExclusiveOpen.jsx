import { useState } from 'react'

/**
 * One-open-at-a-time behaviour for a list of <details> elements.
 * Spread `itemProps(i)` onto each <details>: opening one closes the others.
 */
export default function useExclusiveOpen(initialIndex = -1) {
  const [openIndex, setOpenIndex] = useState(initialIndex)

  // The browser flips `open` on click; mirror it into state so the previous item closes.
  // Closing events from items React itself just closed are ignored by the functional update.
  const onToggle = (i) => (e) => {
    const isOpen = e.currentTarget.open
    setOpenIndex((cur) => (isOpen ? i : cur === i ? -1 : cur))
  }

  return (i) => ({ open: openIndex === i, onToggle: onToggle(i) })
}
