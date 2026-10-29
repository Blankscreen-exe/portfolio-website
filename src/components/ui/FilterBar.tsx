'use client'

type Props = {
  query: string
  onQuery: (value: string) => void
  placeholder: string
  /** Facet chips; `null` value means "All" */
  options?: { value: string; label: string; count?: number }[]
  selected?: string | null
  onSelect?: (value: string | null) => void
  label: string
}

/** Search box plus an optional row of filter chips, shared by the Writing and list pages. */
export default function FilterBar({ query, onQuery, placeholder, options, selected = null, onSelect, label }: Props) {
  return (
    <div className="border border-ink bg-paper" data-reveal="up">
      <label className={`flex items-center gap-3 px-5 py-3 ${options?.length ? 'border-b border-ink' : ''}`}>
        <span className="font-jet text-xs text-ash" aria-hidden="true">
          ⌕
        </span>
        <span className="sr-only">{label}</span>
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent p-0 font-inter text-sm outline-none placeholder:text-ash/70"
        />
      </label>
      {options && options.length > 0 && (
        <div className="flex flex-wrap gap-2 px-5 py-3" role="group" aria-label="Filter">
          {[{ value: null, label: 'All' }, ...options].map((o) => (
            <button
              key={o.value ?? 'all'}
              type="button"
              aria-pressed={selected === o.value}
              onClick={() => onSelect?.(o.value)}
              className={`border px-2.5 py-1 font-jet text-[11px] uppercase tracking-[.08em] transition-colors ${selected === o.value ? 'border-primary bg-primary text-onprimary' : 'border-ink/25 hover:border-primary'}`}
            >
              {o.label}
              {'count' in o && o.count !== undefined && <span className="ml-1 opacity-60">{o.count}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
