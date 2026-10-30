import { describe, expect, it } from 'vitest'
import type { FaqItem, Home, Project, Service, Site } from './content'
import { buildLlmsTxt, buildPersonJsonLd } from './profile'
import { siteUrl } from './routes'

const site = {
  name: 'Jane Doe',
  role: 'Engineer',
  availability: 'Taking new projects',
  email: 'jane@example.com',
  social: { linkedin: 'https://linkedin.com/in/jane', github: null, x: 'https://x.com/jane', hashnode: null, medium: null, upwork: 'https://upwork.com/jane', calendarBooking: 'https://cal.com/jane' },
} as unknown as Site

const home = {
  heroIntro: 'I build things.',
  aboutParagraphs: ['First paragraph.'],
  metrics: [
    { label: 'Systems', value: '15+', showInStrip: true },
    { label: 'Hidden', value: '1', showInStrip: false },
  ],
  aboutFacts: [{ label: 'Role', value: 'Engineer' }],
  industries: [{ name: 'Healthcare', built: 'Clinic agent' }],
  process: [{ title: 'We talk', text: 'You tell me.' }],
} as unknown as Home

const services = [{ title: 'Building', description: 'I build.', goodFitIf: 'You need it.' }] as unknown as Service[]
const projects = [{ title: 'AMOS - AI CRM', slug: 'amos', kind: 'client', status: 'ongoing', liveUrl: 'https://amos.dev', description: 'A CRM. It is good.', tags: ['Go'] }] as unknown as Project[]
const faq = [{ question: 'How long?', answer: 'It depends.' }] as unknown as FaqItem[]

describe('llms.txt', () => {
  const text = buildLlmsTxt({ site, home, services, projects, faq })

  it('starts with the name and a one-line summary', () => {
    expect(text.startsWith('# Jane Doe\n\n> Engineer. I build things.')).toBe(true)
  })

  it('lists projects with absolute links and their first sentence', () => {
    expect(text).toContain(`- [AMOS](${siteUrl}/projects/amos): A CRM. (Client work · Live · Go)`)
  })

  it('keeps paragraphs and sections separated by one blank line', () => {
    const paragraphs = buildLlmsTxt({ site, home: { ...home, aboutParagraphs: ['One.', 'Two.'] }, services, projects, faq })
    expect(paragraphs).toContain('One.\n\nTwo.')
    expect(paragraphs).not.toContain('\n\n\n')
  })

  it('includes services, contact details and answers', () => {
    expect(text).toContain('- **Building**: I build. Good fit if: You need it.')
    expect(text).toContain('- Email: jane@example.com')
    expect(text).toContain('- Book a call: https://cal.com/jane')
    expect(text).toContain('### How long?\n\nIt depends.')
  })

  it('leaves out hidden metrics, empty links and Upwork', () => {
    expect(text).not.toContain('Hidden')
    expect(text).not.toContain('GitHub')
    expect(text.toLowerCase()).not.toContain('upwork')
  })

  it('drops a section with nothing in it', () => {
    expect(buildLlmsTxt({ site, home, services: [], projects, faq })).not.toContain('## Services')
  })
})

describe('Person JSON-LD', () => {
  const person = buildPersonJsonLd({ site, services })

  it('describes the person', () => {
    expect(person).toMatchObject({ '@type': 'Person', name: 'Jane Doe', jobTitle: 'Engineer', email: 'mailto:jane@example.com', knowsAbout: ['Building'] })
  })

  it('links only to public profiles that are set', () => {
    expect(person.sameAs).toEqual(['https://linkedin.com/in/jane', 'https://x.com/jane'])
  })
})
