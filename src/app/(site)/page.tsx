import ContactPanel from '@/components/contact/ContactPanel'
import Dossier from '@/components/home/Dossier'
import FaqSection from '@/components/home/FaqSection'
import Hero from '@/components/home/Hero'
import Process from '@/components/home/Process'
import SelectedWork from '@/components/home/SelectedWork'
import ServicesList from '@/components/home/ServicesList'
import Testimonials from '@/components/home/Testimonials'
import { ChevronStrip } from '@/components/ui/Decor'
import Scramble from '@/components/ui/Scramble'
import { Bar } from '@/components/ui/SectionHeading'
import { getFaq, getHome, getProjects, getSite, getTestimonials } from '@/lib/content'
import { fitText } from '@/lib/style'

// Sections follow the client's decision path: hook → relevance → proof → trust → reassurance → act.
export default async function HomePage() {
  const [home, site, projects, testimonials, faq] = await Promise.all([getHome(), getSite(), getProjects(), getTestimonials(), getFaq()])

  return (
    <>
      <Hero home={home} site={site} />
      <ChevronStrip />
      <ServicesList services={home.services} />
      <SelectedWork projects={projects.filter((p) => p.featured)} />
      <Testimonials items={testimonials} />
      <Process steps={home.process} />

      <section id="about" data-section="05 / about" className="scroll-mt-16 border-b border-ink">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="ss-label" data-reveal="up">
            <Scramble text="[ 05 / about ]" />
          </div>
          <div className="mt-6">
            <Dossier
              title={
                <div className="ss-fit">
                  <h2 className="ss-display ss-fit-text" style={fitText('M. Hammad Hassan', 'clamp(3rem, 6vw, 3.75rem)')}>
                    M. Hammad <Bar>Hassan</Bar>
                  </h2>
                </div>
              }
              paragraphs={home.aboutParagraphs}
              facts={home.aboutFacts}
              linkedin={site.social.linkedin}
            />
          </div>
        </div>
      </section>

      <FaqSection questions={faq.development.filter((q) => q.featured)} />
      <ContactPanel topics={home.contactTopics} linkedin={site.social.linkedin} bookingUrl={site.social.calendarBooking} email={site.email} />
    </>
  )
}
