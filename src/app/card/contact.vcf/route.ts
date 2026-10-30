import { getSite } from '@/lib/content'
import { buildVCard } from '@/lib/profile'

export const dynamic = 'force-static'

/** The contact file behind "Save contact"; phones offer to add it to their contacts. */
export async function GET() {
  const site = await getSite()
  const filename = `${site.name.toLowerCase().replace(/[^a-z]+/g, '-')}.vcf`
  return new Response(buildVCard(site), {
    headers: { 'Content-Type': 'text/vcard; charset=utf-8', 'Content-Disposition': `attachment; filename="${filename}"` },
  })
}
