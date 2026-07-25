import type { ReactElement } from 'react'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeScope, type Appearance, type BrandTheme, type ColorScheme } from '../components/theme/ThemeScope'

export type ThemedRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  brand?: BrandTheme
  scheme?: ColorScheme
  appearance?: Appearance
}

/**
 * Renders inside a ThemeScope so the theming attributes a component may query
 * are present, and returns a `user` bound to the same document. Every
 * interaction test should go through `user` rather than fireEvent so that focus
 * and pointer sequences behave like a real browser.
 */
export function renderThemed(
  ui: ReactElement,
  { brand, scheme, appearance, ...options }: ThemedRenderOptions = {},
): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
  const user = userEvent.setup()
  const result = render(ui, {
    ...options,
    wrapper: ({ children }) => (
      <ThemeScope brand={brand} scheme={scheme} appearance={appearance}>
        {children}
      </ThemeScope>
    ),
  })
  return { ...result, user }
}

/** The full brand x mode matrix the Figma file documents, for table-driven tests. */
export const BRANDS: BrandTheme[] = ['magenta', 'blue', 'green', 'purple']
export const SCHEMES: ColorScheme[] = ['light', 'dark']
export const APPEARANCES: Appearance[] = ['surface', 'brand']

export const THEME_MATRIX = BRANDS.flatMap((brand) =>
  SCHEMES.map((scheme) => ({ brand, scheme, id: `${brand}-${scheme}` })),
)
