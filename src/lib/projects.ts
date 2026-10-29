// Pure helpers for presenting projects. No content access here, so they're safe in client
// components and easy to unit test.

type ProjectLike = { title: string; status: string; liveUrl: string | null; kind: string }

/** "AMOS - AI Powered CRM System" → { name: "AMOS", subtitle: "AI Powered CRM System" } */
export function splitTitle(title: string): { name: string; subtitle: string } {
  const [name, ...rest] = title.split(' - ')
  return { name, subtitle: rest.join(' - ') }
}

/** First sentence of a long description, for card copy. */
export function firstSentence(text: string): string {
  const paragraph = text.split('\n')[0]
  const m = paragraph.match(/^.*?[.!?](\s|$)/)
  return (m ? m[0] : paragraph).trim()
}

/** Short badge word: "Live" (ongoing with a URL), "Ongoing" or "Shipped". */
export function statusLabel(project: Pick<ProjectLike, 'status' | 'liveUrl'>): 'Live' | 'Ongoing' | 'Shipped' {
  if (project.status === 'ongoing') return project.liveUrl ? 'Live' : 'Ongoing'
  return 'Shipped'
}

export const kindLabel = (project: Pick<ProjectLike, 'kind'>) => (project.kind === 'side' ? 'Side project' : 'Client work')

/** Free-text match against a project's title, description and tags. */
export function matchesQuery(project: { title: string; description: string; tags: readonly string[] }, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    project.title.toLowerCase().includes(q) ||
    project.description.toLowerCase().includes(q) ||
    project.tags.some((t) => t.toLowerCase().includes(q))
  )
}
