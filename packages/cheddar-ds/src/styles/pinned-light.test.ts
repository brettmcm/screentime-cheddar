import { readFile } from 'node:fs/promises'
import { beforeAll, describe, expect, it } from 'vitest'

/**
 * Some components are drawn from primitives in Figma — a white card with black
 * text — and carry no mode variants there. `tokens.css` pins the light semantic
 * set on those selectors so no mode can repaint them.
 *
 * jsdom resolves neither `color-mix()` nor the `[data-appearance]` cascade, so
 * asserting the rendered colour is out of reach here; the theme matrix in
 * `tests/visual/theming.spec.ts` covers that. What this suite protects are the
 * two invariants the generator has to keep: whatever a mode overrides the pin
 * puts back, and nothing is pinned unless it paints the white surface the pin
 * assumes.
 */

let css = ''

beforeAll(async () => {
  css = await readFile('src/styles/tokens.css', 'utf8')
})

/** Body of the rule opened by `selector`, up to its closing brace. */
function body(selector: string): string {
  const start = css.indexOf(selector)
  expect(start, `${selector} is missing from tokens.css`).toBeGreaterThan(-1)
  const open = css.indexOf('{', start)
  return css.slice(open + 1, css.indexOf('\n}', open))
}

/** Custom property declarations in a rule body, as prop -> value. */
function customProperties(rule: string): Map<string, string> {
  return new Map(
    [...rule.matchAll(/^\t(--[\w-]+):\s*(.+);$/gm)].map(([, prop, value]) => [prop, value]),
  )
}

const PINNED = 'Always-light components'
const LIGHT = ':root,\n[data-theme="light"] {'

/**
 * The selectors the pinned rule applies to. Both the closing paren and the
 * separators have to be found at depth zero: a selector may carry its own
 * `:not(a, b)`, whose comma is not a separator and whose paren is not the end.
 */
function pinnedSelectors(): string[] {
  const rule = css.slice(css.indexOf(PINNED))
  const open = rule.indexOf(':where(') + ':where('.length
  const selectors: string[] = []
  let depth = 0
  let current = ''

  for (const char of rule.slice(open)) {
    if (char === '(') depth += 1
    else if (char === ')' && depth-- === 0) break
    if (char === ',' && depth === 0) {
      selectors.push(current)
      current = ''
    } else current += char
  }
  selectors.push(current)

  return selectors.map((selector) => selector.trim()).filter(Boolean)
}

describe('pinned-light components', () => {
  it('pins a white surface and black text', () => {
    const pinned = customProperties(body(PINNED))

    expect(pinned.get('--cds-color-background-surface')).toBe('var(--token-color-white-100)')
    expect(pinned.get('--cds-color-foreground-on-surface')).toBe('var(--token-color-black-100)')
  })

  it('applies at zero specificity, unscoped by appearance', () => {
    const rule = css.slice(css.indexOf(PINNED))
    const selector = rule.slice(0, rule.indexOf('{'))

    expect(selector).toContain(':where(')
    // Scoping it to an appearance is what left the panel dark in dark mode.
    expect(selector).not.toContain('data-appearance')
  })

  /**
   * Spelled out so that exempting a component from theming stays a deliberate
   * act rather than a side effect, and so the checks below cannot pass by
   * matching an empty list.
   */
  it('pins exactly the components whose design has one fixed appearance', () => {
    expect(pinnedSelectors()).toEqual([
      '.account-card',
      '.activity-card',
      '.article-card:not(.article-card-large.article-card-media, .article-card-small.article-card-flat)',
      '.chart-panel',
      '.goal-card',
      '.goal-summary-card',
      '.savings-streak',
    ])
  })

  /**
   * The brand scope and the pin both re-establish light values; listing a
   * component in both would mean two places to update and one to forget.
   */
  it('keeps the two surface lists disjoint', () => {
    const scope = css.slice(
      css.indexOf('Surfaces inside the branded shell'),
      css.indexOf(PINNED),
    )

    const both = pinnedSelectors().filter((selector) => scope.includes(`${selector},`))
    expect(both).toEqual([])
  })

  /**
   * The pin only redefines custom properties, so it cannot colour anything on
   * its own: a component has to paint both halves of the surface pairing
   * itself. Painting neither leaves black text on the near-black canvas.
   * Painting only the background is worse — `color` keeps inheriting from the
   * shell, so the dark shell puts white text on the pinned white card, which is
   * exactly how the activity card went invisible.
   */
  it('only pins components that paint the whole surface pairing', async () => {
    const sheets = await Promise.all(
      ['src/styles/cards.css', 'src/styles/components.css'].map((path) =>
        readFile(path, 'utf8'),
      ),
    )
    const rules = sheets.join('\n')

    const missing = pinnedSelectors().flatMap((selector) => {
      // A pin may narrow a base class — `.article-card:not(…)` — but it is the
      // base rule that paints, so look the filter off before matching.
      const start = rules.indexOf(`\n${selector.replace(/:not\([^)]*\)/g, '')} {`)
      if (start === -1) return [`${selector} — no rule`]

      const rule = rules.slice(start, rules.indexOf('\n}', start))
      return [
        ['background', 'background: var(--cds-color-background-surface);'],
        ['color', 'color: var(--cds-color-foreground-on-surface);'],
      ]
        .filter(([, declaration]) => !rule.includes(declaration))
        .map(([property]) => `${selector} — no ${property}`)
    })

    expect(missing).toEqual([])
  })

  for (const mode of ['[data-theme="dark"] {', '[data-appearance="brand"] {']) {
    it(`puts back every value ${mode.slice(0, mode.indexOf(' '))} changes`, () => {
      const light = customProperties(body(LIGHT))
      const pinned = customProperties(body(PINNED))

      const leaked = [...customProperties(body(mode))]
        // A mode override that matches light cannot repaint anything.
        .filter(([prop, value]) => light.get(prop) !== value)
        .filter(([prop]) => pinned.get(prop) !== light.get(prop))
        .map(([prop]) => prop)

      expect(leaked).toEqual([])
    })
  }
})
