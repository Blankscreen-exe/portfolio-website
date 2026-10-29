'use client'

import { useMemo } from 'react'

import { clampPage, pageCount, pageSlice } from '@/lib/pagination'
import { useQueryParams } from './useQueryParams'

/**
 * URL-backed pagination for a list that's already been filtered:
 * reads ?page=, clamps it to the valid range, and returns the visible slice.
 */
export function usePagedQuery<T>(items: readonly T[], pageSize: number) {
  const [params, update] = useQueryParams()
  const requested = Number(params.get('page') ?? 1)
  const page = clampPage(requested, items.length, pageSize)

  return {
    page,
    pageCount: pageCount(items.length, pageSize),
    visible: useMemo(() => pageSlice(items, page, pageSize), [items, page, pageSize]),
    params,
    update,
    /** Change page (page 1 is left out of the URL) */
    goTo: (p: number) => update({ page: p <= 1 ? null : p }),
  }
}
