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
   * whenever `image` is set, and is ignored at `size="large"`, which has no
   * layout without media. Dropping the frame at `size="small"` gives the
   * guide tile.
   */
  showMedia?: boolean
  /**
   * How the media frame treats the `image`. An `illustration` sits centred on
   * the accent tile at its own size; a `photo` fills the frame and is masked
   * into the brand shape, leaving the accent visible around it.
   */
  media?: 'illustration' | 'photo'
  eyebrow?: string
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
 * - `Card / Customer Article` — as above, plus `media="photo"`
 * - `Card / Guide` — `size="small"` with no media, a description and a read time
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
  media = 'illustration',
  eyebrow,
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
  // Only the small card has a layout without media — the guide tile. Figma
  // draws one large shape and it is the hero, so `large` keeps its frame even
  // with nothing to put in it rather than falling through to an unstyled card.
  const hasMedia = size === 'large' || (showMedia ?? Boolean(image))

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
        hasMedia && media === 'photo' ? 'article-card-photo' : undefined,
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
