import type { HTMLAttributes } from 'react'
import type { IconName } from '../icon/Icon'
import { Icon } from '../icon/Icon'
import { classNames } from '../utils/classNames'
import type { Accent } from './accent'
import { accentClass } from './accent'
import type { AmountFormatter, Money } from './formatAmount'
import { amountValue, clampPercent, formatAmount as format } from './formatAmount'

export type GoalCardProps = {
  name: string
  target: Money
  saved: Money
  remaining?: Money
  progress?: number
  image?: string
  imageAlt?: string
  /** Fallback tile content when no `image` is supplied. */
  icon?: IconName
  accent?: Accent
  complete?: boolean
  completeLabel?: string
  onClick?: () => void
  href?: string
  formatAmount?: AmountFormatter
} & Omit<HTMLAttributes<HTMLElement>, 'onClick'>

/**
 * A goal progress row: an illustration tile, the goal name and target, a
 * progress bar, then the saved and remaining amounts.
 *
 * `progress` and `remaining` are derived from `saved` and `target` when both
 * are numbers and neither is supplied explicitly.
 */
export function GoalCard({
  name,
  target,
  saved,
  remaining,
  progress,
  image,
  imageAlt,
  icon,
  accent = 'magenta',
  complete = false,
  completeLabel = 'Goal reached!',
  onClick,
  href,
  formatAmount,
  className,
  ...rest
}: GoalCardProps) {
  const savedValue = amountValue(saved)
  const targetValue = amountValue(target)
  const derivedProgress =
    savedValue !== undefined && targetValue !== undefined && targetValue > 0
      ? (savedValue / targetValue) * 100
      : 0
  const percent = complete ? 100 : clampPercent(progress ?? derivedProgress)
  const remainingValue =
    remaining ??
    (savedValue !== undefined && targetValue !== undefined
      ? Math.max(0, targetValue - savedValue)
      : undefined)

  const content = (
    <>
      <span className="goal-card-tile">
        {image ? (
          <img
            className="goal-card-image"
            src={image}
            alt={imageAlt ?? ''}
            aria-hidden={imageAlt ? undefined : 'true'}
          />
        ) : icon ? (
          <Icon name={icon} width={30} height={30} aria-hidden="true" />
        ) : null}
      </span>
      <span className="goal-card-content">
        <span className="goal-card-line">
          <strong>{name}</strong>
          <strong>{format(target, formatAmount)}</strong>
        </span>
        <span
          className="goal-card-track"
          role="progressbar"
          aria-label={`${name} progress`}
          aria-valuenow={Math.round(percent)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span className="goal-card-track-fill" style={{ width: `${percent}%` }} />
        </span>
        <span className="goal-card-line goal-card-meta">
          <span>{complete ? completeLabel : format(saved, formatAmount)}</span>
          {!complete && remainingValue !== undefined ? (
            <span>{format(remainingValue, formatAmount)}</span>
          ) : null}
        </span>
      </span>
    </>
  )

  const classes = classNames(
    'goal-card',
    accentClass(accent),
    (href || onClick) && 'goal-card-interactive',
    complete && 'goal-card-complete',
    className,
  )

  /**
   * ARIA makes a control's children presentational, so once the card is a link or
   * a button neither the progressbar's value nor the amounts reach assistive tech.
   * Fold them into the control's own name; a caller can still override it.
   */
  const controlLabel = complete
    ? `${name}, ${completeLabel}`
    : `${name}, ${format(saved, formatAmount)} of ${format(target, formatAmount)}, ${Math.round(percent)}% saved`

  if (href) {
    return (
      <a className={classes} href={href} onClick={onClick} aria-label={controlLabel} {...rest}>
        {content}
      </a>
    )
  }

  if (onClick) {
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
