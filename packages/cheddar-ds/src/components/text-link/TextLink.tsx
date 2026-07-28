import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { Icon, type IconName } from '../icon/Icon'
import { classNames } from '../utils/classNames'

export type TextLinkProps = {
  /** Visible link text. */
  children: ReactNode
  /**
   * Trailing affordance icon. Defaults to `caret-right`, which is what the
   * Figma component uses for the "View all ›" pattern. Pass `null` for none.
   */
  icon?: IconName | null
  /** Render the icon before the label instead of after. */
  iconPosition?: 'leading' | 'trailing'
  /** Renders an `<a>` when set, otherwise a `<button type="button">`. */
  href?: string
  size?: 'medium' | 'small'
  className?: string
  ref?: Ref<HTMLAnchorElement & HTMLButtonElement>
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>

/**
 * Inline navigational link. This is the Figma `Text Link` component — the most
 * instanced component in the product file (86 uses), sitting at the right edge
 * of every section header as "View all ›".
 *
 * Renders an `<a>` when given `href` and a `<button>` otherwise, so it is
 * correct for both routed navigation and in-page state changes.
 */
export function TextLink({
  children,
  icon = 'caret-right',
  iconPosition = 'trailing',
  href,
  size = 'medium',
  className,
  ref,
  ...rest
}: TextLinkProps) {
  const glyph = icon ? (
    <Icon name={icon} className="text-link-icon" aria-hidden="true" />
  ) : null

  const content = (
    <>
      {iconPosition === 'leading' ? glyph : null}
      <span className="text-link-label">{children}</span>
      {iconPosition === 'trailing' ? glyph : null}
    </>
  )

  const classes = classNames('text-link', `text-link-${size}`, className)

  if (href !== undefined) {
    return (
      <a {...rest} ref={ref} href={href} className={classes}>
        {content}
      </a>
    )
  }

  return (
    <button {...rest} ref={ref} type="button" className={classes}>
      {content}
    </button>
  )
}
