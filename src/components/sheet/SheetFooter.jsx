import React from 'react'
import { Link } from 'react-router-dom'

import appConstants from '../../constants/appConstants'
import socialLinks from '../../data/socialLinks.json'
import Barcode from './Barcode'

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { name: 'Work', to: appConstants.routes.projects },
      { name: 'Services', to: appConstants.routes.services },
      { name: 'About', to: appConstants.routes.aboutMe },
      { name: 'Writing', to: appConstants.routes.blog },
      { name: 'Contact', to: appConstants.routes.contacts },
    ],
  },
  {
    title: 'More',
    links: [
      { name: 'Experience & awards', to: `${appConstants.routes.aboutMe}#experience` },
      { name: 'Certificates', to: appConstants.routes.experienceCertificates },
      { name: 'Books', to: appConstants.routes.listsBooks },
      { name: 'Bookmarks', to: appConstants.routes.listsBookmarks },
    ],
  },
  {
    title: 'Elsewhere',
    links: [
      { name: 'LinkedIn', href: socialLinks.linkedin },
      { name: 'GitHub', href: socialLinks.github },
      { name: 'Medium', href: socialLinks.medium },
      { name: 'Upwork', href: socialLinks.upwork },
      { name: 'Book a call', href: socialLinks.calendarBooking },
    ],
  },
]

function SheetFooter() {
  const linkClass = 'transition-colors hover:text-primary'

  return (
    <footer className="border-t border-ink">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="ss-label mb-3">[ end of sheet ]</div>
          <div className="ss-display text-4xl sm:text-5xl">Hammad Hassan</div>
          <p className="mt-3 font-jet text-xs uppercase tracking-[.12em] text-ash">Product Engineer &amp; Technical Consultant</p>
          <Barcode className="mt-6 h-8 w-56" />
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <div className="ss-label mb-4">[ {col.title} ]</div>
              <ul className="space-y-2.5 font-jet text-xs uppercase tracking-[.12em]">
                {col.links.map((l) => (
                  <li key={l.name}>
                    {l.to
                      ? <Link to={l.to} className={linkClass}>{l.name}</Link>
                      : <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>{l.name} ↗</a>}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-ink/15">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 font-jet text-[11px] uppercase tracking-[.16em] text-ash md:px-8">
          <span>© {new Date().getFullYear()} M. Hammad Hassan</span>
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className={linkClass}>
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}

export default SheetFooter
