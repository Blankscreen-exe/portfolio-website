import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Spec-sheet redesign sections, in funnel order:
// hook → relevance → proof → trust → reassurance → act.
// The previous home sections (Hero, ServicesOverview, Metrics, FeaturedProjects, TechStack,
// TestimonialsNew, Communities, PastClientReachout) are still in this folder, unused, until
// their content is moved to the About / Contact pages.
import Hero from './sheet/Hero'
import ChevronStrip from '../sheet/ChevronStrip'
import Services from './sheet/Services'
import SelectedWork from './sheet/SelectedWork'
import Testimonials from './sheet/Testimonials'
import Process from './sheet/Process'
import AboutCard from './sheet/AboutCard'
import Faq from './sheet/Faq'
import Contact from './sheet/Contact'

function Home() {
  const location = useLocation()

  // Scroll to the hash target (e.g. #contact) when present, otherwise to the top.
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) {
        // small delay so layout/images settle before scrolling
        const id = setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
        return () => clearTimeout(id)
      }
    }
    window.scrollTo(0, 0)
  }, [location.hash, location.key])

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
