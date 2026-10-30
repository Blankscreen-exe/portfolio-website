import { ArrowUpRight } from '@/components/ui/Decor'
import Scramble from '@/components/ui/Scramble'
import { Bar } from '@/components/ui/SectionHeading'
import { pad } from '@/lib/format'
import ContactForm from './ContactForm'

const NEXT_STEPS = [
  'I read your message and reply, usually within a day.',
  'We have a short call to understand what you need.',
  'You get a clear plan and quote before any work starts.',
]

type Props = {
  topics: readonly string[]
  linkedin?: string | null
  bookingUrl?: string | null
  email: string
  label?: string
  section?: string
  id?: string
  headingAs?: 'h1' | 'h2'
}

/** Inverted (ink) panel with the contact form. Used on the home page and the Contact page. */
export default function ContactPanel({ topics, linkedin, bookingUrl, email, label = '[ 07 / contact ]', section = '07 / contact', id = 'contact', headingAs: Heading = 'h2' }: Props) {
  return (
    <section id={id} data-section={section} className="scroll-mt-16 bg-ink text-stock transition-colors duration-500">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-12 px-5 py-20 md:px-8 lg:grid-cols-2">
        <div>
          <div className="ss-label !text-stock/60" data-reveal="up">
            <Scramble text={label} />
          </div>
          <Heading className="ss-display mt-4 text-6xl sm:text-7xl" data-reveal="focus">
            Let&apos;s <Bar>talk.</Bar>
          </Heading>
          <p className="mt-6 max-w-md text-lg text-stock/75" data-reveal="up">
            A sentence or two is enough, no technical details needed.
          </p>

          <div className="mt-10 max-w-md" data-reveal="up">
            <div className="ss-label !text-stock/60">[ what happens next ]</div>
            <ol className="mt-4 border-t border-stock/25" data-reveal="rows">
              {NEXT_STEPS.map((step, i) => (
                <li key={step} className="flex gap-4 border-b border-stock/25 py-3 text-sm">
                  <span className="font-jet text-xs text-primary">{pad(i + 1)}</span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="mt-8">
              <div className="ss-label !text-stock/60">[ or email me ]</div>
              <a href={`mailto:${email}`} className="mt-2 inline-block font-jet text-sm font-bold text-primary hover:underline sm:text-base">
                {email}
              </a>
            </div>
            {bookingUrl && (
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="ss-chev-btn mt-6 inline-block font-jet text-xs font-bold uppercase tracking-[.16em] text-primary hover:underline">
                Prefer to talk? Book a call <ArrowUpRight className="ss-chev" />
              </a>
            )}
          </div>
        </div>

        <ContactForm topics={topics} linkedin={linkedin} />
      </div>
    </section>
  )
}
