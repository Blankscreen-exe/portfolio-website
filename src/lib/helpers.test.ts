import { describe, expect, it } from 'vitest'
import { hasValue, topFacets } from './facets'
import { formatMonth, longestWord, pad, parseMetric } from './format'
import { firstSentence, matchesQuery, splitTitle, statusLabel } from './projects'

describe('format', () => {
  it('finds the longest unbreakable word in a title', () => {
    expect(longestWord("Entrepreneur's Business Simulator")).toBe(14)
    expect(longestWord('KIT')).toBe(3)
    expect(longestWord('')).toBe(0)
  })

  it('pads numbers to two digits', () => {
    expect(pad(3)).toBe('03')
    expect(pad(12)).toBe('12')
  })

  it('splits stats so the number can count up', () => {
    expect(parseMetric('20+')).toEqual({ prefix: '', number: 20, suffix: '+' })
    expect(parseMetric('~5')).toEqual({ prefix: '~', number: 5, suffix: '' })
    expect(parseMetric('99%')).toEqual({ prefix: '', number: 99, suffix: '%' })
    expect(parseMetric('n/a')).toEqual({ prefix: '', number: null, suffix: 'n/a' })
  })

  it('formats ISO dates as "Mon YYYY" regardless of time zone', () => {
    expect(formatMonth('2025-05-01')).toBe('May 2025')
    expect(formatMonth(null)).toBe('')
    expect(formatMonth('not a date')).toBe('')
  })
})

describe('projects', () => {
  it('splits "Name - Subtitle" titles', () => {
    expect(splitTitle('AMOS - AI Powered CRM System')).toEqual({ name: 'AMOS', subtitle: 'AI Powered CRM System' })
    expect(splitTitle('KIT')).toEqual({ name: 'KIT', subtitle: '' })
  })

  it('takes the first sentence of the first paragraph', () => {
    expect(firstSentence('One thing. Another thing.\n\nMore.')).toBe('One thing.')
    expect(firstSentence('No full stop')).toBe('No full stop')
  })

  it('labels status', () => {
    expect(statusLabel({ status: 'ongoing', liveUrl: 'https://x.dev' })).toBe('Live')
    expect(statusLabel({ status: 'ongoing', liveUrl: null })).toBe('Ongoing')
    expect(statusLabel({ status: 'finished', liveUrl: 'https://x.dev' })).toBe('Shipped')
  })

  it('searches title, description and tags case-insensitively', () => {
    const p = { title: 'Clinic Voice Agent', description: 'Books appointments', tags: ['Twilio'] }
    expect(matchesQuery(p, 'clinic')).toBe(true)
    expect(matchesQuery(p, 'APPOINT')).toBe(true)
    expect(matchesQuery(p, 'twilio')).toBe(true)
    expect(matchesQuery(p, 'django')).toBe(false)
    expect(matchesQuery(p, '  ')).toBe(true)
  })
})

describe('facets', () => {
  const posts = [{ tags: ['Python', 'AI'] }, { tags: ['python'] }, { tags: ['Go', 'python'] }]

  it('counts values case-insensitively, most common first', () => {
    expect(topFacets(posts, (p) => p.tags)).toEqual([
      { value: 'python', label: 'python', count: 3 },
      { value: 'ai', label: 'ai', count: 1 },
      { value: 'go', label: 'go', count: 1 },
    ])
  })

  it('respects the limit', () => {
    expect(topFacets(posts, (p) => p.tags, 1)).toHaveLength(1)
  })

  it('matches values case-insensitively', () => {
    expect(hasValue(['Python'], 'python')).toBe(true)
    expect(hasValue(['Go'], 'python')).toBe(false)
  })
})
