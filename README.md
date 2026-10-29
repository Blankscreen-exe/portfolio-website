# M. Hammad Hassan — portfolio

Personal site of a product engineer and technical consultant. It's built to turn visitors
(mostly non-technical clients) into conversations, so every page leads to one action:
**Start a project**.

**Stack:** Next.js 16 (App Router, static generation) · React 19 · TypeScript · Tailwind CSS ·
Keystatic (git-based CMS) · Vitest + Testing Library · ESLint

```bash
npm install
npm run dev        # http://localhost:3000 — content editor at /keystatic
npm run check      # lint → typecheck → tests → production build (what CI runs)
```

## How it's put together

```
content/                 All site content as JSON, edited through Keystatic (or by hand)
public/images/           Images referenced from content
keystatic.config.ts      Content model: collections (projects, posts) and singletons (pages)
src/
  app/
    (site)/              Public pages, sharing the sheet layout
      projects/[slug]/   One statically generated page per project
    keystatic/, api/     The CMS admin UI and its API (dev only, or GitHub mode)
    not-found.tsx, sitemap.ts, robots.ts
  components/
    ui/                  Reusable pieces: Accordion, Drawer, Pagination, FilterBar, RichText…
    layout/              Site shell: header, footer, motion wiring
    home/ work/ about/ blog/ lists/ services/ contact/   Page sections
  hooks/                 useQueryParams (URL state), usePagedQuery, useOnceVisible
  lib/
    content.ts           The only module that reads content (server-side, typed)
    pagination.ts, markdown.ts, facets.ts, format.ts, projects.ts   Pure, unit-tested logic
```

### Decisions worth knowing

- **Static by default.** Every public page, including all project pages, is pre-rendered at
  build time from the files in `content/`. Interactivity (filters, pagination, the card stack,
  the drawer) is limited to small client components.
- **Content as files, not a database.** Keystatic edits JSON in the repo, so every content change
  is a reviewable commit. `src/lib/content.test.ts` guards the content itself (missing images,
  services pointing at contact topics that don't exist, etc.).
- **URL-backed list state.** Tabs, tags and page numbers live in the query string
  (`/blog?tag=python&page=2`) so they survive refresh and can be shared. `useQueryParams` uses
  `useSyncExternalStore` rather than `useSearchParams`, so static pages render their default
  view on the server and hydrate without `<Suspense>` boundaries or mismatches.
- **No HTML injection.** Rich text in the CMS is a small Markdown subset parsed into an AST
  (`lib/markdown.ts`) and rendered as React elements, with link targets restricted.
- **Accessible motion.** Animations (reveal on scroll, text scramble, card shuffle, sliding
  accordion and drawer) respect `prefers-reduced-motion`; content stays visible without
  JavaScript. The drawer traps focus and restores it; the accordion uses `aria-expanded`
  and keeps closed panels `inert`.

### Design system

A "spec sheet" look: a hairline grid background, uppercase Archivo display type, JetBrains Mono
labels, and the signature cyan used for accent bars. Tokens are RGB CSS variables in
`src/app/globals.css` (light and dark), exposed to Tailwind as `stock`, `paper`, `ink`, `ash`
and `primary`. Component-level effects are plain CSS classes prefixed `ss-`.

## Editing content

Run `npm run dev` and open **/keystatic**. Saving writes to `content/` and `public/images/`;
commit the changes like any other.

To edit on the live site instead, switch Keystatic to GitHub mode: set `KEYSTATIC_STORAGE=github`,
open `/keystatic` locally once to create the GitHub App, and copy the generated
`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and
`NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` to the host. Without that, the editor is disabled in
production.

## Environment variables

All optional:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Absolute URL for metadata, sitemap and robots.txt |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`, `…_SERVICE_ID`, `…_TEMPLATE_ID` | Contact form delivery (public identifiers) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile spam check on the contact form |
| `KEYSTATIC_STORAGE` + Keystatic GitHub vars | Enable the CMS on the deployed site (see above) |
