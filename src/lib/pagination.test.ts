import { describe, expect, it } from 'vitest'
import { clampPage, pageCount, pageSlice, pageWindow } from './pagination'

describe('pageCount', () => {
  it('rounds up and never returns 0', () => {
    expect(pageCount(23, 8)).toBe(3)
    expect(pageCount(24, 8)).toBe(3)
    expect(pageCount(0, 8)).toBe(1)
  })
})

describe('clampPage', () => {
  it('keeps pages inside 1…pageCount', () => {
    expect(clampPage(0, 23, 8)).toBe(1)
    expect(clampPage(99, 23, 8)).toBe(3)
    expect(clampPage(2.7, 23, 8)).toBe(2)
  })
  it('treats garbage (e.g. ?page=abc) as page 1', () => {
    expect(clampPage(Number('abc'), 23, 8)).toBe(1)
  })
})

describe('pageSlice', () => {
  const items = Array.from({ length: 23 }, (_, i) => i + 1)
  it('returns the items for a page', () => {
    expect(pageSlice(items, 1, 8)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(pageSlice(items, 3, 8)).toEqual([17, 18, 19, 20, 21, 22, 23])
  })
  it('clamps out-of-range pages instead of returning nothing', () => {
    expect(pageSlice(items, 10, 8)).toEqual(pageSlice(items, 3, 8))
  })
})

describe('pageWindow', () => {
  it('shows every page when there are few', () => {
    expect(pageWindow(1, 3)).toEqual([1, 2, 3])
  })
  it('collapses distant pages into gaps', () => {
    expect(pageWindow(37, 63)).toEqual([1, null, 36, 37, 38, null, 63])
  })
  it('shows a single hidden page instead of a gap', () => {
    expect(pageWindow(4, 9)).toEqual([1, 2, 3, 4, 5, null, 9])
  })
  it('handles the edges', () => {
    expect(pageWindow(1, 63)).toEqual([1, 2, null, 63])
    expect(pageWindow(63, 63)).toEqual([1, null, 62, 63])
  })
})
