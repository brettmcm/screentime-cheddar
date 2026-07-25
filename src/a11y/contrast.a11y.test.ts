import { readFile } from 'node:fs/promises'
import { describe, expect, it, vi } from 'vitest'
import { getResolvedColors, type TokenMode } from '../tokens/tokens'
import { APPEARANCES, BRANDS, SCHEMES } from '../test/render'
import { runA11yTokenChecks } from './contrast'

/**
 * Token contrast, computed from the resolved token values rather than from the
 * DOM.
 *
 * `tokens.css` builds several background tokens with `color-mix()`, which jsdom
 * cannot resolve — `getComputedStyle` hands back the literal
 * `color-mix(in srgb, …)` string, which is why axe's `color-contrast` rule is
 * switched off for the component suite. The DTCG source
 * (`tokens/cheddar.tokens.json`) therefore carries a concrete resolved
 * `$value` next to every `$extensions["com.cheddar.mix"]` recipe, and
 * `src/tokens/tokens.ts` re-exports those resolutions as `resolvedColor` /
 * `getResolvedColors(mode, brand)`. Those are the numbers checked here.
 *
 * `TokenMode` has three members and they map onto the theming axes like this:
 * `light` and `dark` are `scheme`, and `brand` is `appearance="brand"` (the
 * branded app shell), whose token layer is declared after `[data-theme]` and
 * wins over it.
 */

type Rgba = { r: number; g: number; b: number; a: number }

type Level = 'body' | 'large' | 'ui'

/**
 * The semantic names that carry a resolved value per mode and brand. This is
 * narrower than `SemanticColorName`, which also covers the raw `brand100…600`
 * ramp — those are aliases rather than resolutions and have no entry here.
 */
type ResolvedColorName = keyof ReturnType<typeof getResolvedColors>

type Pair = {
  id: string
  foreground: ResolvedColorName
  background: ResolvedColorName
  level: Level
  /** Where the pairing is actually used, so a failure names a real surface. */
  usage: string
}

/**
 * A pairing drawn on `background-surface` resolves against the surface scope, not
 * the canvas. This only matters for the branded appearance: its canvas is dark
 * while its surfaces stay white, so tokens.css re-establishes the light set on
 * every element that paints a surface (see SURFACE_SELECTORS in
 * scripts/build-tokens.mjs). Modelling that here is what lets one pair list cover
 * both the canvas and the islands sitting on it.
 */
function isSurfaceScoped(pair: Pair) {
  return pair.foreground === 'backgroundSurface' || pair.background === 'backgroundSurface'
}

/** WCAG 2.2 AA: 1.4.3 for text, 1.4.11 for UI components and graphics. */
const MINIMUM_RATIO: Record<Level, number> = {
  body: 4.5,
  large: 3,
  ui: 3,
}

/**
 * Every semantic pairing the stylesheets actually produce. Each entry names the
 * rule that sets it so a failure points at a fixable line rather than at an
 * abstract token pair.
 */
const PAIRS: Pair[] = [
  {
    id: 'body text on the page canvas',
    foreground: 'foregroundPrimary',
    background: 'backgroundDefault',
    level: 'body',
    usage: 'the page canvas behind every screen',
  },
  {
    id: 'body text on a card',
    foreground: 'foregroundPrimary',
    background: 'backgroundSurface',
    level: 'body',
    usage: '.article-card / .goal-card / .chart-panel and every other surface',
  },
  {
    id: 'body text on a muted surface',
    foreground: 'foregroundPrimary',
    background: 'backgroundMuted',
    level: 'body',
    usage: '.icon-btn-neutral',
  },
  {
    id: 'secondary text on the page canvas',
    foreground: 'foregroundSecondary',
    background: 'backgroundDefault',
    level: 'body',
    usage: '.input-description and other secondary copy on the canvas',
  },
  {
    id: 'secondary text on a card',
    foreground: 'foregroundSecondary',
    background: 'backgroundSurface',
    level: 'body',
    usage: '.activity-item-time, .check-description, .search-placeholder',
  },
  {
    id: 'brand text on a card',
    foreground: 'foregroundBrandPrimary',
    background: 'backgroundSurface',
    level: 'body',
    usage: '.btn-secondary border, .input-icon, .text-link',
  },
  {
    id: 'error text on a card',
    foreground: 'foregroundDanger',
    background: 'backgroundSurface',
    level: 'body',
    usage: '.input-error-message',
  },
  {
    id: 'error text on the danger surface',
    foreground: 'foregroundDanger',
    background: 'bgDanger',
    level: 'body',
    usage: 'danger banners and chips',
  },
  {
    id: 'primary button label',
    foreground: 'bgOnBrand',
    background: 'foregroundBrandPrimary',
    level: 'body',
    usage: '.btn-primary, .icon-btn-primary, .nav-icon-add, .check-on',
  },
  {
    id: 'secondary button label on the page canvas',
    foreground: 'bgBrandSecondary',
    background: 'backgroundDefault',
    level: 'body',
    usage: '.btn-secondary',
  },
  {
    id: 'amount chip',
    foreground: 'foregroundBrandPrimary',
    background: 'bgBrandPrimary',
    level: 'body',
    usage: '.activity-item-amount, .savings-streak-day-complete .savings-streak-mark',
  },
  {
    id: 'toast label',
    foreground: 'backgroundSurface',
    background: 'foregroundPrimary',
    level: 'body',
    usage: '.toast',
  },
  {
    id: 'text on a reverse brand surface',
    foreground: 'foregroundOnReverse',
    background: 'bgBrandSecondary',
    level: 'body',
    usage: '.total-savings-card and the large article hero',
  },
  {
    id: 'secondary text on a reverse brand surface',
    foreground: 'foregroundOnReverseSecondary',
    background: 'bgBrandSecondary',
    level: 'large',
    usage: 'the display-size balance read-out on .total-savings-card',
  },
  {
    id: 'field outline on a card',
    foreground: 'borderStrong',
    background: 'backgroundSurface',
    level: 'ui',
    usage: '.input-shell, .search-field, .textarea-input borders',
  },
  {
    id: 'field outline on the page canvas',
    foreground: 'borderStrong',
    background: 'backgroundDefault',
    level: 'ui',
    usage: '.input-shell, .search-field, .textarea-input borders',
  },
  {
    id: 'focus ring on a card',
    foreground: 'borderFocus',
    background: 'backgroundSurface',
    level: 'ui',
    usage: '--cds-shadow-focus-ring',
  },
  {
    id: 'focus ring on the page canvas',
    foreground: 'borderFocus',
    background: 'backgroundDefault',
    level: 'ui',
    usage: '--cds-shadow-focus-ring',
  },
  {
    id: 'unselected control outline',
    foreground: 'foregroundBrandPrimary',
    background: 'backgroundSurface',
    level: 'ui',
    usage: '.check-off border on Checkbox and Radio',
  },
  {
    id: 'icon glyph on a card',
    foreground: 'iconPrimary',
    background: 'backgroundSurface',
    level: 'ui',
    usage: '.icon tone="brand"',
  },
]

type Combination = { mode: TokenMode; brand: (typeof BRANDS)[number]; pair: Pair }

/**
 * The pairings that do not reach AA today, as one predicate per defect rather
 * than a list of opaque keys. Every matching combination is asserted with
 * `it.fails`, so the suite stays green while the defect stays visible — and the
 * moment a token change fixes one, its test starts failing and forces this list
 * to shrink. None of these are fixed here: the tokens are out of scope for the
 * test suite, and each one is written up in the accessibility report.
 */
const KNOWN_AA_FAILURES: { id: string; matches: (combination: Combination) => boolean }[] = []

function knownFailure(combination: Combination) {
  return KNOWN_AA_FAILURES.some((defect) => defect.matches(combination))
}

function parseColor(value: string): Rgba {
  const hex = /^#([\da-f]{6})$/i.exec(value)
  if (hex) {
    const int = Number.parseInt(hex[1], 16)
    return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255, a: 1 }
  }

  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+))?\s*\)$/i.exec(value)
  if (rgb) {
    return {
      r: Number(rgb[1]),
      g: Number(rgb[2]),
      b: Number(rgb[3]),
      a: rgb[4] === undefined ? 1 : Number(rgb[4]),
    }
  }

  throw new Error(`Cannot parse the resolved token value "${value}"`)
}

/** Composite a possibly translucent colour over an opaque one. */
function flatten(top: Rgba, bottom: Rgba): Rgba {
  return {
    r: top.r * top.a + bottom.r * (1 - top.a),
    g: top.g * top.a + bottom.g * (1 - top.a),
    b: top.b * top.a + bottom.b * (1 - top.a),
    a: 1,
  }
}

function channelLuminance(value: number) {
  const channel = value / 255
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}

function relativeLuminance({ r, g, b }: Rgba) {
  return (
    0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b)
  )
}

function contrastRatio(foreground: Rgba, background: Rgba) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background))
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background))
  return (lighter + 0.05) / (darker + 0.05)
}

function ratioFor(mode: TokenMode, brand: (typeof BRANDS)[number], pair: Pair) {
  const scope = mode === 'brand' && isSurfaceScoped(pair) ? 'light' : mode
  const palette = getResolvedColors(scope, brand)
  const background = parseColor(palette[pair.background])
  const foreground = parseColor(palette[pair.foreground])

  // A translucent background would need the surface underneath it to be
  // meaningful, and none of the pairs above use one.
  expect(background.a).toBe(1)

  return contrastRatio(flatten(foreground, background), background)
}

/** `light`/`dark` are the two schemes; `brand` is `appearance="brand"`. */
const MODES: { mode: TokenMode; description: string }[] = [
  ...SCHEMES.map((scheme) => ({ mode: scheme satisfies TokenMode, description: `${scheme} scheme` })),
  { mode: 'brand', description: 'brand appearance' },
]

describe('semantic token contrast', () => {
  it('covers every scheme and the brand appearance', () => {
    expect(MODES.map((entry) => entry.mode)).toEqual(['light', 'dark', 'brand'])
    expect(APPEARANCES).toContain('brand')
    expect(BRANDS).toHaveLength(4)
  })

  for (const { mode, description } of MODES) {
    for (const brand of BRANDS) {
      describe(`${description}, ${brand} brand`, () => {
        for (const pair of PAIRS) {
          const threshold = MINIMUM_RATIO[pair.level]
          const name = `${pair.id} meets ${threshold}:1 (${pair.usage})`
          const assertion = () => {
            expect(ratioFor(mode, brand, pair)).toBeGreaterThanOrEqual(threshold)
          }

          if (knownFailure({ mode, brand, pair })) {
            it.fails(name, assertion)
          } else {
            it(name, assertion)
          }
        }
      })
    }
  }
})

describe('pairings built from the raw brand ramp', () => {
  /**
   * A11Y-7 was exactly this: the four cards that paint `bg-brand-secondary` set
   * their text from the raw `brand-500` stop, which does not move with the mode
   * while the background does — so the hero balance fell to 1.09-1.38:1 in the
   * dark scheme. They now use `foreground-on-reverse`, whose whole job is to
   * track that background, and the `text on a reverse brand surface` pair above
   * covers all 12 combinations. This guards the regression: no rule may pair a
   * raw ramp stop with a mode-dependent background again.
   */
  it('pairs no mode-dependent background with a raw ramp stop', async () => {
    // Vitest runs from the repo root; import.meta.url is not a file URL here.
    const css = await readFile('src/styles/cards.css', 'utf8')
    const offenders: string[] = []

    for (const [, selector, body] of css.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
      const background = /background:\s*var\(--cds-color-(bg-brand-\w+|background-\w+)\)/.exec(body)
      const colour = /(?<!-)\bcolor:\s*var\(--cds-color-brand-\d00\)/.exec(body)
      if (background && colour) {
        offenders.push(`${selector.trim().split('\n').pop()} — ${colour[0]}`)
      }
    }

    expect(offenders).toEqual([])
  })

  /**
   * The check above only sees a rule that paints its own background, so it missed
   * the same defect one level down: the reverse-brand cards set the background on
   * the root and five *descendant* rules set text from the raw `white-100` /
   * `white-300` primitives. Those do not move with the mode, so the guide card's
   * footer sat at 1.08:1 once dark mode flipped `bg-brand-secondary` to a pale
   * tint. A raw stop is only safe when the same rule also fixes its own
   * background — otherwise it is inheriting a background it cannot see.
   */
  it('uses no raw colour primitive without a raw background in the same rule', async () => {
    const css = await readFile('src/styles/cards.css', 'utf8')
    const offenders: string[] = []

    for (const [, selector, body] of css.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
      const colour = /(?<!-)\bcolor:\s*var\(--(?:token-color-\w+-\d00|cds-color-brand-\d00)\)/.exec(
        body,
      )
      if (!colour) continue
      // `--accent-N` and the brand ramp stops are mode-independent, so a rule that
      // sets both sides from them is self-consistent in every mode.
      const ownsBackground = /background:\s*var\(--(?:accent-\d00|cds-color-brand-\d00)\)/.test(body)
      if (!ownsBackground) {
        offenders.push(`${selector.trim().split('\n').pop()} — ${colour[0]}`)
      }
    }

    expect(offenders).toEqual([])
  })
})

describe('the token checker shipped with the gallery', () => {
  it('reports no failing pair for the default light magenta palette', () => {
    // `contrast.ts` only console.errors, so the assertion is that it stays
    // quiet. It exports no ratio helper, hence the local maths above.
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    runA11yTokenChecks()

    expect(consoleError).not.toHaveBeenCalled()
    consoleError.mockRestore()
  })
})
