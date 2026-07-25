import { expect, test } from '@playwright/test'
import type { GalleryTheme } from './gallery'
import { brands, gotoGallery, schemes, themeName } from './gallery'

/**
 * A two-tone icon draws its counter shape in the colour of whatever is painted
 * behind it — Figma models the same glyphs as a single path with a hole. The
 * colour comes from `--cds-icon-knockout`, which every container that paints its
 * own background has to declare; miss one and the counter fills with the page
 * surface instead, so the glyph reads as a solid blob.
 *
 * Only a browser can answer this: the knockout resolves through the custom
 * property cascade and the backdrop is whatever ancestor happens to paint first,
 * neither of which jsdom computes.
 */
const themes: GalleryTheme[] = [
  ...brands.flatMap((brand) =>
    schemes.map((scheme): GalleryTheme => ({ brand, scheme, appearance: 'surface' }))
  ),
  ...brands.map(
    (brand): GalleryTheme => ({ brand, scheme: 'light', appearance: 'brand' })
  ),
]

type Mismatch = {
  host: string
  counter: string
  backdrop: string
  paintedBy: string
}

test.describe('two-tone icons', () => {
  for (const theme of themes) {
    test(`knock out in their own backdrop @ ${themeName(theme)}`, async ({ page }) => {
      await gotoGallery(page, theme)

      const mismatches = await page.evaluate((): Mismatch[] => {
        const isOpaque = (colour: string) => {
          if (!colour || colour === 'transparent') return false
          // Parse the alpha rather than pattern-matching a trailing zero: a blue
          // channel of 0 (green's rgb(10, 60, 0)) is not a zero alpha.
          const parts = colour.match(/[\d.]+/g)
          return !(parts !== null && parts.length > 3 && Number(parts[3]) === 0)
        }

        /** The colour actually painted behind `node`. */
        const backdropOf = (node: Element) => {
          for (let el = node.parentElement; el; el = el.parentElement) {
            const colour = getComputedStyle(el).backgroundColor
            if (isOpaque(colour)) {
              return { colour, paintedBy: el.className || el.tagName }
            }
          }
          return { colour: 'rgb(255, 255, 255)', paintedBy: 'page' }
        }

        const found: Mismatch[] = []
        // The brand tone paints its second colour deliberately; only mono knocks out.
        for (const svg of document.querySelectorAll('svg[data-tone="mono"]')) {
          const glyph = getComputedStyle(svg).color
          const fills = [...svg.querySelectorAll('path')].map(
            (p) => getComputedStyle(p).fill
          )
          const counter = fills.find((fill) => fill !== glyph && fill !== 'none')
          if (counter === undefined) continue

          const backdrop = backdropOf(svg)
          if (counter === backdrop.colour) continue
          found.push({
            host: String(svg.closest('[class]')?.className ?? 'unknown'),
            counter,
            backdrop: backdrop.colour,
            paintedBy: String(backdrop.paintedBy),
          })
        }
        return found
      })

      const describe = (m: Mismatch) =>
        `${m.host} knocks out ${m.counter} over ${m.backdrop} painted by ${m.paintedBy}`
      expect(mismatches.map(describe)).toEqual([])
    })
  }
})
