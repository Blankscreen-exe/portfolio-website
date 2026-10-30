// Machine-readable summaries of the profile, for AI tools and search engines.
// Built only from what's already public on the site, so there's no second copy to maintain.

import type { FaqItem, Home, Project, Service, Site } from './content'
import { firstSentence, kindLabel, splitTitle, statusLabel } from './projects'
import { routes, siteUrl } from './routes'

type ProfileContent = {
  site: Site
  home: Home
  services: readonly Service[]
  projects: readonly Project[]
  faq: readonly FaqItem[]
}

const absolute = (path: string) => `${siteUrl}${path}`

/** The profiles worth pointing to. Empty ones are dropped, as links are optional in the CMS. */
function profileLinks({ social }: Site) {
  const links = [
    { name: 'LinkedIn', href: social.linkedin },
    { name: 'GitHub', href: social.github },
    { name: 'X', href: social.x },
    { name: 'Hashnode', href: social.hashnode },
    { name: 'Medium', href: social.medium },
  ]
  return links.flatMap(({ name, href }) => (href ? [{ name, href }] : []))
}

function section(title: string, items: readonly string[], separator = '\n') {
  return items.length ? `## ${title}\n\n${items.join(separator)}` : ''
}

function projectLine(project: Project) {
  const { name } = splitTitle(project.title)
  const facts = [kindLabel(project), statusLabel(project), project.tags.slice(0, 5).join(', ')].filter(Boolean).join(' · ')
  return `- [${name}](${absolute(routes.project(project.slug))}): ${firstSentence(project.description)} (${facts})`
}

/** The site as a single Markdown document, following the llms.txt convention (llmstxt.org). */
export function buildLlmsTxt({ site, home, services, projects, faq }: ProfileContent) {
  const contact = [
    `- Email: ${site.email}`,
    `- Contact form: ${absolute(routes.contact)}`,
    ...(site.social.calendarBooking ? [`- Book a call: ${site.social.calendarBooking}`] : []),
    ...profileLinks(site).map((l) => `- ${l.name}: ${l.href}`),
  ]

  return [
    `# ${site.name}`,
    `> ${site.role}. ${home.heroIntro}`,
    `Availability: ${site.availability}. Site: ${siteUrl}`,
    section('About', home.aboutParagraphs, '\n\n'),
    section('At a glance', [
      ...home.metrics.filter((m) => m.showInStrip).map((m) => `- ${m.label}: ${m.value}`),
      ...home.aboutFacts.map((f) => `- ${f.label}: ${f.value}`),
    ]),
    section('Services', services.map((s) => `- **${s.title}**: ${s.description}${s.goodFitIf ? ` Good fit if: ${s.goodFitIf}` : ''}`)),
    section('Industries', home.industries.map((i) => `- ${i.name}: ${i.built}`)),
    section('How working together goes', home.process.map((p, i) => `${i + 1}. **${p.title}**: ${p.text}`)),
    section('Projects', projects.map(projectLine)),
    section('Common questions', faq.map((q) => `### ${q.question}\n\n${q.answer}`), '\n\n'),
    section('Contact', contact),
  ]
    .filter(Boolean)
    .join('\n\n')
    .concat('\n')
}

/** vCard values must escape these characters (RFC 6350) */
const vCardText = (value: string) => value.replace(/[\\,;]/g, '\\$&')

/** A vCard contact file. The last word of the name is treated as the family name. */
export function buildVCard(site: Site) {
  const parts = site.name.split(' ')
  const family = parts.pop() ?? ''
  const links = [{ name: 'Website', href: siteUrl }, ...profileLinks(site), ...(site.social.calendarBooking ? [{ name: 'Book a call', href: site.social.calendarBooking }] : [])]

  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${vCardText(family)};${vCardText(parts.join(' '))};;;`,
    `FN:${vCardText(site.name)}`,
    `TITLE:${vCardText(site.role)}`,
    `EMAIL;TYPE=INTERNET:${site.email}`,
    ...links.map((l) => `URL;TYPE=${l.name.replace(/\s+/g, '')}:${l.href}`),
    'END:VCARD',
    '',
  ].join('\r\n')
}

/** schema.org Person, the structured data search engines already understand. */
export function buildPersonJsonLd({ site, services }: Pick<ProfileContent, 'site' | 'services'>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.role,
    url: siteUrl,
    email: `mailto:${site.email}`,
    image: absolute('/profile_pic.png'),
    sameAs: profileLinks(site).map((l) => l.href),
    knowsAbout: services.map((s) => s.title),
  }
}
