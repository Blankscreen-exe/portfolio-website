import React from 'react'

// The profile photo used across the site: always grayscale, with the cyan shutter reveal
// and scan line. Square; sized by its container.
function ProfilePhoto() {
  return (
    <div className="ss-shutter" data-reveal="shutter">
      <div className="relative">
        <div className="ss-scan" />
        <img src="/profile_pic.png" alt="M. Hammad Hassan" className="aspect-square w-full border border-ink/15 object-cover contrast-[1.05] grayscale" />
      </div>
    </div>
  )
}

export default ProfilePhoto
