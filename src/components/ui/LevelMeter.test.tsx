import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import LevelMeter from './LevelMeter'

describe('LevelMeter', () => {
  afterEach(cleanup)

  it('fills as many of the 10 boxes as the level', () => {
    const { container } = render(<LevelMeter level={3} label="Beginner" />)
    expect(container.querySelectorAll('.ss-level > span')).toHaveLength(10)
    expect(container.querySelectorAll('.ss-level > span[data-on]')).toHaveLength(3)
    expect(screen.getByText('Beginner')).toBeTruthy()
  })

  it('splits a waving label into letters but keeps the whole label readable', () => {
    const { container } = render(<LevelMeter level={10} label="Very good" wave />)
    expect(container.querySelectorAll('.ss-wave > span')).toHaveLength(9)
    expect(container.querySelector('.ss-wave')?.getAttribute('aria-hidden')).toBe('true')
    expect(screen.getByText('Very good')).toBeTruthy()
  })

  it('hides the boxes from screen readers', () => {
    const { container } = render(<LevelMeter level={3} label="Beginner" />)
    expect(container.querySelector('.ss-level')?.getAttribute('aria-hidden')).toBe('true')
  })
})
