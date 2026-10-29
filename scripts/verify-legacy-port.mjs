#!/usr/bin/env node
/**
 * Proves the one-time migration from legacy/data/*.json (the pre-CMS data) to Keystatic
 * content (content/) lost nothing: every record and every field is compared, with
 * HTML-vs-Markdown and whitespace differences normalised away.
 *
 *   npm run verify:legacy
 *
 * This checks the migration snapshot. Once content is edited in Keystatic, differences
 * are expected and this script becomes a historical record.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const legacy = (name) => JSON.parse(readFileSync(path.join(root, 'legacy/data', `${name}.json`), 'utf8'))
const content = (name) => JSON.parse(readFileSync(path.join(root, 'content', `${name}.json`), 'utf8'))
const collection = (dir) =>
  readdirSync(path.join(root, 'content', dir)).map((f) => JSON.parse(readFileSync(path.join(root, 'content', dir, f), 'utf8')))

// ---------- comparison helpers

/** Plain text of an HTML or Markdown string: links become "text (url)", formatting and extra whitespace go. */
const norm = (s) =>
  String(s ?? '')
    .replace(/<a\s+[^>]*href=['"]([^'"]+)['"][^>]*>(.*?)<\/a>/gs, '$2 ($1)')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1 ($2)')
    .replace(/<li>\s*(\d+)\s*-\s*/g, '$1. ')
    .replace(/<\/?(?:br|li|ol|ul|p)(?:\s[^>]*)?\/?>/g, ' ') // block-level tags separate words…
    .replace(/<[^>]+>/g, '') // …inline ones (b, i, u, span) don't
    .replace(/\*\*|\*/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?)])/g, '$1')
    .replace(/\(\s+/g, '(')
    .trim()
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
/** "May 2025" → "2025-05-01" */
const monthDate = (label) => {
  const m = String(label ?? '').match(/([A-Za-z]+)\s+(\d{4})/)
  return m ? `${m[2]}-${String(MONTHS.indexOf(m[1].slice(0, 3).toLowerCase()) + 1).padStart(2, '0')}-01` : null
}
const publicFile = (src) => Boolean(src) && existsSync(path.join(root, 'public', src))

const results = []
/** Run one dataset's checks; each check returns a list of problems. */
function verify(dataset, records, checks) {
  const problems = checks.flatMap((check) => check())
  results.push({ dataset, records, problems })
}
const field = (label, a, b) => (same(a, b) ? [] : [`${label}: expected ${JSON.stringify(a)?.slice(0, 120)} got ${JSON.stringify(b)?.slice(0, 120)}`])
const text = (label, a, b) => (norm(a) === norm(b) ? [] : [`${label}: text differs`])
const count = (label, a, b) => (a === b ? [] : [`${label}: ${a} legacy records, ${b} migrated`])

// ---------- datasets

{
  const old = legacy('projectList')
  const ported = new Map(collection('projects').map((p) => [p.title, p]))
  verify('projectList → content/projects', old.length, [
    () => count('projects', old.length, ported.size),
    () =>
      old.flatMap((o) => {
        const n = ported.get(o.title)
        if (!n) return [`missing project "${o.title}"`]
        const refs = (Array.isArray(o.thumbnailUrl) ? o.thumbnailUrl : [o.thumbnailUrl]).filter(Boolean)
        return [
          ...field(`${o.title} featured`, Boolean(o.featured), n.featured),
          ...field(`${o.title} kind`, o.category === 'hobby' ? 'side' : 'client', n.kind),
          ...field(`${o.title} status`, o.status, n.status),
          ...field(`${o.title} openToContrib`, Boolean(o.openToContrib), n.openToContrib),
          ...field(`${o.title} date`, o.publishDate ?? '', n.dateLabel),
          ...text(`${o.title} description`, o.description, n.description),
          ...field(`${o.title} tags`, o.tags, n.tags),
          ...field(`${o.title} live URL`, o.projUrl || null, n.liveUrl),
          ...field(`${o.title} repo URL`, o.githubUrl || null, n.repoUrl),
          ...field(`${o.title} live URL note`, o.liveUrlNote ?? '', n.liveUrlNote),
          ...field(`${o.title} image count`, refs.length, n.images.length),
          ...n.images.filter((src) => !publicFile(src)).map((src) => `${o.title}: image file missing ${src}`),
        ]
      }),
  ])
}

{
  const old = legacy('blogList')
  const ported = new Map(collection('posts').map((p) => [p.title, p]))
  verify('blogList → content/posts', old.length, [
    () => count('posts', old.length, ported.size),
    () =>
      old.flatMap((o) => {
        const n = ported.get(o.title)
        if (!n) return [`missing post "${o.title}"`]
        return [
          ...text(`${o.title} description`, o.description, n.description),
          ...field(`${o.title} tags`, o.tags.map((t) => t.toLowerCase()), n.tags),
          ...field(`${o.title} url`, o.mediumUrl, n.url),
          ...field(`${o.title} thumbnail`, o.thumbnailUrl, n.thumbnail),
          ...field(`${o.title} date`, monthDate(o.publishDate), n.published),
          ...(o.hashnodeUrl && o.hashnodeUrl !== '#' ? [`${o.title}: hashnode URL not migrated`] : []),
        ]
      }),
  ])
}

{
  const site = content('site')
  const social = legacy('socialLinks')
  verify('socialLinks → site.social', Object.keys(social).length, [
    () => Object.entries(social).flatMap(([k, v]) => field(`social.${k}`, v, site.social[k])),
  ])
  const alt = legacy('contactAlt')
  verify('contactAlt → site.contactAlternatives', alt.length, [() => field('contact alternatives', alt, site.contactAlternatives)])
}

{
  const home = content('home')
  const hc = legacy('homeContent')
  const metrics = legacy('metrics')
  verify('metrics → home.metrics', metrics.length, [
    () => count('metrics', metrics.length, home.metrics.length),
    () => metrics.flatMap((m) => (home.metrics.some((n) => n.value === m.value && n.label === m.label) ? [] : [`missing metric ${m.value} ${m.label}`])),
    () => field('strip metrics (order)', hc.metricIndexes.map((i) => metrics[i].label), home.metrics.filter((m) => m.showInStrip).map((m) => m.label)),
  ])
  const faq = content('faq')
  verify('homeContent → home', 1, [
    () => field('hero label', hc.hero.label, home.heroLabel),
    () => field('hero intro', hc.hero.intro, home.heroIntro),
    // the A/B/C/D row letters are now generated, so they're not compared
    () => field('service rows', hc.services.map((s) => ({ title: s.title, description: s.description, serviceIndex: s.serviceIndex })), home.services),
    () => field('industries', hc.industries, home.industries),
    () => field('why me', hc.whyMe, home.whyMe),
    () => field('process', hc.process, home.process),
    () => field('about paragraphs', hc.about.paragraphs, home.aboutParagraphs),
    () => field('about facts', hc.about.facts.map((f) => ({ label: f.key, value: f.value })), home.aboutFacts),
    () => field('contact topics', hc.contactTopics, home.contactTopics),
    () =>
      field(
        'home FAQ picks (now "featured" flags)',
        hc.faqIndexes.map((i) => legacy('faq').development[i].question),
        faq.development.filter((q) => q.featured).map((q) => q.question)
      ),
  ])
}

{
  const old = legacy('services')
  const items = content('services').items
  verify('services → services.items', old.length, [
    () => count('services', old.length, items.length),
    () =>
      old.flatMap((o, i) => {
        const n = items[i]
        return [
          ...field(`${o.title} title`, o.title.toLowerCase(), n.title.toLowerCase()),
          ...field(`${o.title} short title`, o.optionTitle, n.shortTitle),
          ...field(`${o.title} featured`, Boolean(o.featured), n.featured),
          ...field(`${o.title} description`, o.description, n.description),
          ...field(`${o.title} good fit if`, o.goodFitIf, n.goodFitIf),
          ...field(`${o.title} contact topic`, o.contactTopic, n.contactTopic),
          ...field(`${o.title} deliverables`, o.deliverables, n.deliverables),
        ]
      }),
  ])
}

{
  const old = legacy('faq')
  const faq = content('faq')
  for (const group of ['development', 'mentorship']) {
    const ported = new Map(faq[group].map((q) => [q.question, q]))
    verify(`faq.${group} → faq.${group}`, old[group].length, [
      () => count(group, old[group].length, ported.size),
      () => old[group].flatMap((q) => (ported.has(q.question) ? text(`"${q.question}" answer`, q.answer, ported.get(q.question).answer) : [`missing question "${q.question}"`])),
    ])
  }
}

{
  const old = legacy('testimonials')
  const items = content('testimonials').items
  verify('testimonials → testimonials.items', old.length, [
    () => count('testimonials', old.length, items.length),
    () =>
      old.flatMap((o, i) => [
        ...field(`${o.title} name`, o.title, items[i].name),
        ...field(`${o.title} role`, o.designation, items[i].role),
        ...text(`${o.title} quote`, o.content, items[i].quote),
        ...(publicFile(items[i].avatar) ? [] : [`${o.title}: avatar missing`]),
        ...(o.profileUrl && o.profileUrl !== '#' ? [`${o.title}: profile URL not migrated`] : []),
      ]),
  ])
}

{
  const about = content('about')
  const awards = legacy('awards')
  verify('awards → about.awards', awards.length, [
    () => count('awards', awards.length, about.awards.length),
    () =>
      awards.flatMap((o, i) => {
        const n = about.awards[i]
        return [
          ...field(`${o.title} title`, o.title, n.title),
          ...field(`${o.title} kind`, o.type, n.kind),
          ...field(`${o.title} date`, monthDate(o.date), n.date),
          ...field(`${o.title} description`, o.description, n.description),
          ...field(`${o.title} links`, o.publishLinks, n.links),
          ...(publicFile(n.image) ? [] : [`${o.title}: image missing`]),
        ]
      }),
  ])

  const communities = legacy('communities')
  verify('communities → about.communities', communities.length, [
    () =>
      communities.flatMap((o, i) => {
        const n = about.communities[i]
        return [...field(`${o.title} fields`, [o.title, o.description, o.websiteUrl], [n.title, n.description, n.url]), ...(publicFile(n.image) ? [] : [`${o.title}: image missing`])]
      }),
  ])

  const tech = legacy('techStack')
  const tools = Object.values(tech).flat()
  verify('techStack → about.toolkit', tools.length, [
    () => count('toolkit groups', Object.keys(tech).length, about.toolkit.length),
    () =>
      Object.values(tech).flatMap((items, g) =>
        items.flatMap((o, i) => {
          const n = about.toolkit[g].items[i]
          return field(`${o.name}`, [o.name, o.url, o.imgUrl, o.bgColor, o.fontColor], [n?.name, n?.url, n?.icon, n?.bgColor, n?.fontColor])
        })
      ),
  ])

  const hobbies = legacy('hobbies')
  verify('hobbies → about.hobbies', hobbies.length, [
    () => hobbies.flatMap((o, i) => [...field(`${o.name} title`, o.name, about.hobbies[i].title), ...text(`${o.name} text`, o.desc, about.hobbies[i].body), ...field(`${o.name} value`, o.value, about.hobbies[i].value)]),
  ])

  const languages = legacy('language')
  verify('language → about.languages', languages.length, [
    () => count('languages', languages.length, about.languages.length),
    () =>
      languages.flatMap((o) => {
        const n = about.languages.find((l) => l.title.toLowerCase() === o.language)
        return n ? text(`${o.language} text`, o.description, n.body) : [`missing language ${o.language}`]
      }),
  ])

  const work = legacy('workTimeline')
  verify('workTimeline → about.experience', work.length, [
    () =>
      work.flatMap((o, i) => {
        const n = about.experience[i]
        return [
          ...field(`${o.title}`, [o.title, o.tooltip, o.date, o.orgUrl], [n.organization, n.role, n.dates, n.url]),
          ...field(`${o.title} highlight count`, o.description.length, n.highlights.length),
          ...o.description.flatMap((d, j) => text(`${o.title} highlight ${j + 1}`, d, n.highlights[j])),
        ]
      }),
  ])

  const education = legacy('educationTimeLine')
  verify('educationTimeLine → about.education', education.length, [
    () =>
      education.flatMap((o, i) => {
        const n = about.education[i]
        return [
          ...field(`${o.degreeTitle}`, [o.degreeTitle, String(o.startDate), String(o.endDate)], [n.degree, n.startYear, n.endYear]),
          ...text(`${o.degreeTitle} institution`, o.organization, n.organization),
          ...text(`${o.degreeTitle} description`, o.description, n.description),
        ]
      }),
  ])

  const skills = legacy('targetSkills')
  verify('targetSkills → about.upcomingSkills', skills.length, [
    () => count('skills', skills.length, about.upcomingSkills.length),
    () =>
      skills.flatMap((s, i) => {
        const n = about.upcomingSkills[i]
        return [...text(`skill ${i + 1} text`, s.text, n.text), ...field(`skill ${i + 1}`, [s.prefix, s.colorType, s.isHighlight], [n.prefix, n.colorType, n.isHighlight])]
      }),
  ])
}

{
  const books = legacy('booksList')
  verify('booksList → books.items', books.length, [() => field('books', books, content('books').items)])

  // Bookmarks and learning resources were merged into one list, matched by URL
  const merged = content('bookmarks').items
  const urlKey = (u) => String(u ?? '').replace(/\/+$/, '').toLowerCase()
  const byUrl = new Map(merged.map((b) => [urlKey(b.url), b]))
  const hasAll = (have, want) => want.every((t) => have.some((h) => h.toLowerCase() === t.toLowerCase()))

  const bookmarks = legacy('bookmarks')
  verify('bookmarks → bookmarks.items', bookmarks.length, [
    () =>
      bookmarks.flatMap((o) => {
        const n = byUrl.get(urlKey(o.url))
        if (!n) return [`missing bookmark "${o.title}"`]
        return [
          ...field(`${o.title}`, [o.title, o.category, Boolean(o.featured), o.icon || null], [n.title, n.category, n.featured, n.icon]), // legacy used `false` for "no icon"
          ...(norm(n.description).startsWith(norm(o.description)) ? [] : [`${o.title}: description changed`]),
          ...(hasAll(n.tags, o.tags) ? [] : [`${o.title}: tags missing`]),
        ]
      }),
  ])

  const resources = legacy('devResourceList')
  verify('devResourceList → bookmarks.items (merged)', resources.length, [
    () =>
      resources.flatMap((o) => {
        const n = byUrl.get(urlKey(o.link))
        if (!n) return [`missing resource "${o.title}"`]
        return [
          ...field(`${o.title} provider`, o.provider, n.provider),
          ...field(`${o.title} rating`, o.recommendation, n.rating),
          ...(o.review && !norm(n.description).includes(norm(o.review)) ? [`${o.title}: review missing`] : []),
          ...(hasAll(n.tags, o.topics) ? [] : [`${o.title}: topics missing from tags`]),
        ]
      }),
  ])
  verify('bookmarks.items has nothing unaccounted for', merged.length, [
    () => count('bookmarks after merge', new Set([...bookmarks.map((b) => urlKey(b.url)), ...resources.map((r) => urlKey(r.link))]).size, merged.length),
  ])
}

// Dropped on request: games are not part of the site
{
  const games = legacy('gamesList')
  results.push({ dataset: 'gamesList (not migrated: dropped on request)', records: games.length, problems: [] })
}

// Placeholder-only files: nothing real to migrate, so prove that's still the case
for (const name of ['certificates', 'certificatesCoursera', 'certificatesDataCamp', 'certificatesDataScience365', 'certificatesKaggle', 'certificatesFeatured']) {
  const rows = legacy(name)
  verify(`${name} (placeholder only, not migrated)`, rows.length, [
    () => rows.filter((r) => r.title !== 'Long Long Title' || !r.description.startsWith('Lorem ipsum') || r.downloadUrl).map((r) => `real certificate found, needs migrating: ${r.title}`),
  ])
}

// ---------- report

let failures = 0
for (const r of results) {
  failures += r.problems.length
  console.log(`${r.problems.length ? '✗' : '✓'} ${r.dataset.padEnd(58)} ${String(r.records).padStart(4)} records`)
  for (const p of r.problems.slice(0, 10)) console.log(`    - ${p}`)
  if (r.problems.length > 10) console.log(`    … ${r.problems.length - 10} more`)
}
console.log(
  `\nNot migrated on purpose: "projectList copy.json" and "projectList copy 2.json" are older snapshots of projectList.json (kept in legacy/data/).`
)
console.log(failures ? `\n${failures} problem(s) found.` : '\nAll legacy data is present in Keystatic content.')
process.exit(failures ? 1 : 0)
