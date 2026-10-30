import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Button from './Button'

describe('Button', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        disconnect() {}
      }
    )
  })
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('renders a button without an href', () => {
    render(<Button>Send</Button>)
    expect(screen.getByRole('button', { name: 'Send' }).getAttribute('type')).toBe('button')
  })

  it('lets the caller set the button type', () => {
    render(<Button type="submit">Send</Button>)
    expect(screen.getByRole('button').getAttribute('type')).toBe('submit')
  })

  it('renders a link with an href', () => {
    render(<Button href="/contacts">Talk</Button>)
    const link = screen.getByRole('link', { name: 'Talk' })
    expect(link.getAttribute('href')).toBe('/contacts')
    expect(link.getAttribute('target')).toBeNull()
  })

  it('opens external links in a new tab', () => {
    render(
      <Button href="https://example.com" external>
        Visit
      </Button>
    )
    const link = screen.getByRole('link', { name: 'Visit' })
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    expect(link.hasAttribute('external')).toBe(false)
  })

  it('downloads files in the same tab', () => {
    render(
      <Button href="/card/contact.vcf" download>
        Save
      </Button>
    )
    const link = screen.getByRole('link', { name: 'Save' })
    expect(link.hasAttribute('download')).toBe(true)
    expect(link.getAttribute('target')).toBeNull()
  })

  it.each([
    ['pop', 'ss-pop'],
    ['brackets', 'ss-brackets'],
  ] as const)('switches to the %s animation with a prop', (attention, cls) => {
    render(<Button attention={attention}>Go</Button>)
    expect(screen.getByRole('button').classList.contains(cls)).toBe(true)
  })

  it('can have a still shadow without the pop', () => {
    render(<Button shadow>Go</Button>)
    const { classList } = screen.getByRole('button')
    expect(classList.contains('ss-shadow')).toBe(true)
    expect(classList.contains('ss-pop')).toBe(false)
  })

  it('has no animation by default', () => {
    render(<Button>Go</Button>)
    const { classList } = screen.getByRole('button')
    expect(classList.contains('ss-pop')).toBe(false)
    expect(classList.contains('ss-brackets')).toBe(false)
  })

  it('keeps a stable accessible name while scrambling', () => {
    render(<Button attention="scramble">Send message</Button>)
    expect(screen.getByRole('button').getAttribute('aria-label')).toBe('Send message')
  })

  it('can drop the default icon', () => {
    render(<Button icon={null}>Go</Button>)
    expect(screen.getByRole('button').querySelector('svg')).toBeNull()
  })
})
