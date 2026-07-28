import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

const SHEETS = [
  'src/styles/cards.css',
  'src/styles/components.css',
  'src/styles/foundation.css',
  'src/styles/overlays.css',
  'src/styles/text-link.css',
]

/** Paths are repo-relative, matching how the other stylesheet tests read CSS. */
async function read(path: string) {
  return readFile(path, 'utf8')
}

describe('display typography', () => {
  /**
   * Figma's Display styles track at -0.0625em (-4px at 64px, -3px at 48px). CSS's
   * `font:` shorthand cannot express tracking, so the generated tokens expose a
   * companion `-tracking` var that every use site has to opt into. Without it the
   * headline renders noticeably wider than the design.
   */
  it('pairs every display font shorthand with its tracking var', async () => {
    for (const sheet of SHEETS) {
      const css = await read(sheet)
      const unpaired = [
        ...css.matchAll(
          /font: var\(--cds-type-(display-[a-z]+)\);(?!\n[ \t]*letter-spacing)/g
        ),
      ].map(([, name]) => name)
      expect(unpaired, `${sheet} uses a display style without letter-spacing`).toEqual([])
    }
  })

  it('exposes a tracking var for each display style and none for body styles', async () => {
    const tokens = await read('src/styles/tokens.css')
    // Figma states display tracking as a percent of font size, so the value is an
    // em ratio rather than a fixed pixel amount. display-medium is the one step
    // that tracks at -3% instead of -4%.
    const tracking: Record<string, string> = {
      xlarge: '-0.04em',
      large: '-0.04em',
      medium: '-0.03em',
      small: '-0.04em',
      xsmall: '-0.04em',
    }
    for (const [name, value] of Object.entries(tracking)) {
      expect(tokens).toContain(`--cds-type-display-${name}-tracking: ${value};`)
    }
    // Figma reports letterSpacing 0 for heading and body styles, so they must not
    // acquire tracking by accident.
    for (const name of ['heading', 'body-large', 'body-medium', 'body-small']) {
      expect(tokens).not.toContain(`--cds-type-${name}-tracking`)
    }
  })
})
