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
} as const
