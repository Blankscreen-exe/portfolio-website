import type { MetadataRoute } from 'next'

import { getProjects } from '@/lib/content'
import { routes } from '@/lib/routes'

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = [routes.home, routes.work, routes.services, routes.about, routes.writing, routes.contact, routes.books, routes.bookmarks]
  const projects = (await getProjects()).map((p) => routes.project(p.slug))
  return [...pages, ...projects].map((path) => ({ url: `${base}${path}` }))
}
