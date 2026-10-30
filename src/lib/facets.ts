export type Facet = { value: string; label: string; count: number }

/**
 * Most common values across items (e.g. tags), as filter options sorted by frequency.
 * Values are compared case-insensitively; ties keep first-seen order.
 */
export function topFacets<T>(items: readonly T[], getValues: (item: T) => readonly string[], limit = 10): Facet[] {
  const counts = new Map<string, number>()
  for (const item of items) {
    for (const raw of new Set(getValues(item).map((v) => v.toLowerCase()))) counts.set(raw, (counts.get(raw) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([value, count]) => ({ value, label: value, count }))
}

/** Case-insensitive check that an item carries a value. */
export const hasValue = (values: readonly string[], value: string) => values.some((v) => v.toLowerCase() === value.toLowerCase())
