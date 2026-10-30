/** Length of the longest word: the part of a title that can't wrap. */
export const longestWord = (text: string) => Math.max(0, ...text.split(/\s+/).map((word) => word.length))

/** 1 → "01" */
export const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Splits a stat like "20+", "~5" or "99%" into prefix / number / suffix so the number can
 * count up while the symbols stay put. Non-numeric values come back as a plain suffix.
 */
export function parseMetric(value: string): { prefix: string; number: number | null; suffix: string } {
  const m = String(value).match(/^(\D*)(\d+)(.*)$/)
  return m ? { prefix: m[1], number: Number(m[2]), suffix: m[3] } : { prefix: '', number: null, suffix: String(value) }
}

/** "2025-05-01" → "May 2025" */
export function formatMonth(isoDate: string | null | undefined): string {
  if (!isoDate) return ''
  const d = new Date(`${isoDate}T00:00:00Z`)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}
