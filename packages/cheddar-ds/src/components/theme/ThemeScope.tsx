import type { CSSProperties, ElementType, ReactNode } from 'react'

export type BrandTheme = 'magenta' | 'blue' | 'green' | 'purple'
export type ColorScheme = 'light' | 'dark'
export type Appearance = 'surface' | 'brand'

export type ThemeScopeProps = {
  /**
   * Brand accent ramp. Maps to the `[data-brand]` layer in tokens.css,
   * re-pointing `--cds-color-brand-100…600` for this subtree. Omit to
   * inherit the brand from an ancestor (or the page default, magenta).
   */
  brand?: BrandTheme
  /**
   * Light/dark mode. Maps to `[data-theme]`. Omit to inherit the mode
   * from an ancestor. Set it to flip a frame independently of the page —
   * e.g. a light card inside a dark shell.
   */
  scheme?: ColorScheme
  /**
   * Surface treatment. Maps to `[data-appearance]`.
   *
   * `brand` is the product app shell: a saturated `--cds-color-brand-100`
   * canvas carrying light surfaces. It is the supported way to render the
   * Cheddar screens — previously this was approximated with
   * `scheme="dark"` plus a consumer-side background override, which broke
   * whenever the brand ramp changed.
   *
   * When both `appearance` and `scheme` are set on the same ThemeScope,
   * `appearance` wins for the tokens they share.
   */
  appearance?: Appearance
  /** Element to render. Defaults to a `<div>`. */
  as?: ElementType
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/**
 * Scopes design-system theming to a subtree, mirroring how a Figma frame
 * can select its own brand collection + Light/Dark mode. Each attribute is
 * omitted when its prop is undefined, so the nearest themed ancestor is
 * inherited. Because the token layers only redefine CSS custom properties,
 * ThemeScope can be nested arbitrarily.
 */
export function ThemeScope({
  brand,
  scheme,
  appearance,
  as: Component = 'div',
  className,
  style,
  children,
}: ThemeScopeProps) {
  return (
    <Component
      data-brand={brand}
      data-theme={scheme}
      data-appearance={appearance}
      className={className}
      style={style}
    >
      {children}
    </Component>
  )
}
