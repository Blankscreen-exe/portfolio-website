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
 * Stroke icon drawn on a 12x12 grid. Sized in em, so it follows the surrounding text size, and
 * inherits the text colour. Pass ss-chev or ss-arrow for their hover movement.
 */
function LineIcon({ d, className = '' }: IconProps & { d: string }) {
  return (
    <svg className={`inline-block h-[1.05em] w-[1.05em] shrink-0 align-[-0.15em] ${className}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

export const ArrowUpRight = (props: IconProps) => <LineIcon d="M2 10 10 2M3.25 2H10v6.75" {...props} />
export const ArrowLeft = (props: IconProps) => <LineIcon d="M10.5 6h-9M5.25 2.25 1.5 6l3.75 3.75" {...props} />
export const ArrowRight = (props: IconProps) => <LineIcon d="M1.5 6h9M6.75 2.25 10.5 6l-3.75 3.75" {...props} />
export const Copy = (props: IconProps) => <LineIcon d="M4.25 4.25h6.25v6.25H4.25zM7.75 4.25V1.5H1.5v6.25h2.75" {...props} />
export const Check = (props: IconProps) => <LineIcon d="M2 6.5 4.75 9.25 10 3" {...props} />
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
