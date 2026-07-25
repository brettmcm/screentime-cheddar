import { expect, test } from '@playwright/test'
import type { GalleryTheme } from './gallery'
import { brands, gotoGallery, schemes, section, themeName } from './gallery'

/**
 * The regression net for the token refactor.
 *
 * jsdom cannot resolve `color-mix()` or the `[data-appearance]` cascade, so
 * the unit suites can only assert that the right attribute landed on the right
 * element — never that the resulting colour is correct. These runs are the
 * only place a brand ramp that stops propagating, or a semantic token that
 * quietly resolves to the wrong layer, gets caught.
 */

// `[data-appearance="brand"]` redeclares the full semantic set after the
// `[data-theme]` layers, so light and dark are indistinguishable underneath it.
// Crossing it with `scheme` would double the baselines for identical pixels.
const themes: GalleryTheme[] = [
  ...brands.flatMap((brand) =>
    schemes.map((scheme): GalleryTheme => ({ brand, scheme, appearance: 'surface' })),
  ),
  ...brands.map((brand): GalleryTheme => ({ brand, scheme: 'light', appearance: 'brand' })),
]

/**
 * The theme-sensitive sections. Everything else in the gallery is either
 * monochrome (typography, demo assets) or repeats colours these five already
 * cover, so multiplying them by the matrix would buy baselines rather than
 * coverage.
 *
 * - `color`          — the semantic token grid itself; the most direct assertion.
 * - `cards`          — the widest use of brand, accent and surface tokens together.
 * - `app-shell`      — the composition `appearance` exists to serve.
 * - `buttons`        — brand fills, plus the disabled and secondary treatments.
 * - `form-fields`    — surfaces, borders and the validation/danger tokens.
 */
const themedSections = ['color', 'cards', 'app-shell', 'buttons', 'form-fields'] as const

test.describe('theme matrix', () => {
  for (const id of themedSections) {
    for (const theme of themes) {
      test(`${id} @ ${themeName(theme)}`, async ({ page }) => {
        await gotoGallery(page, theme)

        const target = section(page, id)
        await expect(target).toBeVisible()
        await expect(target).toHaveScreenshot(`theme-${id}-${themeName(theme)}.png`)
      })
    }
  }
})
