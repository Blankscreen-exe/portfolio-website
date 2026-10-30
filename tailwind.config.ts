import type { Config } from 'tailwindcss'

// Colours are RGB channel CSS variables (see src/app/globals.css) so opacity modifiers like
// `bg-ink/10` work and every token switches automatically between light and dark themes.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: token('color-primary'),
        stock: token('ss-stock'),
        paper: token('ss-paper'),
        ink: token('ss-ink'),
        ash: token('ss-ash'),
        frame: token('ss-frame'),
        onprimary: token('ss-onprimary'),
      },
      fontFamily: {
        archivo: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        jet: ['var(--font-jet)', 'ui-monospace', 'monospace'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
