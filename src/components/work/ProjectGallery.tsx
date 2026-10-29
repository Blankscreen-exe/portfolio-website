'use client'

import Image from 'next/image'
import { useState } from 'react'

import { pad } from '@/lib/format'

/** Large screenshot with previous / next controls and a thumbnail strip. */
export default function ProjectGallery({ images, name }: { images: string[]; name: string }) {
  const [shot, setShot] = useState(0)
  const step = (d: number) => setShot((s) => (s + d + images.length) % images.length)

  if (!images.length) return <div className="ss-hatch aspect-[16/9] border border-ink" aria-hidden="true" />

  return (
    <>
      <div className="ss-shutter relative aspect-[16/9] border border-ink bg-stock" data-reveal="shutter">
        {/* key → the swap animation replays for each screenshot */}
        <Image key={shot} src={images[shot]} alt={`${name} screenshot ${shot + 1}`} fill loading={shot === 0 ? 'eager' : 'lazy'} sizes="(min-width: 1280px) 1216px, 100vw" className="ss-swap object-contain" />
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => step(-1)} className="absolute bottom-0 left-0 z-[3] border-r border-t border-ink bg-paper px-4 py-2 font-jet hover:bg-primary hover:text-onprimary" aria-label="Previous screenshot">
              ←
            </button>
            <button type="button" onClick={() => step(1)} className="absolute bottom-0 right-0 z-[3] border-l border-t border-ink bg-ink px-4 py-2 font-jet text-stock hover:bg-primary hover:text-onprimary" aria-label="Next screenshot">
              →
            </button>
            <span className="absolute bottom-0 left-1/2 z-[3] -translate-x-1/2 border-x border-t border-ink bg-paper px-3 py-2 font-jet text-[11px]">
              {pad(shot + 1)} / {pad(images.length)}
            </span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setShot(i)}
              aria-label={`Show screenshot ${i + 1}`}
              aria-current={i === shot}
              className={`relative h-16 w-24 shrink-0 border ${i === shot ? 'border-2 border-primary' : 'border-ink/30 opacity-60 grayscale hover:opacity-100 hover:grayscale-0'}`}
            >
              {/* the first thumbnail shares the hero image's src, so it loads eagerly too */}
              <Image src={src} alt="" fill loading={i === 0 ? 'eager' : 'lazy'} sizes="96px" className="object-cover object-top" />
            </button>
          ))}
        </div>
      )}
    </>
  )
}
