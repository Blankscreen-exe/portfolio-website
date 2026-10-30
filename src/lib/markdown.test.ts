import { describe, expect, it } from 'vitest'
import { parseInline, parseMarkdown } from './markdown'

describe('parseInline', () => {
  it('parses bold, italic and links', () => {
    expect(parseInline('a **b** *c* [d](https://x.dev)')).toEqual([
      { type: 'text', value: 'a ' },
      { type: 'strong', children: [{ type: 'text', value: 'b' }] },
      { type: 'text', value: ' ' },
      { type: 'em', children: [{ type: 'text', value: 'c' }] },
      { type: 'text', value: ' ' },
      { type: 'link', href: 'https://x.dev', children: [{ type: 'text', value: 'd' }] },
    ])
  })

  it('turns single newlines into line breaks', () => {
    expect(parseInline('one\ntwo')).toEqual([{ type: 'text', value: 'one' }, { type: 'br' }, { type: 'text', value: 'two' }])
  })

  it('neutralises unsafe link targets', () => {
    expect(parseInline('[x](javascript:alert(1))')[0]).toMatchObject({ type: 'link', href: '#' })
  })
})

describe('parseMarkdown', () => {
  it('splits paragraphs on blank lines', () => {
    expect(parseMarkdown('First.\n\nSecond.').map((b) => b.type)).toEqual(['p', 'p'])
  })

  it('recognises ordered and bullet lists', () => {
    const [intro, ordered, bullets] = parseMarkdown('Steps:\n\n1. one\n2. two\n\n- a\n- b')
    expect(intro.type).toBe('p')
    expect(ordered).toMatchObject({ type: 'ol', items: [[{ type: 'text', value: 'one' }], [{ type: 'text', value: 'two' }]] })
    expect(bullets).toMatchObject({ type: 'ul' })
  })

  it('ignores extra whitespace and empty input', () => {
    expect(parseMarkdown('\n\n  \n')).toEqual([])
  })
})
