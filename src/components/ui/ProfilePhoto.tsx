import Image from 'next/image'

/** The profile photo used across the site: always grayscale, with the cyan shutter reveal and scan line. */
export default function ProfilePhoto({ eager = false }: { eager?: boolean }) {
  return (
    <div className="ss-shutter" data-reveal="shutter">
      <div className="relative aspect-square border border-ink/15">
        <div className="ss-scan" />
        <Image
          src="/profile_pic.png"
          alt="M. Hammad Hassan"
          fill
          loading={eager ? 'eager' : 'lazy'}
          sizes="(min-width: 1024px) 400px, 360px"
          className="object-cover contrast-[1.05] grayscale"
        />
      </div>
    </div>
  )
}
