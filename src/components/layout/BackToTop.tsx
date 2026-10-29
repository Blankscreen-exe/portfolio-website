'use client'

export default function BackToTop({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`uppercase tracking-[.16em] ${className ?? ''}`}>
      Back to top ↑
    </button>
  )
}
