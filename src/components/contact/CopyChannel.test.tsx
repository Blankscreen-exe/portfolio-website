import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CopyChannel from './CopyChannel'

const click = () =>
  act(async () => {
    fireEvent.click(screen.getByRole('button'))
  })

describe('CopyChannel', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('copies the username and confirms', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    render(<CopyChannel name="Discord" value="someone" />)
    await click()
    expect(writeText).toHaveBeenCalledWith('someone')
    expect(screen.getByText('Copied!')).toBeTruthy()
  })

  it('keeps showing the username when the clipboard is denied', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } })
    render(<CopyChannel name="Discord" value="someone" />)
    await click()
    expect(screen.getByText('someone')).toBeTruthy()
  })
})
