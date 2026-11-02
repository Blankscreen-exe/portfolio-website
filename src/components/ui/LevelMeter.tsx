import type { CSSProperties } from 'react'

const SEGMENTS = 10

type Props = {
  /** Boxes filled, out of 10 */
  level: number
  label: string
  /** Bob the label's letters up and down, in bolder primary colour text */
  wave?: boolean
  /** Position in a list, so stacked meters fill one after another */
  index?: number
}

/** A segmented loader plus a short label. The boxes are decorative: the label is what gets read out. */
export default function LevelMeter({ level, label, wave = false, index = 0 }: Props) {
  const labelClass = 'whitespace-nowrap font-jet text-[9px] uppercase tracking-[.1em] sm:text-[10px] sm:tracking-[.14em]'

  return (
    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 sm:gap-x-3.5">
      <span className="ss-level" aria-hidden="true" style={{ '--row': index } as CSSProperties}>
        {Array.from({ length: SEGMENTS }, (_, n) => (
          <span key={n} data-on={n < level || undefined} style={{ '--n': n } as CSSProperties} />
        ))}
      </span>
      {label &&
        (wave ? (
          <span className={`${labelClass} font-bold text-primary`}>
            {/* Screen readers get the whole label, not one letter at a time */}
            <span className="sr-only">{label}</span>
            <span className="ss-wave" aria-hidden="true">
              {Array.from(label, (char, i) => (
                <span key={i} style={{ '--i': i } as CSSProperties}>
                  {char}
                </span>
              ))}
            </span>
          </span>
        ) : (
          <span className={`${labelClass} text-ash`}>{label}</span>
        ))}
    </span>
  )
}
