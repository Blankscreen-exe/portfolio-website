import type { AccordionItem } from '@/components/ui/Accordion'

type Question = { question: string; answer: string }

/** FAQ entries → accordion items */
export const faqToItems = (faq: readonly Question[]): AccordionItem[] => faq.map((q) => ({ title: q.question, body: q.answer }))
