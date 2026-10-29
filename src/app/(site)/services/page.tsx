import type { Metadata } from 'next'

import Process from '@/components/home/Process'
import ServicesCarousel from '@/components/services/ServicesCarousel'
import ServicesFaq from '@/components/services/ServicesFaq'
import ServicesIndex from '@/components/services/ServicesIndex'
import CtaBand from '@/components/ui/CtaBand'
import PageHero from '@/components/ui/PageHero'
import SectionHeading, { Bar } from '@/components/ui/SectionHeading'
import { getFaq, getHome, getServices } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Product and AI engineering, rescuing struggling software, automation, consulting and mentorship.',
}

export default async function ServicesPage() {
  const [services, faq, home] = await Promise.all([getServices(), getFaq(), getHome()])

  return (
    <>
      <PageHero
        label="[ services ]"
        section="services"
        intro="Whether you're starting from an idea, adding AI to your business or rescuing software that's holding you back, here's how I can help. Every engagement starts with a conversation, not a contract."
        aside={<ServicesIndex titles={services.map((s) => s.title)} />}
      >
        What I can <Bar>do for you.</Bar>
      </PageHero>

      <ServicesCarousel services={services} />

      <Process steps={home.process} label="[ how it works ]" section="how it works" />

      <section id="faq" data-section="questions" className="scroll-mt-16 border-b border-ink bg-paper">
        <ServicesFaq
          heading={
            <SectionHeading label="[ questions ]">
              Common <Bar>questions.</Bar>
            </SectionHeading>
          }
          groups={[
            { key: 'development', label: 'Working with me', questions: faq.development },
            { key: 'mentorship', label: 'Mentorship', questions: faq.mentorship },
          ]}
        />
      </section>

      <CtaBand />
    </>
  )
}
