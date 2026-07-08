import type { CSSProperties, ElementType, ReactNode } from 'react'

export type BrandTheme = 'magenta' | 'blue' | 'green' | 'purple'
export type ColorScheme = 'light' | 'dark'

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
  /** Element to render. Defaults to a `<div>`. */
  as?: ElementType
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/**
 * Scopes design-system theming to a subtree, mirroring how a Figma frame
 * can select its own brand collection + Light/Dark mode. Both attributes
 * are omitted when their prop is undefined, so the nearest themed ancestor
 * is inherited. Because the token layers only redefine CSS custom
 * properties, ThemeScope can be nested arbitrarily.
 */
export function ThemeScope({
  brand,
  scheme,
  as: Component = 'div',
  className,
  style,
  children,
}: ThemeScopeProps) {
  return (
    <Component
      data-brand={brand}
      data-theme={scheme}
      className={className}
      style={style}
    >
      {children}
    </Component>
  )
}
