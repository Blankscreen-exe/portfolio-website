import React from 'react'

// Spec-sheet redesign sections, in funnel order:
// hook → relevance → proof → trust → reassurance → act.
// The previous home sections (Hero, ServicesOverview, Metrics, FeaturedProjects, TechStack,
// TestimonialsNew, Communities, PastClientReachout) are still in this folder, unused; their
// content now lives on the About and Contact pages.
import Hero from './sheet/Hero'
import ChevronStrip from '../sheet/ChevronStrip'
import Services from './sheet/Services'
import SelectedWork from './sheet/SelectedWork'
import Testimonials from './sheet/Testimonials'
import Process from './sheet/Process'
import AboutCard from './sheet/AboutCard'
import Faq from './sheet/Faq'
import Contact from './sheet/Contact'

// Scrolling to #hash targets (e.g. #contact) is handled site-wide in App.jsx
function Home() {
  return (
    <>
      <Hero />
      <ChevronStrip />
      <Services />
      <SelectedWork />
      <Testimonials />
      <Process />
      <AboutCard />
      <Faq />
      <Contact />
    </>
  )
}

export default Home
