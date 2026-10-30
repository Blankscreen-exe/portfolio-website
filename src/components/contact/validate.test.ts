import { describe, expect, it } from 'vitest'
import { validate } from './ContactForm'

const valid = { fullName: 'Ada', email: 'ada@example.com', topic: '', message: 'Hello' }

describe('contact form validation', () => {
  it('accepts a complete form once the captcha has passed', () => {
    expect(validate(valid, true)).toEqual({})
  })

  it('flags each missing field', () => {
    expect(validate({ ...valid, fullName: ' ', email: 'nope', message: '' }, false)).toEqual({
      fullName: 'Required',
      email: 'Enter a valid email',
      message: 'Required',
      captcha: 'Please complete the check below',
    })
  })

  it('does not require a topic', () => {
    expect(validate({ ...valid, topic: '' }, true)).toEqual({})
  })
})
