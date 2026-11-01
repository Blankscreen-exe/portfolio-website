import { cache } from 'react'
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../keystatic.config'

// The single place that reads content. Runs on the server only (at build time for these
// static pages); components receive plain typed objects.
const reader = createReader(process.cwd(), keystaticConfig)

async function required<T>(name: string, value: Promise<T | null>): Promise<T> {
  const data = await value
  if (!data) throw new Error(`Missing content: "${name}". Create it in Keystatic (/keystatic) or under /content.`)
  return data
}

// ---------- Collections

export const getProjects = cache(async () => {
  const entries = await reader.collections.projects.all()
  return entries
    .map(({ slug, entry }) => ({ slug, ...entry, images: entry.images.filter((src): src is string => Boolean(src)) }))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
})
export type Project = Awaited<ReturnType<typeof getProjects>>[number]

export const getProject = async (slug: string) => (await getProjects()).find((p) => p.slug === slug) ?? null

export const getPosts = cache(async () => {
  const entries = await reader.collections.posts.all()
  return entries
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .sort((a, b) => (b.published ?? '').localeCompare(a.published ?? ''))
})
export type Post = Awaited<ReturnType<typeof getPosts>>[number]

export const getSketches = cache(async () => {
  const entries = await reader.collections.sketches.all()
  return entries
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || (b.date ?? '').localeCompare(a.date ?? ''))
})
export type Sketch = Awaited<ReturnType<typeof getSketches>>[number]

// ---------- Singletons

export const getSite = cache(() => required('site', reader.singletons.site.read()))
export const getHome = cache(() => required('home', reader.singletons.home.read()))
export const getLinktree = cache(async () => (await required('linktree', reader.singletons.linktree.read())).items)
export const getServices = cache(async () => (await required('services', reader.singletons.services.read())).items)
export const getFaq = cache(() => required('faq', reader.singletons.faq.read()))
export const getTestimonials = cache(async () => (await required('testimonials', reader.singletons.testimonials.read())).items)
export const getAbout = cache(() => required('about', reader.singletons.about.read()))
export const getBooks = cache(async () => (await required('books', reader.singletons.books.read())).items)
export const getBookmarks = cache(async () => (await required('bookmarks', reader.singletons.bookmarks.read())).items)

export type Site = Awaited<ReturnType<typeof getSite>>
export type Home = Awaited<ReturnType<typeof getHome>>
export type Service = Awaited<ReturnType<typeof getServices>>[number]
export type FaqItem = Awaited<ReturnType<typeof getFaq>>['development'][number]
export type Testimonial = Awaited<ReturnType<typeof getTestimonials>>[number]
export type About = Awaited<ReturnType<typeof getAbout>>
export type Award = About['awards'][number]
export type Book = Awaited<ReturnType<typeof getBooks>>[number]
export type Bookmark = Awaited<ReturnType<typeof getBookmarks>>[number]
