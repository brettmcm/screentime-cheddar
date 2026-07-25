import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

async function read(path: string) {
  return readFile(path, 'utf8')
}

/** The declarations of the rule whose selector is exactly `selector`. */
function rule(css: string, selector: string) {
  const pattern = new RegExp(`\\n${selector.replace('.', '\\.')} \\{([^}]*)\\}`)
  const match = css.match(pattern)
  expect(match, `no rule found for ${selector}`).not.toBeNull()
  return match![1]
}

describe('field surfaces', () => {
  /**
   * A field paints its own background under mode-aware text, so a raw ramp stop
   * there cannot follow the theme: `.input-shell` shipped `--token-color-white-300`,
   * which left white text on a 60%-white panel in dark mode.
   */
  it('paints every text field with a semantic token', async () => {
    const css = await read('src/styles/components.css')
    for (const selector of ['.input-shell', '.textarea-input', '.search-field']) {
      const background = rule(css, selector).match(/background:\s*([^;]+);/)?.[1] ?? ''
      expect(background, `${selector} background`).toMatch(/var\(--cds-color-/)
      expect(background, `${selector} must not use a raw ramp stop`).not.toMatch(
        /--token-color-/,
      )
    }
  })
})

describe('icon buttons', () => {
  /**
   * The size classes set the button box outright. Leaving the UA's 1px/6px padding
   * in place left a 24px button with 10px of content box, and flex shrank the glyph
   * to fit — so the icon silently stopped matching the Figma component set.
   */
  it('resets the user-agent padding so the glyph keeps its size', async () => {
    const declarations = rule(await read('src/styles/components.css'), '.icon-btn')
    expect(declarations).toMatch(/padding:\s*0;/)
    expect(declarations).toMatch(/border:\s*var\(--cds-size-border\) solid transparent;/)
  })
})

describe('caret glyphs', () => {
  /**
   * Figma draws the caret at its intrinsic size inside the tap target, not filling
   * it: ink 6.6x14.4 in a 24px frame, which keeps the stroke a true 3px. Sizing the
   * svg to the frame instead renders it ~1.8x too large.
   */
  const RATIO = 17.4 / 9.64081

  it.each([
    ['src/components/page-header/PageHeader.tsx', 'caret-left'],
    ['src/components/notification/Notification.tsx', 'caret-right'],
    ['src/components/cards/SectionHeader.tsx', 'caret-right'],
  ])('sizes the caret in %s to the glyph', async (path, name) => {
    const source = await read(path)
    const uses = [
      ...source.matchAll(
        new RegExp(`name="${name}" width=\\{([\\d.]+)\\} height=\\{([\\d.]+)\\}`, 'g'),
      ),
    ]
    expect(uses.length, `${path} renders ${name} with an explicit size`).toBeGreaterThan(0)
    for (const [, width, height] of uses) {
      // Loose enough for hand-rounded values, tight enough that sizing the svg
      // to a square frame (ratio 1.0, ~45% off) fails.
      const drift = Math.abs(Number(height) / Number(width) / RATIO - 1)
      expect(drift, `${path} renders ${name} at ${width}x${height}`).toBeLessThan(0.08)
    }
  })
})
