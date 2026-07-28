import type { HTMLAttributes } from 'react'
import type { IconName } from '../icon/Icon'
import { Icon } from '../icon/Icon'
import { classNames } from '../utils/classNames'
import type { Accent } from './accent'
import { accentClass } from './accent'
import { clampPercent } from './formatAmount'

export type BadgeCardProps = {
  title: string
  caption?: string
  progress?: number
  icon?: IconName
  image?: string
  imageAlt?: string
  accent?: Accent
  onClick?: () => void
} & Omit<HTMLAttributes<HTMLElement>, 'onClick'>

/** An achievement badge: an accent tile, then the badge name, its progress and a caption. */
export function BadgeCard({
  title,
  caption,
  progress,
  icon,
  image,
  imageAlt,
  accent = 'magenta',
  onClick,
  className,
  ...rest
}: BadgeCardProps) {
  const percent = progress === undefined ? undefined : clampPercent(progress)

  const content = (
    <>
      <span className="badge-card-tile">
        {image ? (
          <img
            className="badge-card-image"
            src={image}
            alt={imageAlt ?? ''}
            aria-hidden={imageAlt ? undefined : 'true'}
          />
        ) : icon ? (
          <Icon name={icon} width={24} height={24} aria-hidden="true" />
        ) : null}
      </span>
      <span className="badge-card-content">
        <span className="badge-card-title">{title}</span>
        {percent !== undefined ? (
          <span
            className="badge-card-track"
            role="progressbar"
            aria-label={`${title} progress`}
            aria-valuenow={Math.round(percent)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span className="badge-card-track-fill" style={{ width: `${percent}%` }} />
          </span>
        ) : null}
        {caption ? <span className="badge-card-caption">{caption}</span> : null}
      </span>
    </>
  )

  const classes = classNames(
    'badge-card',
    accentClass(accent),
    onClick && 'badge-card-interactive',
    className,
  )

  if (onClick) {
    // A button's children are presentational, so the progressbar's value and the
    // caption would be dropped from the accessible name. Fold them in instead.
    const controlLabel = [title, caption, percent !== undefined && `${Math.round(percent)}%`]
      .filter(Boolean)
      .join(', ')

    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        aria-label={controlLabel}
        {...rest}
      >
        {content}
      </button>
    )
  }

  return (
    <article className={classes} {...rest}>
      {content}
    </article>
  )
}
