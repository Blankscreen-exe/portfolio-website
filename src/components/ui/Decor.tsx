// Decorative pieces of the spec-sheet look. Purely visual, so all are aria-hidden.

/** Moving cyan chevron band used between sections. */
export function ChevronStrip() {
  return (
    <div className="border-b border-ink py-2" aria-hidden="true">
      <div className="ss-conveyor" />
    </div>
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
