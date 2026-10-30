import { getFaq, getHome, getProjects, getServices, getSite } from '@/lib/content'
import { buildLlmsTxt } from '@/lib/profile'

export const dynamic = 'force-static'

/** A plain-text summary of the profile, so AI tools don't have to scan the whole site. */
export async function GET() {
  const [site, home, services, projects, faq] = await Promise.all([getSite(), getHome(), getServices(), getProjects(), getFaq()])
  const text = buildLlmsTxt({ site, home, services, projects, faq: faq.development.filter((q) => q.featured) })
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
