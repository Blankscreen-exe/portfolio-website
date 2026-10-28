import React, { useMemo } from 'react'

// Decorative "data plate" barcode. A seeded generator keeps the pattern identical on
// every render; bars grow in when it scrolls into view (see .ss-barcode in sheet.css).
function Barcode({ className = '', width = 224, height = 32, seed = 7 }) {
  const bars = useMemo(() => {
    let s = seed
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280
    const out = []
    let x = 0
    while (x < width) {
      const w = [1.5, 1.5, 3, 6][Math.floor(rnd() * 4)]
      out.push({ x, w })
      x += w + 2 + Math.floor(rnd() * 3)
    }
    return out
  }, [width, seed])

  return (
    <svg className={`ss-barcode ${className}`} viewBox={`0 0 ${width} ${height}`} fill="currentColor" aria-hidden="true" data-reveal="barcode">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={height} style={{ transitionDelay: `${i * 18}ms` }} />
      ))}
    </svg>
  )
}

export default Barcode
