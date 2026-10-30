import Image from 'next/image'
import type { ReactNode } from 'react'

/** The profile photo used across the site: always grayscale, with the cyan shutter reveal, halftone loop and status tick. `children` sit on top of it. */
export default function ProfilePhoto({ eager = false, children }: { eager?: boolean; children?: ReactNode }) {
  return (
    <div className="ss-shutter" data-reveal="shutter">
      <div className="relative aspect-square border border-ink/15">
        <Image
          src="/profile_pic.png"
          alt="M. Hammad Hassan"
          fill
          loading={eager ? 'eager' : 'lazy'}
          sizes="(min-width: 1024px) 400px, 360px"
          className="ss-halftone-img object-cover contrast-[1.05] grayscale"
        />
        <div className="ss-halftone" aria-hidden="true" />
        <div className="ss-tick" aria-hidden="true" />
        {children}
      </div>
    </div>
  )
}
