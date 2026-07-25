import type { Locator, Page } from '@playwright/test'

export type Brand = 'magenta' | 'blue' | 'green' | 'purple'
export type Scheme = 'light' | 'dark'
export type Appearance = 'surface' | 'brand'

export type GalleryTheme = {
  brand: Brand
  scheme: Scheme
  appearance: Appearance
}

export const brands: Brand[] = ['magenta', 'blue', 'green', 'purple']
export const schemes: Scheme[] = ['light', 'dark']

export const defaultTheme: GalleryTheme = {
  brand: 'magenta',
  scheme: 'light',
  appearance: 'surface',
}

/**
 * Every section the gallery renders, in page order. Each one is a screenshot
 * target: `App.tsx` gives it `data-gallery-section="{id}"`.
 */
export const sectionIds = [
  'typography',
  'color',
  'theming',
  'app-shell',
  'activity',
  'avatar',
  'brand',
  'buttons',
  'cards',
  'cards-deprecated',
  'form-fields',
  'icon-buttons',
  'icons',
  'nav',
  'notification',
  'number-pad',
  'page-header',
  'panels',
  'selection-controls',
  'sheet',
  'slider',
  'status',
  'tags',
  'text-link',
  'demo-assets',
] as const

export function section(page: Page, id: string): Locator {
  return page.locator(`[data-gallery-section="${id}"]`)
}

export function themeName({ brand, scheme, appearance }: GalleryTheme) {
  return `${brand}-${scheme}-${appearance}`
}

/**
 * Loads the gallery with the theme pinned through the URL rather than by
 * clicking the controls, so a run never depends on click order or on the
 * machine's `prefers-color-scheme`.
 */
export async function gotoGallery(page: Page, theme: Partial<GalleryTheme> = {}) {
  const params = new URLSearchParams({ ...defaultTheme, ...theme })
  await page.goto(`/?${params.toString()}`)
  await settle(page)
}

/**
 * Waits for the two things that otherwise make baselines flaky: web fonts
 * (Mona Sans and Oswald are still swapping in on first paint) and the demo
 * imagery, which is decoded lazily and would otherwise land mid-screenshot.
 */
export async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all(
      Array.from(document.images).map((image) => image.decode().catch(() => undefined)),
    )
  })
  await page.waitForTimeout(50)
}
