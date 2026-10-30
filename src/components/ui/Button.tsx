import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { ArrowUpRight } from './Decor'
import Scramble from './Scramble'

const VARIANTS = {
  primary: 'border-primary bg-primary text-onprimary hover:brightness-110',
  ink: 'border-ink bg-ink text-stock hover:opacity-90',
  outline: 'border-ink hover:bg-ink hover:text-stock',
}

// Every variant has the same 2px border, so a size is the same height in all of them
const SIZES = {
  /** Fits two side by side on the narrowest phones */
  xs: 'inline-block whitespace-nowrap px-2 py-3 text-center text-[11px] tracking-[.06em]',
  sm: 'inline-block px-6 py-3 text-xs tracking-[.14em]',
  md: 'inline-block px-6 py-3.5 text-xs tracking-[.16em]',
  lg: 'inline-block px-8 py-[18px] text-sm tracking-[.16em]',
  /** A full-width banner: children on the left, icon on the right */
  wide: 'flex items-center justify-between gap-6 p-6 md:px-8',
}

const ATTENTION = {
  pop: 'ss-shadow ss-pop',
  brackets: 'ss-brackets',
  scramble: '',
}

const SCRAMBLE_EVERY_MS = 5000

type Own = {
  variant?: keyof typeof VARIANTS
  size?: keyof typeof SIZES
  /** A looping animation that draws the eye. `scramble` needs plain text as its children. */
  attention?: keyof typeof ATTENTION
  /** A still hard shadow; `attention="pop"` already has one */
  shadow?: boolean
  /** Leans towards the cursor (see MotionRoot) */
  magnet?: boolean
  /** Defaults to an up-right arrow; pass null for none */
  icon?: ReactNode
  className?: string
  children: ReactNode
}

type LinkProps = Own & { href: string; external?: boolean } & Omit<ComponentProps<'a'>, keyof Own | 'href'>
type ActionProps = Own & { href?: undefined } & Omit<ComponentProps<'button'>, keyof Own>

/** The site's solid and outlined buttons. Renders a link when given `href`, otherwise a <button>. */
export default function Button({
  variant = 'primary',
  size = 'sm',
  attention,
  shadow = false,
  magnet = false,
  icon = <ArrowUpRight className="ss-chev" />,
  className = '',
  children,
  ...rest
}: LinkProps | ActionProps) {
  const classes = [
    'ss-chev-btn border-2 font-jet font-bold uppercase transition duration-300',
    VARIANTS[variant],
    SIZES[size],
    attention && ATTENTION[attention],
    shadow && 'ss-shadow',
    magnet && 'ss-magnet',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const scrambled = attention === 'scramble' && typeof children === 'string'
  const content = (
    <>
      {scrambled ? (
        // Scramble glyphs vary in width: the invisible copy holds the button's size still
        <span className="relative inline-block">
          <span className="invisible">{children}</span>
          <Scramble text={children} every={SCRAMBLE_EVERY_MS} className="absolute inset-0 overflow-clip whitespace-nowrap" />
        </span>
      ) : (
        children
      )}{' '}
      {icon}
    </>
  )
  // The scrambling text is only decoration: keep the name screen readers get stable
  const name = scrambled ? { 'aria-label': children } : {}

  if (rest.href === undefined) {
    return (
      <button type="button" {...name} {...rest} className={classes}>
        {content}
      </button>
    )
  }

  const { external, ...link } = rest
  // Files and other sites are plain links, not client-side navigation
  if (external || link.download !== undefined) {
    return (
      <a {...(external && { target: '_blank', rel: 'noopener noreferrer' })} {...name} {...link} className={classes}>
        {content}
      </a>
    )
  }
  return (
    <Link {...name} {...link} className={classes}>
      {content}
    </Link>
  )
}
