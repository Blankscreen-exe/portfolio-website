import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CopyRow from './CopyRow'

const click = () =>
  act(async () => {
    fireEvent.click(screen.getByRole('button'))
  })

describe('CopyRow', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('shows the value and names the action for screen readers', () => {
    render(<CopyRow title="Email" value="me@example.com" featured={false} />)
    expect(screen.getByText('me@example.com')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Copy Email: me@example.com' })).toBeTruthy()
  })

  it('copies the value and confirms', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    render(<CopyRow title="Email" value="me@example.com" featured={false} />)
    await click()
    expect(writeText).toHaveBeenCalledWith('me@example.com')
    expect(screen.getByText('Copied!')).toBeTruthy()
  })

  it('keeps the value on screen when the clipboard is denied', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } })
    render(<CopyRow title="Email" value="me@example.com" featured={false} />)
    await click()
    expect(screen.getByText('me@example.com')).toBeTruthy()
  })
})
