// @vitest-environment node
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import nextConfig from '../../next.config'

import { getAbout, getFaq, getHome, getLinktree, getPosts, getProjects, getServices, getSketches, getTestimonials } from './content'
import { routes } from './routes'

// Content-integrity checks: catch broken references before they reach the live site
// (e.g. an image deleted from /public while a project still points at it).
const publicFile = (src: string) => path.join(process.cwd(), 'public', src)

describe('content', () => {
  it('every project image exists in /public', async () => {
    const missing = (await getProjects()).flatMap((p) => p.images.filter((src) => !existsSync(publicFile(src))).map((src) => `${p.slug}: ${src}`))
    expect(missing).toEqual([])
  })

  it('every sketch image exists in /public', async () => {
    const missing = (await getSketches()).filter((s) => !existsSync(publicFile(s.image))).map((s) => s.slug)
    expect(missing).toEqual([])
  })

  it('every link tree link goes somewhere real', async () => {
    const pages = Object.values(routes).filter((r) => typeof r === 'string')
    const broken = (await getLinktree())
      .filter((l) => l.action === 'link')
      .filter((l) => (l.target.startsWith('/') ? !pages.includes(l.target as (typeof pages)[number]) : !/^(https?:\/\/|mailto:)/.test(l.target)))
    expect(broken.map((l) => l.title)).toEqual([])
  })

  it('link tree titles are unique', async () => {
    const titles = (await getLinktree()).map((l) => l.title)
    expect(new Set(titles).size).toBe(titles.length)
  })

  it('has at least one featured project for the home page', async () => {
    expect((await getProjects()).some((p) => p.featured)).toBe(true)
  })

  it('every about-page and testimonial image exists in /public', async () => {
    const about = await getAbout()
    const srcs = [...about.awards.map((a) => a.image), ...about.communities.map((c) => c.image), ...(await getTestimonials()).map((t) => t.avatar)]
    expect(srcs.filter((src) => src && !existsSync(publicFile(src)))).toEqual([])
  })

  it('home page service rows point at real services', async () => {
    const services = await getServices()
    for (const row of (await getHome()).services) expect(services[row.serviceIndex ?? -1], row.title).toBeDefined()
  })

  it('service contact topics are offered on the contact form', async () => {
    const topics = (await getHome()).contactTopics
    for (const s of await getServices()) expect(topics, s.title).toContain(s.contactTopic)
  })

  it('contains no raw HTML (rich text uses the Markdown subset in lib/markdown.ts)', () => {
    const files = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]))
    const strings = (value: unknown): string[] =>
      typeof value === 'string' ? [value] : Array.isArray(value) ? value.flatMap(strings) : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : []
    const withHtml = files(path.join(process.cwd(), 'content'))
      .filter((f) => f.endsWith('.json'))
      .flatMap((f) => strings(JSON.parse(readFileSync(f, 'utf8'))).filter((s) => /<\/?[a-z][^>]*>/i.test(s)).map((s) => `${path.basename(f)}: ${s.slice(0, 60)}`))
    expect(withHtml).toEqual([])
  })

  it('keeps each FAQ group to at most four questions', async () => {
    const faq = await getFaq()
    expect(faq.development.length).toBeLessThanOrEqual(4)
    expect(faq.mentorship.length).toBeLessThanOrEqual(4)
  })

  it('every post thumbnail comes from an image host next.config allows', async () => {
    // next/image throws on unconfigured hosts, which takes down the whole page
    const allowed = (nextConfig.images?.remotePatterns ?? []).map((p) => ('hostname' in p ? p.hostname : ''))
    const blocked = (await getPosts()).filter((p) => p.thumbnail && !allowed.includes(new URL(p.thumbnail).hostname)).map((p) => `${p.slug}: ${new URL(p.thumbnail!).hostname}`)
    expect(blocked).toEqual([])
  })

  it('posts are sorted newest first', async () => {
    const dates = (await getPosts()).map((p) => p.published ?? '')
    expect(dates).toEqual([...dates].sort().reverse())
  })
})
