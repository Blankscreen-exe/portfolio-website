import { notFound } from 'next/navigation'
import { keystaticEnabled } from '@/lib/keystatic-enabled'
import KeystaticApp from './keystatic'

export const metadata = { title: 'Content editor', robots: { index: false } }

export default function KeystaticLayout() {
  if (!keystaticEnabled) notFound()
  return <KeystaticApp />
}
