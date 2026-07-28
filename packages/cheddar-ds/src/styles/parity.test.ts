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

describe('brand marks', () => {
  /**
   * The logo shipped `--token-color-brand-400`, which is the magenta ramp stop
   * rather than the active brand's — so the mark stayed magenta under every
   * `[data-brand]`. Only `--cds-color-brand-*` is re-pointed by that layer.
   */
  it('tints both marks from the brand-reactive ramp', async () => {
    const css = await read('src/styles/components.css')
    const colour = rule(css, '.brand-logo,\n.brand-wordmark').match(
      /color:\s*([^;]+);/,
    )?.[1]

    expect(colour).toBe('var(--cds-color-brand-400)')
  })

  /**
   * `currentColor` is what carries that tint into the artwork, and it only
   * resolves for inline SVG — an `<img>` renders in its own document, where the
   * page's `color` is invisible. The wordmark was an `<img>`, so it ignored the
   * theme no matter what the stylesheet said.
   */
  it('draws both marks as inline SVG filled with currentColor', async () => {
    const source = await read('src/components/brand/Brand.tsx')

    expect(source).not.toMatch(/<img/)
    expect(source.match(/fill="currentColor"/g) ?? []).toHaveLength(2)
  })
})

describe('article illustration backdrop', () => {
  const FRAME = String.raw`\.article-card-large\.article-card-media \.article-card-frame`

  /**
   * The backdrop is the Figma vector carried as a mask, which is what lets its
   * fill stay a token. Percent-encoding it by hand is the risk: a malformed URI
   * throws nothing, the mask just resolves to nothing and the shape vanishes.
   * jsdom never applies the mask, so parsing the payload is the only place a
   * typo gets caught before it reaches a screenshot.
   */
  it('embeds a parseable SVG for the illustration mask', async () => {
    const css = await read('src/styles/cards.css')
    const uri = css.match(/--article-card-shape: url\("([^"]+)"\)/)?.[1] ?? ''
    expect(uri, 'shape data URI').toMatch(/^data:image\/svg\+xml,/)

    const svg = decodeURIComponent(uri.slice('data:image/svg+xml,'.length))
    const doc = new DOMParser().parseFromString(svg, 'image/svg+xml')

    expect(doc.querySelector('parsererror'), 'shape SVG must parse').toBeNull()
    expect(doc.documentElement.getAttribute('viewBox')).toBe('0 0 370 370')
    // Four lobes: the outline closes over eight curves, not one arc.
    const d = doc.querySelector('path')?.getAttribute('d') ?? ''
    expect(d.match(/C/g) ?? []).toHaveLength(8)
  })

  /**
   * The shape has to be painted by the pseudo-element rather than the frame:
   * `mask` clips an element's children too, and the artwork sits on top of the
   * shape rather than inside it.
   */
  it('paints the shape behind the artwork, tinted by a token', async () => {
    const css = await read('src/styles/cards.css')
    const before = css.match(new RegExp(`\\n${FRAME}::before \\{([^}]*)\\}`))?.[1] ?? ''

    expect(before).toMatch(/\bmask: var\(--article-card-shape\)/)
    expect(before).toMatch(
      /background: var\(--cds-color-foreground-brand-reverse-tertiary\);/,
    )
    // A circle is what this replaced; rounding the frame would bring it back.
    expect(css.match(new RegExp(`\\n${FRAME} \\{([^}]*)\\}`))?.[1]).not.toMatch(
      /border-radius/,
    )
  })

  /**
   * Figma composes the customer story the other way round: the photograph fills
   * the frame and an accent overlay with the lobes knocked out of it sits on
   * top. Masking the image to the same shape composites identically, and reuses
   * the one copy of the vector rather than carrying a second, inverted one.
   */
  it('crops the customer story photo to the same shape', async () => {
    const css = await read('src/styles/cards.css')
    const image =
      css.match(
        /\n\.article-card-small\.article-card-photo \.article-card-image \{([^}]*)\}/,
      )?.[1] ?? ''

    expect(image).toMatch(
      /\bmask: var\(--article-card-shape\) center \/ var\(--article-card-photo-shape\) no-repeat;/,
    )
    expect(image).toMatch(/object-fit: cover;/)
  })

  /**
   * Measured off the Figma export: the knockout is 155px across a 187px frame,
   * leaving 16px of accent on either side. Fitting the shape to the frame with
   * `cover` or `contain` is the easy mistake — it is 21% too big and the margin
   * the composition depends on disappears.
   */
  it('insets the photo shape by the accent margin', async () => {
    const css = await read('src/styles/cards.css')
    const image =
      css.match(
        /\n\.article-card-small\.article-card-photo \.article-card-image \{([^}]*)\}/,
      )?.[1] ?? ''
    const size = image.match(/--article-card-photo-shape: (.+);/)?.[1] ?? ''

    expect(size).not.toMatch(/cover|contain/)
    // Square, sized off the width: the frame is shorter than it is wide, so
    // resolving the height against it would squash the lobes.
    expect(size).toMatch(/\bauto$/)

    const frame =
      css.match(/\n\.article-card-small\.article-card-photo \.article-card-frame \{([^}]*)\}/)?.[1] ??
      ''
    expect(frame).toMatch(/height: 177px;/)
  })

  /**
   * Both cards mask against it, so it has to resolve on a shared ancestor
   * rather than on either variant's own rule.
   */
  it('declares the shape once, on the card itself', async () => {
    const css = await read('src/styles/cards.css')
    const declarations = css.match(/--article-card-shape: url/g) ?? []

    expect(declarations).toHaveLength(1)
    expect(css.match(/\n\.article-card \{([^}]*)\}/)?.[1]).toMatch(/--article-card-shape:/)
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
