import { createContext, useContext } from 'react'
import type { Appearance, BrandTheme, ColorScheme } from '../components'

export const brandOptions: readonly BrandTheme[] = ['magenta', 'blue', 'green', 'purple']
export const schemeOptions: readonly ColorScheme[] = ['light', 'dark']
export const appearanceOptions: readonly Appearance[] = ['surface', 'brand']

/** The three theming axes the gallery can be pinned to. */
export type GalleryTheme = {
  brand: BrandTheme
  scheme: ColorScheme
  appearance: Appearance
}

export const defaultGalleryTheme: GalleryTheme = {
  brand: 'magenta',
  scheme: 'light',
  appearance: 'surface',
}

export const GalleryThemeContext = createContext<GalleryTheme>(defaultGalleryTheme)

export function useGalleryTheme() {
  return useContext(GalleryThemeContext)
}

function pick<T extends string>(options: readonly T[], value: string | null, fallback: T): T {
  return options.find((option) => option === value) ?? fallback
}

/**
 * Reads `?brand=&scheme=&appearance=` from the URL. The screenshot suite pins
 * the theme this way so a run never depends on click order or on the
 * machine's `prefers-color-scheme`.
 */
export function readGalleryTheme(search: string, fallback = defaultGalleryTheme): GalleryTheme {
  const params = new URLSearchParams(search)

  return {
    brand: pick(brandOptions, params.get('brand'), fallback.brand),
    scheme: pick(schemeOptions, params.get('scheme'), fallback.scheme),
    appearance: pick(appearanceOptions, params.get('appearance'), fallback.appearance),
  }
}

export function galleryThemeSearch({ brand, scheme, appearance }: GalleryTheme) {
  return `?${new URLSearchParams({ brand, scheme, appearance }).toString()}`
}
