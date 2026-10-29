import type { Metadata } from 'next'
import { Archivo, Inter, JetBrains_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import './globals.css'

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jet' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'M. Hammad Hassan — Product Engineer & Technical Consultant',
    template: '%s · M. Hammad Hassan',
  },
  description: "I build software that runs your business: apps and websites, practical AI, and fixes for software that's slowing you down.",
  icons: { icon: '/logo.svg' },
}

// Runs before first paint: applies the saved theme (no light/dark flash) and marks that JS is
// available, which is what lets reveal-on-scroll elements start hidden (see globals.css).
const bootScript = `(() => {
  const root = document.documentElement;
  try { if (localStorage.getItem('theme') === 'dark') root.dataset.theme = 'dark'; } catch (e) {}
  root.classList.add('js');
})();`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light" data-scroll-behavior="smooth" className={`${archivo.variable} ${jetbrains.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
