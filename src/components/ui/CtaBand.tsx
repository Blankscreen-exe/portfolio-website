import type { ReactNode } from 'react'
import { routes } from '@/lib/routes'
import Button from './Button'
import { Bar } from './SectionHeading'
import Scramble from './Scramble'

type Props = {
  title?: ReactNode
  text?: string
  label?: string
  /** Pre-selects "What do you need?" on the contact form */
  topic?: string
}

/** Closing call to action at the bottom of every inner page. */
export default function CtaBand({
  title = (
    <>
      Have a project <Bar>in mind?</Bar>
    </>
  ),
  text = 'Tell me about it. A sentence or two is enough, no technical details needed.',
  label = '[ next step ]',
  topic,
}: Props) {
  return (
    <section className="bg-ink text-stock transition-colors duration-500" data-section="next step">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 px-5 py-20 md:px-8 lg:flex-row lg:items-end">
        <div>
          <div className="ss-label !text-stock/60" data-reveal="up">
            <Scramble text={label} />
          </div>
          <h2 className="ss-display mt-4 text-[min(10.5vw,3rem)] sm:text-6xl" data-reveal="focus">
            {title}
          </h2>
          <p className="mt-6 max-w-lg text-lg text-stock/75" data-reveal="up">
            {text}
          </p>
        </div>
        <div data-reveal="up">
          <Button href={routes.contactAbout(topic)} size="lg" attention="brackets" magnet className="whitespace-nowrap">
            Start a project
          </Button>
        </div>
      </div>
    </section>
  )
}
