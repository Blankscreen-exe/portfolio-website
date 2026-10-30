import type { CSSProperties } from 'react'
import { longestWord } from './format'

/** Sets the `--i` custom property that staggers reveal animations (see globals.css). */
export const stagger = (i: number) => ({ '--i': i }) as CSSProperties

/**
 * Inputs for .ss-fit-text (globals.css), which sizes a heading so its longest word fits the
 * .ss-fit container. For CMS titles of any length; `max` is the size it would otherwise have.
 */
export const fitText = (text: string, max: string) => ({ '--chars': longestWord(text), '--fit-max': max }) as CSSProperties
