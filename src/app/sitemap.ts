import type { MetadataRoute } from 'next'

import { getProjects } from '@/lib/content'
import { routes, siteUrl } from '@/lib/routes'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = [routes.home, routes.work, routes.services, routes.about, routes.writing, routes.contact, routes.books, routes.bookmarks, routes.llms]
  const projects = (await getProjects()).map((p) => routes.project(p.slug))
  return [...pages, ...projects].map((path) => ({ url: `${siteUrl}${path}` }))
}
