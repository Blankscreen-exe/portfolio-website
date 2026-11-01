// VERCEL_PROJECT_PRODUCTION_URL is set by Vercel on every deployment, without the protocol
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000')

// Every internal URL in one place, so links never drift from the app/ folder structure.
export const routes = {
  home: '/',
  work: '/projects',
  project: (slug: string) => `/projects/${slug}`,
  services: '/services',
  service: (index: number) => `/services#service-${index}`,
  servicesFaq: '/services#faq',
  about: '/about',
  awards: '/about#awards',
  writing: '/blog',
  contact: '/contacts',
  contactAbout: (topic?: string) => (topic ? `/contacts?topic=${encodeURIComponent(topic)}` : '/contacts'),
  books: '/lists/books',
  bookmarks: '/lists/bookmarks',
  llms: '/llms.txt',
  card: '/card',
  linktree: '/linktree',
  cardContact: '/card/contact.vcf',
} as const
