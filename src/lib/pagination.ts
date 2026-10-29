// Pure pagination maths, shared by every paginated list (writing, books, bookmarks).

export const pageCount = (total: number, pageSize: number) => Math.max(1, Math.ceil(total / pageSize))

/** Bring any requested page (NaN, 0, too large…) into the valid 1…pageCount range. */
export function clampPage(page: number, total: number, pageSize: number): number {
  if (!Number.isFinite(page)) return 1
  return Math.min(Math.max(1, Math.floor(page)), pageCount(total, pageSize))
}

/** The slice of `items` shown on `page` (1-based). */
export function pageSlice<T>(items: readonly T[], page: number, pageSize: number): T[] {
  const p = clampPage(page, items.length, pageSize)
  return items.slice((p - 1) * pageSize, p * pageSize)
}

/**
 * Page numbers to render, with `null` marking a gap ("…").
 * Always shows the first and last page plus `siblings` pages either side of the current one:
 *   pageWindow(37, 63) → [1, null, 36, 37, 38, null, 63]
 */
export function pageWindow(current: number, total: number, siblings = 1): (number | null)[] {
  const pages = new Set([1, total])
  for (let p = current - siblings; p <= current + siblings; p++) if (p >= 1 && p <= total) pages.add(p)
  const sorted = [...pages].sort((a, b) => a - b)
  return sorted.flatMap((p, i) => {
    const prev = sorted[i - 1]
    if (prev === undefined || p === prev + 1) return [p]
    // a gap of exactly one page is shown as that page rather than "…"
    return p === prev + 2 ? [prev + 1, p] : [null, p]
  })
}
