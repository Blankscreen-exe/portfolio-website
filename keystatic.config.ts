import { collection, config, fields, singleton } from '@keystatic/core'

/**
 * Content model for the site. Everything lives as JSON under /content and images under
 * /public/images, so content changes are plain git commits.
 *
 * Storage: local files while developing (edit at /keystatic). Set KEYSTATIC_STORAGE=github
 * (plus the GitHub App env vars Keystatic generates) to edit the live site via GitHub.
 */

const json = { data: 'json' } as const

const text = (label: string, description?: string) => fields.text({ label, description })
const longText = (label: string, description?: string) => fields.text({ label, description, multiline: true })
const markdown = (label: string) =>
  fields.text({ label, multiline: true, description: 'Supports **bold**, *italic*, [links](https://…), and "1." / "-" lists.' })
const tags = (label = 'Tags') => fields.array(fields.text({ label: 'Tag' }), { label, itemLabel: (p) => p.value })
const image = (label: string, folder: string) =>
  fields.image({ label, directory: `public/images/${folder}`, publicPath: `/images/${folder}/` })

export default config({
  storage:
    process.env.KEYSTATIC_STORAGE === 'github'
      ? { kind: 'github', repo: { owner: 'Blankscreen-exe', name: 'porfolio-website' } }
      : { kind: 'local' },
  ui: {
    brand: { name: 'Hammad · Portfolio' },
    navigation: {
      Work: ['projects'],
      Writing: ['posts'],
      Pages: ['home', 'services', 'about', 'faq', 'testimonials'],
      Shelf: ['books', 'bookmarks'],
      Settings: ['site'],
    },
  },

  collections: {
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'content/projects/*',
      format: json,
      columns: ['featured', 'kind'],
      schema: {
        title: fields.slug({ name: { label: 'Title', description: 'Use "Name - Subtitle"; the part before " - " is the headline.' } }),
        featured: fields.checkbox({ label: 'Featured', description: 'Show on the home page' }),
        kind: fields.select({
          label: 'Type',
          options: [
            { label: 'Client work', value: 'client' },
            { label: 'Side project', value: 'side' },
          ],
          defaultValue: 'client',
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Ongoing', value: 'ongoing' },
            { label: 'Finished', value: 'finished' },
          ],
          defaultValue: 'finished',
        }),
        openToContrib: fields.checkbox({ label: 'Open to contributions' }),
        dateLabel: text('Date label', 'e.g. "May 2024" or "Live and Ongoing"'),
        sortOrder: fields.integer({ label: 'Sort order', description: 'Lower numbers come first', defaultValue: 0 }),
        description: longText('Description', 'Separate paragraphs with a blank line. The first sentence is used on cards.'),
        tags: tags('Tech'),
        liveUrl: fields.url({ label: 'Live URL' }),
        liveUrlNote: text('Note when there is no live URL'),
        repoUrl: fields.url({ label: 'Repository URL' }),
        images: fields.array(image('Screenshot', 'projects'), { label: 'Screenshots', itemLabel: (p) => p.value?.filename ?? 'Screenshot' }),
      },
    }),

    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'content/posts/*',
      format: json,
      columns: ['published'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: longText('Description'),
        published: fields.date({ label: 'Published', validation: { isRequired: true } }),
        url: fields.url({ label: 'Article URL', validation: { isRequired: true } }),
        thumbnail: fields.url({ label: 'Thumbnail URL', description: 'Image hosts must be allowed in next.config.ts (currently Medium and Hashnode)' }),
        tags: tags(),
      },
    }),
  },

  singletons: {
    site: singleton({
      label: 'Site',
      path: 'content/site',
      format: json,
      schema: {
        name: text('Name'),
        role: text('Role'),
        availability: text('Availability', 'Shown in the header when not inside a section'),
        social: fields.object({
          linkedin: fields.url({ label: 'LinkedIn' }),
          github: fields.url({ label: 'GitHub' }),
          medium: fields.url({ label: 'Medium' }),
          hashnode: fields.url({ label: 'Hashnode' }),
          upwork: fields.url({ label: 'Upwork' }),
          discord: fields.url({ label: 'Discord' }),
          calendarBooking: fields.url({ label: 'Booking link' }),
          reddit: fields.url({ label: 'Reddit' }),
          x: fields.url({ label: 'X' }),
          eBizCard: fields.url({ label: 'Digital business card' }),
        }, { label: 'Links' }),
        contactAlternatives: fields.array(fields.object({ icon: text('Icon key'), name: text('Label') }), {
          label: 'Other ways to reach me', itemLabel: (p) => p.fields.name.value,
        }),
      },
    }),

    home: singleton({
      label: 'Home page',
      path: 'content/home',
      format: json,
      schema: {
        heroLabel: text('Hero label'),
        heroIntro: longText('Hero intro'),
        metrics: fields.array(fields.object({
          value: text('Value', 'e.g. 20+, ~5, 99%'),
          label: text('Label'),
          showInStrip: fields.checkbox({ label: 'Show in the hero stats strip', defaultValue: true }),
        }), {
          label: 'Stats', description: 'Strip items appear in this order; the first one is also used on the hero card.',
          itemLabel: (p) => `${p.fields.value.value} ${p.fields.label.value}`,
        }),
        services: fields.array(fields.object({
          title: text('Title'),
          description: longText('Description'),
          serviceIndex: fields.integer({ label: 'Links to service #', description: '0-based position on the Services page', defaultValue: 0 }),
        }), { label: 'Services rows', itemLabel: (p) => p.fields.title.value }),
        industries: fields.array(fields.object({ name: text('Industry'), built: text('What I built') }), {
          label: 'Industries card', itemLabel: (p) => p.fields.name.value,
        }),
        whyMe: fields.array(fields.object({ title: text('Title'), text: longText('Text') }), {
          label: 'Why work with me card', itemLabel: (p) => p.fields.title.value,
        }),
        process: fields.array(fields.object({ title: text('Title'), text: longText('Text') }), {
          label: 'Process steps', itemLabel: (p) => p.fields.title.value,
        }),
        aboutParagraphs: fields.array(longText('Paragraph'), { label: 'About paragraphs', itemLabel: (p) => p.value.slice(0, 60) }),
        aboutFacts: fields.array(fields.object({ label: text('Label'), value: text('Value') }), {
          label: 'About facts', itemLabel: (p) => p.fields.label.value,
        }),
        contactTopics: fields.array(text('Topic'), { label: 'Contact form topics', itemLabel: (p) => p.value }),
      },
    }),

    services: singleton({
      label: 'Services',
      path: 'content/services',
      format: json,
      schema: {
        items: fields.array(fields.object({
          title: text('Title'),
          shortTitle: text('Short title', 'Compact label, e.g. for tabs'),
          featured: fields.checkbox({ label: 'Featured' }),
          description: longText('Description'),
          goodFitIf: longText('Good fit if…'),
          contactTopic: text('Contact topic', 'Must match one of the home page contact topics'),
          deliverables: fields.array(text('Deliverable'), { label: 'What you get', itemLabel: (p) => p.value }),
        }), { label: 'Services', itemLabel: (p) => p.fields.title.value }),
      },
    }),

    faq: singleton({
      label: 'FAQ',
      path: 'content/faq',
      format: json,
      schema: {
        development: fields.array(fields.object({
          question: text('Question'),
          answer: markdown('Answer'),
          featured: fields.checkbox({ label: 'Show on home & contact pages' }),
        }), { label: 'Working with me', description: 'Up to 4 questions', validation: { length: { max: 4 } }, itemLabel: (p) => p.fields.question.value }),
        mentorship: fields.array(fields.object({
          question: text('Question'),
          answer: markdown('Answer'),
          featured: fields.checkbox({ label: 'Show on home & contact pages' }),
        }), { label: 'Mentorship', description: 'Up to 4 questions', validation: { length: { max: 4 } }, itemLabel: (p) => p.fields.question.value }),
      },
    }),

    testimonials: singleton({
      label: 'Testimonials',
      path: 'content/testimonials',
      format: json,
      schema: {
        items: fields.array(fields.object({
          name: text('Name'),
          role: text('Role & company'),
          avatar: image('Avatar', 'testimonials'),
          quote: longText('Quote'),
        }), { label: 'Testimonials', itemLabel: (p) => p.fields.name.value }),
      },
    }),

    about: singleton({
      label: 'About page',
      path: 'content/about',
      format: json,
      schema: {
        awards: fields.array(fields.object({
          title: text('Title'),
          kind: fields.select({ label: 'Kind', options: [{ label: 'Award', value: 'award' }, { label: 'Workshop', value: 'workshop' }], defaultValue: 'award' }),
          date: fields.date({ label: 'Date' }),
          description: longText('Description'),
          links: fields.array(fields.url({ label: 'Link' }), { label: 'Post links', itemLabel: (p) => p.value ?? 'Link' }),
          image: image('Photo', 'awards'),
        }), { label: 'Awards & talks', itemLabel: (p) => p.fields.title.value }),
        toolkit: fields.array(fields.object({
          group: text('Group'),
          items: fields.array(fields.object({
            name: text('Name'),
            url: fields.url({ label: 'URL' }),
            icon: text('Icon key'),
            bgColor: text('Brand colour', 'CSS colour, e.g. #3470a0'),
            fontColor: text('Text colour'),
          }), {
            label: 'Tools', itemLabel: (p) => p.fields.name.value,
          }),
        }), { label: 'Toolkit', itemLabel: (p) => p.fields.group.value }),
        experience: fields.array(fields.object({
          organization: text('Organization'),
          role: text('Role'),
          dates: text('Dates', 'e.g. "Feb 2023 - Ongoing"'),
          url: fields.url({ label: 'Website' }),
          highlights: fields.array(markdown('Highlight'), { label: 'Highlights', itemLabel: (p) => p.value.slice(0, 60) }),
        }), { label: 'Work history (not shown on the site)', itemLabel: (p) => p.fields.organization.value }),
        education: fields.array(fields.object({
          degree: text('Degree'),
          organization: markdown('Institution'),
          startYear: text('Start year'),
          endYear: text('End year'),
          description: markdown('Description'),
        }), { label: 'Education (not shown on the site)', itemLabel: (p) => p.fields.degree.value }),
        upcomingSkills: fields.array(fields.object({
          text: markdown('Text'),
          prefix: text('Prefix'),
          colorType: text('Colour type'),
          isHighlight: fields.checkbox({ label: 'Highlight' }),
        }), { label: 'Skills I am learning next (not shown on the site)', itemLabel: (p) => p.fields.text.value }),
        communities: fields.array(fields.object({
          title: text('Title'),
          description: longText('Description'),
          url: fields.url({ label: 'Website' }),
          image: image('Logo', 'communities'),
        }), { label: 'Communities', itemLabel: (p) => p.fields.title.value }),
        hobbies: fields.array(fields.object({ title: text('Title'), body: markdown('Text'), value: fields.integer({ label: 'Weight', description: 'Relative amount of time spent (used by the old chart)' }) }), {
          label: 'Off the clock', itemLabel: (p) => p.fields.title.value,
        }),
        languages: fields.array(fields.object({ title: text('Language'), body: markdown('Text') }), {
          label: 'Languages', itemLabel: (p) => p.fields.title.value,
        }),
      },
    }),

    books: singleton({
      label: 'Books',
      path: 'content/books',
      format: json,
      schema: {
        items: fields.array(fields.object({ title: text('Title'), author: text('Author'), tags: tags() }), {
          label: 'Books', itemLabel: (p) => p.fields.title.value,
        }),
      },
    }),

    bookmarks: singleton({
      label: 'Bookmarks',
      path: 'content/bookmarks',
      format: json,
      schema: {
        items: fields.array(fields.object({
          title: text('Title'),
          url: fields.url({ label: 'URL' }),
          description: longText('Description'),
          category: text('Category'),
          tags: tags(),
          featured: fields.checkbox({ label: 'Featured', description: 'Shown with a ★ and listed first' }),
          icon: fields.url({ label: 'Icon URL' }),
          provider: text('Provider', 'Who publishes it, e.g. "freeCodeCamp" (mostly for courses)'),
          rating: fields.integer({ label: 'Rating (1–5)', validation: { min: 1, max: 5 } }),
        }), { label: 'Bookmarks', itemLabel: (p) => p.fields.title.value }),
      },
    }),
  },
})
