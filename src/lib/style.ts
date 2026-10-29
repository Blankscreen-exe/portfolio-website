import type { CSSProperties } from 'react'

/** Sets the `--i` custom property that staggers reveal animations (see globals.css). */
export const stagger = (i: number) => ({ '--i': i }) as CSSProperties
