import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import type { Sketch } from '@/lib/content'
import SketchBrowser from './SketchBrowser'

const sketch = (i: number, category: Sketch['category']): Sketch => ({
  slug: `s${i}`,
  title: `Drawing ${i}`,
  image: `/images/sketches/s${i}/image.png`,
  alt: '',
  category,
  date: null,
  sortOrder: 0,
})
const mixed = (count: number) => Array.from({ length: count }, (_, i) => sketch(i, i % 2 ? 'scenery' : 'portrait'))

describe('SketchBrowser', () => {
  afterEach(() => {
    cleanup()
    window.history.replaceState(null, '', '/')
  })

  it('shows a message when there are no drawings', () => {
    render(<SketchBrowser sketches={[]} />)
    expect(screen.getByText('Sketches on the way.')).toBeTruthy()
  })

  it('leaves out the tabs for a short list', () => {
    render(<SketchBrowser sketches={mixed(9)} />)
    expect(screen.queryByRole('tablist')).toBeNull()
    expect(screen.getAllByRole('img')).toHaveLength(9)
  })

  it('leaves out the tabs when every drawing shares a category', () => {
    render(<SketchBrowser sketches={Array.from({ length: 12 }, (_, i) => sketch(i, 'portrait'))} />)
    expect(screen.queryByRole('tablist')).toBeNull()
  })

  it('filters by category and offers only categories that have drawings', () => {
    render(<SketchBrowser sketches={mixed(10)} />)
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual(['Everything (10)', 'Portraits (5)', 'Scenery (5)'])
    fireEvent.click(screen.getByRole('tab', { name: 'Portraits (5)' }))
    expect(screen.getAllByRole('img')).toHaveLength(5)
    expect(window.location.search).toBe('?show=portrait')
  })
})
