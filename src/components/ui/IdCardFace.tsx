import ProfilePhoto from './ProfilePhoto'

const BARCODE: [number, number][] = [[0, 2], [4, 1], [7, 4], [13, 1], [16, 2], [21, 1], [24, 5], [31, 1], [34, 2], [38, 4], [44, 1], [47, 2], [51, 1], [54, 5], [61, 1], [63, 1]]

type Props = {
  name: string
  /** e.g. "Product Engineer & Technical Consultant": the first part becomes the big title */
  role: string
  /** Top strip, e.g. "ID card" and "01/03" */
  label: string
  index: string
}

/** The contents of the ID card: the hero's front card and the /card page. */
export default function IdCardFace({ name, role, label, index }: Props) {
  const [title, ...subtitle] = role.split(' & ')

  return (
    <>
      <div className="mb-2 flex justify-between font-jet text-[10px] uppercase tracking-widest text-ash">
        <span>{label}</span>
        <span>{index}</span>
      </div>
      <ProfilePhoto eager>
        <span className="absolute bottom-3 left-0 bg-ink px-2.5 py-1 font-jet text-[11px] font-bold uppercase tracking-[.14em] text-stock">{name}</span>
      </ProfilePhoto>
      <div className="ss-display ss-cond mt-4 text-[34px] leading-none">{title}</div>
      {subtitle.length > 0 && <div className="mt-1 font-jet text-xs text-ash">&amp; {subtitle.join(' & ')}</div>}
      <div className="mt-3 flex items-center justify-between border-t border-ink/15 pt-3">
        <span className="flex items-center gap-2 font-jet text-[11px] uppercase tracking-widest">
          <span className="ss-pulse inline-block h-2 w-2 bg-primary" />
          Available for work
        </span>
        <svg className="h-4 w-16 opacity-80" viewBox="0 0 64 16" fill="currentColor" aria-hidden="true">
          {BARCODE.map(([x, w]) => (
            <rect key={x} x={x} width={w} height={16} />
          ))}
        </svg>
      </div>
    </>
  )
}
