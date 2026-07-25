import type { HTMLAttributes } from 'react'
import { Button } from '../button/Button'
import { Icon } from '../icon/Icon'
import { classNames } from '../utils/classNames'
import { useControllableState } from '../utils/useControllableState'
import type { Accent } from './accent'
import { accentClass } from './accent'

export type ArticleCardProps = {
  size?: 'large' | 'small'
  title: string
  description?: string
  image?: string
  imageAlt?: string
  /**
   * Render the media frame even without an `image`. Defaults to `true`
   * whenever `image` is set. Cards without a media frame use the flat
   * layouts — the guide tile at `size="small"`, the customer story card at
   * `size="large"`.
   */
  showMedia?: boolean
  eyebrow?: string
  tag?: string
  readTime?: string
  actionLabel?: string
  onAction?: () => void
  href?: string
  onClick?: () => void
  accent?: Accent
  favorite?: boolean
  defaultFavorite?: boolean
  onFavoriteChange?: (favorite: boolean) => void
  showFavorite?: boolean
} & Omit<HTMLAttributes<HTMLElement>, 'onClick' | 'title'>

/**
 * One prop-driven component for the four article shapes in Figma:
 *
 * - `Card / Article Large` — `size="large"` with an `image`
 * - `Card / Article Small` — `size="small"` with an `image`
 * - `Card / Guide` — `size="small"` with no media, a description and a read time
 * - `Card / Customer Article` — `size="large"` with no media, an `eyebrow` and a `tag`
 *
 * `href` / `onClick` turn the title into the card's link and stretch its hit
 * area over the whole card, which keeps the favourite toggle and the action
 * button clickable instead of nesting controls.
 */
export function ArticleCard({
  size = 'large',
  title,
  description,
  image,
  imageAlt,
  showMedia,
  eyebrow,
  tag,
  readTime,
  actionLabel,
  onAction,
  href,
  onClick,
  accent = 'magenta',
  favorite,
  defaultFavorite = false,
  onFavoriteChange,
  showFavorite = size === 'small',
  className,
  ...rest
}: ArticleCardProps) {
  const { currentValue: isFavorite, setValue: setFavorite } = useControllableState({
    value: favorite,
    defaultValue: defaultFavorite,
    onChange: onFavoriteChange,
  })
  const hasMedia = showMedia ?? Boolean(image)

  const titleContent = href ? (
    <a className="article-card-link" href={href} onClick={onClick}>
      {title}
    </a>
  ) : onClick ? (
    <button type="button" className="article-card-link" onClick={onClick}>
      {title}
    </button>
  ) : (
    title
  )

  return (
    <article
      className={classNames(
        'article-card',
        `article-card-${size}`,
        hasMedia ? 'article-card-media' : 'article-card-flat',
        accentClass(accent),
        className,
      )}
      {...rest}
    >
      {hasMedia ? (
        <div className="article-card-frame">
          {image ? (
            <img
              className="article-card-image"
              src={image}
              alt={imageAlt ?? ''}
              aria-hidden={imageAlt ? undefined : 'true'}
            />
          ) : null}
        </div>
      ) : null}
      <div className="article-card-body">
        {tag ? <span className="article-card-tag">{tag}</span> : null}
        {eyebrow ? <p className="article-card-eyebrow">{eyebrow}</p> : null}
        <h3 className="article-card-title">{titleContent}</h3>
        {description ? <p className="article-card-description">{description}</p> : null}
        {readTime || showFavorite ? (
          <div className="article-card-footer">
            <span>{readTime}</span>
            {showFavorite ? (
              <button
                type="button"
                className="article-card-favorite"
                aria-pressed={isFavorite}
                aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                onClick={() => {
                  setFavorite(!isFavorite)
                }}
              >
                <Icon
                  aria-hidden="true"
                  name={isFavorite ? 'heart-fill' : 'heart-outline'}
                  width={16}
                  height={16}
                />
              </button>
            ) : null}
          </div>
        ) : null}
        {actionLabel ? (
          <Button
            label={actionLabel}
            size="large"
            className="article-card-action"
            onClick={onAction}
          />
        ) : null}
      </div>
    </article>
  )
}
