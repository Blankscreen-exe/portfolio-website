/**
 * A deliberately tiny Markdown subset for CMS text fields (FAQ answers, About page notes):
 *   paragraphs separated by blank lines, "1." / "-" lists, **bold**, *italic*, [text](url),
 *   and single line breaks.
 * It produces a small AST that RichText renders with React elements — no HTML strings,
 * so nothing is ever injected with dangerouslySetInnerHTML.
 */

export type Inline =
  | { type: 'text'; value: string }
  | { type: 'strong'; children: Inline[] }
  | { type: 'em'; children: Inline[] }
  | { type: 'link'; href: string; children: Inline[] }
  | { type: 'br' }

export type Block =
  | { type: 'p'; children: Inline[] }
  | { type: 'ol' | 'ul'; items: Inline[][] }

const INLINE = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)\s]+)\)/

export function parseInline(text: string): Inline[] {
  const out: Inline[] = []
  let rest = text
  while (rest) {
    const m = rest.match(INLINE)
    if (!m || m.index === undefined) {
      out.push(...withBreaks(rest))
      break
    }
    if (m.index > 0) out.push(...withBreaks(rest.slice(0, m.index)))
    if (m[1] !== undefined) out.push({ type: 'strong', children: parseInline(m[1]) })
    else if (m[2] !== undefined) out.push({ type: 'em', children: parseInline(m[2]) })
    else out.push({ type: 'link', href: safeHref(m[4]), children: parseInline(m[3]) })
    rest = rest.slice(m.index + m[0].length)
  }
  return out
}

function withBreaks(text: string): Inline[] {
  return text.split('\n').flatMap((part, i): Inline[] =>
    i === 0 ? (part ? [{ type: 'text', value: part }] : []) : [{ type: 'br' }, ...(part ? [{ type: 'text' as const, value: part }] : [])]
  )
}

// Only allow web, mail and in-site links
function safeHref(href: string): string {
  return /^(https?:\/\/|mailto:|\/|#)/i.test(href) ? href : '#'
}

const ORDERED = /^\d+\.\s+/
const BULLET = /^[-*]\s+/

export function parseMarkdown(source: string): Block[] {
  return source
    .replace(/\r/g, '')
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): Block => {
      const lines = chunk.split('\n')
      if (lines.every((l) => ORDERED.test(l))) return { type: 'ol', items: lines.map((l) => parseInline(l.replace(ORDERED, ''))) }
      if (lines.every((l) => BULLET.test(l))) return { type: 'ul', items: lines.map((l) => parseInline(l.replace(BULLET, ''))) }
      return { type: 'p', children: parseInline(chunk) }
    })
}
