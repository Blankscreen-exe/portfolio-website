import Link from 'next/link'
import { ArrowUpRight } from '@/components/ui/Decor'

/** Each row shares the free height equally, so the list always fills the page. */
export const rowClass = 'ss-wipe flex w-full flex-1 items-center justify-between gap-4 border-t border-stock/20 px-5 py-1.5 text-left md:px-8'

/** The big word; the size follows whichever is tighter, the screen's width or its height. */
export const nameClass = 'ss-display ss-cond text-[clamp(2rem,min(10vw,7.5vh),7rem)] leading-none'

type Props = { title: string; target: string; featured: boolean }

/** A row that opens a link: internal paths stay in the app, the rest are normal links. */
export default function LinkRow({ title, target, featured }: Props) {
  const content = (
    <>
      <span className={`${nameClass} ${featured ? 'text-primary' : ''}`}>{title}</span>
      <ArrowUpRight className={`ss-arrow shrink-0 text-xl text-primary md:text-3xl ${featured ? 'ss-nudge' : ''}`} />
    </>
  )

  if (target.startsWith('/')) {
    return (
      <Link href={target} className={rowClass}>
        {content}
      </Link>
    )
  }
  return (
    <a href={target} target="_blank" rel="noopener noreferrer" className={rowClass}>
      {content}
    </a>
  )
}
