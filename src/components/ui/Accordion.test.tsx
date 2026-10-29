import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Accordion from './Accordion'

const items = [
  { title: 'First', body: 'One' },
  { title: 'Second', body: 'Two' },
  { title: 'Third', body: 'Three' },
]
const button = (name: string) => screen.getByRole('button', { name })

describe('Accordion', () => {
  afterEach(cleanup)

  it('opens the initial item only', () => {
    render(<Accordion items={items} initialOpen={0} />)
    expect(button('First').getAttribute('aria-expanded')).toBe('true')
    expect(button('Second').getAttribute('aria-expanded')).toBe('false')
  })

  it('keeps only one item open at a time', () => {
    render(<Accordion items={items} initialOpen={0} />)
    fireEvent.click(button('Second'))
    expect(button('First').getAttribute('aria-expanded')).toBe('false')
    expect(button('Second').getAttribute('aria-expanded')).toBe('true')
  })

  it('closes the open item when it is clicked again', () => {
    render(<Accordion items={items} initialOpen={0} />)
    fireEvent.click(button('First'))
    expect(items.map((i) => button(i.title).getAttribute('aria-expanded'))).toEqual(['false', 'false', 'false'])
  })

  it('keeps closed panels out of the tab order', () => {
    render(<Accordion items={items} initialOpen={0} />)
    const panel = document.getElementById(button('Second').getAttribute('aria-controls')!)!
    expect(panel.hasAttribute('inert')).toBe(true)
  })
})
