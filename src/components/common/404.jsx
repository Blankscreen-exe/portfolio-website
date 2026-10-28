import React from 'react'
import { Link } from 'react-router-dom'

// Constants
import appConstants from '../../constants/appConstants'

// Spec-sheet 404: offers the two places a lost visitor most likely wanted
function Error404() {
  return (
    <section className="border-b border-ink" data-section="404">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-32">
        <div className="ss-label">[ error 404 / sheet not found ]</div>
        <h1 className="ss-display mt-6 text-[22vw] leading-[.8] sm:text-[180px]" data-reveal="focus">
          4<span className="ss-bar">0</span>4
        </h1>
        <p className="mt-8 max-w-xl text-lg text-ash">This page doesn&apos;t exist, or it moved during the redesign. Try one of these instead.</p>
        <div className="mt-10 grid max-w-3xl gap-px border border-ink bg-ink sm:grid-cols-3">
          {[
            { name: 'Home', to: appConstants.routes.home },
            { name: 'See my work', to: appConstants.routes.projects },
            { name: 'Contact me', to: appConstants.routes.contacts },
          ].map((l) => (
            <Link key={l.name} to={l.to} className="ss-wipe flex justify-between bg-paper px-5 py-5">
              <span className="ss-display ss-cond text-2xl">{l.name}</span><span className="ss-arrow font-jet text-primary">↗</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Error404
