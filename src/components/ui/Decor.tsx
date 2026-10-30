// Decorative pieces of the spec-sheet look. Purely visual, so all are aria-hidden.

/** Moving cyan chevron band used between sections. */
export function ChevronStrip() {
  return (
    <div className="border-b border-ink py-2" aria-hidden="true">
      <div className="ss-conveyor" />
    </div>
  )
}

type IconProps = { className?: string }

/**
 * Icon drawn on a 12x12 grid. Sized in em, so it follows the surrounding text size, and
 * inherits the text colour. `solid` also fills the shape, leaving overlaps empty.
 * Pass ss-chev or ss-arrow for their hover movement.
 */
function LineIcon({ d, solid, className = '' }: IconProps & { d: string; solid?: boolean }) {
  return (
    <svg className={`inline-block h-[1.05em] w-[1.05em] shrink-0 align-[-0.15em] ${className}`} viewBox="0 0 12 12" fill={solid ? 'currentColor' : 'none'} fillRule="evenodd" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

export const ArrowUpRight = (props: IconProps) => <LineIcon d="M2 10 10 2M3.25 2H10v6.75" {...props} />
export const ArrowLeft = (props: IconProps) => <LineIcon d="M10.5 6h-9M5.25 2.25 1.5 6l3.75 3.75" {...props} />
export const ArrowRight = (props: IconProps) => <LineIcon d="M1.5 6h9M6.75 2.25 10.5 6l-3.75 3.75" {...props} />
export const Copy = (props: IconProps) => <LineIcon d="M4.25 4.25h6.25v6.25H4.25zM7.75 4.25V1.5H1.5v6.25h2.75" {...props} />
export const Check = (props: IconProps) => <LineIcon d="M2 6.5 4.75 9.25 10 3" {...props} />
export const ChevronRight = (props: IconProps) => <LineIcon d="M4.25 2 8.25 6 4.25 10" {...props} />
export const Plus = (props: IconProps) => <LineIcon d="M6 1.5v9M1.5 6h9" {...props} />
export const Cross = (props: IconProps) => <LineIcon d="M2.5 2.5l7 7M9.5 2.5l-7 7" {...props} />
export const Search = (props: IconProps) => <LineIcon d="M5.25 1.75a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM7.75 7.75 10.5 10.5" {...props} />
export const Pause = (props: IconProps) => <LineIcon d="M4 2.25v7.5M8 2.25v7.5" {...props} />
export const Play = (props: IconProps) => <LineIcon solid d="M3.75 2.25 9.25 6l-5.5 3.75z" {...props} />
export const CaretLeft = (props: IconProps) => <LineIcon solid d="M8 2.75 3.5 6 8 9.25z" {...props} />
export const Star = (props: IconProps) => <LineIcon solid d="M6 1.75 7.3 4.5l3 .4-2.2 2.05.55 2.95L6 8.45 3.35 9.9l.55-2.95L1.7 4.9l3-.4z" {...props} />
export const HalfCircle = (props: IconProps) => <LineIcon solid d="M6 1.25a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5zM6 1.25a4.75 4.75 0 0 0 0 9.5z" {...props} />
export const Download = (props: IconProps) => <LineIcon d="M6 1.5v7M2.75 5.25 6 8.5l3.25-3.25M1.5 10.75h9" {...props} />
export const ArrowUp = (props: IconProps) => <LineIcon d="M6 10.5V1.75M2.25 5.5 6 1.75 9.75 5.5" {...props} />
export const ChevronDown = (props: IconProps) => <LineIcon d="M2 4.25 6 8.25 10 4.25" {...props} />
export const RotateArrow = (props: IconProps) => <LineIcon d="M10.5 6A4.5 4.5 0 1 1 6 1.5c1.26 0 2.47.5 3.37 1.37L10.5 4M10.5 1.5V4H8" {...props} />

/** Three solid arrowheads for "see more" links. Inherits the link's colour; slides on hover inside .ss-chev-btn. */
export function TripleArrow() {
  return (
    <svg className="ss-chev ml-1 inline-block h-3.5 w-[30px] align-[-2px]" viewBox="0 0 30 14" fill="currentColor" aria-hidden="true">
      <path d="M0 0l9 7-9 7zM10 0l9 7-9 7zM20 0l9 7-9 7z" />
    </svg>
  )
}

/** Deterministic pseudo-random bar widths, so server and client render the same barcode. */
function barcodeBars(width: number, seed: number) {
  let s = seed
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280
  const bars: { x: number; w: number }[] = []
  for (let x = 0; x < width; ) {
    const w = [1.5, 1.5, 3, 6][Math.floor(rnd() * 4)]
    bars.push({ x, w })
    x += w + 2 + Math.floor(rnd() * 3)
  }
  return bars
}

/** "Data plate" barcode; the bars grow in when it scrolls into view. */
export function Barcode({ className = '', width = 224, height = 32, seed = 7 }: { className?: string; width?: number; height?: number; seed?: number }) {
  return (
    <svg className={`ss-barcode ${className}`} viewBox={`0 0 ${width} ${height}`} fill="currentColor" aria-hidden="true" data-reveal="barcode">
      {barcodeBars(width, seed).map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={height} style={{ transitionDelay: `${i * 18}ms` }} />
      ))}
    </svg>
  )
}
