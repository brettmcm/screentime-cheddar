/**
 * Per-item accent colours used by cards and panels.
 *
 * These are deliberately brand-independent: a list of goals or spending
 * segments needs to tell items apart regardless of the active `data-brand`.
 * Each accent class in `cards.css` sets `--accent-100…600` plus `--accent-fg`
 * from the matching primitive ramp.
 */

export type Accent = 'magenta' | 'blue' | 'green' | 'purple'

export const accentSequence: readonly Accent[] = ['magenta', 'blue', 'green', 'purple']

export function accentClass(accent: Accent = 'magenta') {
  return `accent-${accent}`
}

/** Pick an accent for the item at `index`, cycling through the four ramps. */
export function accentAt(index: number): Accent {
  return accentSequence[index % accentSequence.length]
}
