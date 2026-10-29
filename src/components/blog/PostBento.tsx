import Image from 'next/image'

import type { Post } from '@/lib/content'
import { formatMonth, pad } from '@/lib/format'
import { stagger } from '@/lib/style'

const tile = 'ss-spot ss-finder group relative flex flex-col border border-ink'

function Meta({ post, n, className = '' }: { post: Post; n: number; className?: string }) {
  return (
    <div className={`flex justify-between font-jet text-[10px] uppercase tracking-[.15em] ${className}`}>
      <span>{pad(n)} · {formatMonth(post.published)}</span>
      <span className="opacity-0 transition-opacity group-hover:opacity-100">read ↗</span>
    </div>
  )
}

/**
 * The four latest posts as a bento:
 *   ┌──────────┬─────┬─────┐
 *   │          │  2  │  3  │
 *   │    1     ├─────┴─────┤
 *   │          │     4     │
 *   └──────────┴───────────┘
 * Single column on small screens.
 */
export default function PostBento({ posts }: { posts: Post[] }) {
  const [first, second, third, fourth] = posts
  if (!first) return null
  const external = { target: '_blank', rel: 'noopener noreferrer' } as const

  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-2">
      <a href={first.url} {...external} className={`${tile} bg-paper lg:col-span-6 lg:row-span-2`} data-reveal="up">
        <span className="ss-glow" />
        <div className="relative aspect-[16/9] overflow-hidden border-b border-ink lg:aspect-auto lg:flex-1">
          {first.thumbnail && <Image src={first.thumbnail} alt="" fill loading="eager" sizes="(min-width: 1024px) 50vw, 100vw" className="ss-shot object-cover" />}
          <span className="absolute left-0 top-0 bg-primary px-2 py-0.5 font-jet text-[10px] font-bold uppercase tracking-[.15em] text-onprimary">Latest</span>
        </div>
        <div className="relative z-[2] p-6 sm:p-8">
          <Meta post={first} n={1} className="text-ash" />
          <h2 className="ss-display mt-4 text-3xl leading-[.95] sm:text-4xl">{first.title}</h2>
          <p className="mt-3 text-ash">{first.description}</p>
        </div>
      </a>

      {second && (
        <a href={second.url} {...external} className={`${tile} justify-between bg-paper p-6 lg:col-span-3`} data-reveal="up" style={stagger(1)}>
          <span className="ss-glow" />
          <Meta post={second} n={2} className="relative z-[2] text-ash" />
          <div className="relative z-[2] mt-8">
            <h3 className="ss-display ss-cond text-2xl leading-tight">{second.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-ash">{second.description}</p>
          </div>
        </a>
      )}

      {third && (
        <a href={third.url} {...external} className={`${tile} justify-between bg-primary p-6 text-onprimary lg:col-span-3`} data-reveal="up" style={stagger(2)}>
          <Meta post={third} n={3} />
          <div className="mt-8">
            <h3 className="ss-display ss-cond text-2xl leading-tight">{third.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm opacity-80">{third.description}</p>
          </div>
        </a>
      )}

      {fourth && (
        <a href={fourth.url} {...external} className={`${tile} bg-ink text-stock sm:flex-row lg:col-span-6`} data-reveal="up" style={stagger(3)}>
          <div className="relative aspect-[16/9] shrink-0 overflow-hidden border-b border-stock/25 sm:aspect-auto sm:w-2/5 sm:border-b-0 sm:border-r">
            {fourth.thumbnail && <Image src={fourth.thumbnail} alt="" fill sizes="(min-width: 1024px) 20vw, 40vw" className="ss-shot object-cover" />}
          </div>
          <div className="flex flex-1 flex-col justify-between p-6">
            <Meta post={fourth} n={4} className="text-stock/60" />
            <div className="mt-6">
              <h3 className="ss-display ss-cond text-2xl leading-tight">{fourth.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-stock/70">{fourth.description}</p>
            </div>
          </div>
        </a>
      )}
    </div>
  )
}
