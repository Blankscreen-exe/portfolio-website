import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/routes'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/keystatic', '/api/'] },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
