import { Fragment, type ReactNode } from 'react'
import { type Inline, parseMarkdown } from '@/lib/markdown'

function renderInline(nodes: Inline[]): ReactNode {
  return nodes.map((node, i) => {
    switch (node.type) {
      case 'text':
        return <Fragment key={i}>{node.value}</Fragment>
      case 'br':
        return <br key={i} />
      case 'strong':
        return <strong key={i}>{renderInline(node.children)}</strong>
      case 'em':
        return <em key={i}>{renderInline(node.children)}</em>
      case 'link': {
        const external = /^https?:/.test(node.href)
        return (
          <a key={i} href={node.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {renderInline(node.children)}
          </a>
        )
      }
    }
  })
}

/** Renders CMS text written in the small Markdown subset described in lib/markdown.ts. */
export default function RichText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`ss-rich ${className}`}>
      {parseMarkdown(text).map((block, i) => {
        if (block.type === 'p') return <p key={i}>{renderInline(block.children)}</p>
        const List = block.type
        return (
          <List key={i}>
            {block.items.map((item, j) => (
              <li key={j}>{renderInline(item)}</li>
            ))}
          </List>
        )
      })}
    </div>
  )
}
