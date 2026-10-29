// @vitest-environment node
import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { getAbout, getHome, getPosts, getProjects, getServices, getTestimonials } from './content'

// Content-integrity checks: catch broken references before they reach the live site
// (e.g. an image deleted from /public while a project still points at it).
const publicFile = (src: string) => path.join(process.cwd(), 'public', src)

describe('content', () => {
  it('every project image exists in /public', async () => {
    const missing = (await getProjects()).flatMap((p) => p.images.filter((src) => !existsSync(publicFile(src))).map((src) => `${p.slug}: ${src}`))
    expect(missing).toEqual([])
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

  it('posts are sorted newest first', async () => {
    const dates = (await getPosts()).map((p) => p.published ?? '')
    expect(dates).toEqual([...dates].sort().reverse())
  })
})
