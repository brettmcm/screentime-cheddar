import type { HTMLAttributes } from 'react'
import { classNames } from '../utils/classNames'
import type { Accent } from './accent'
import { accentClass } from './accent'
import type { AmountFormatter, Money } from './formatAmount'
import { formatAmount as format } from './formatAmount'

export type CompletedGoalCardProps = {
  name: string
  amount: Money
  image?: string
  imageAlt?: string
  accent?: Accent
  onClick?: () => void
  href?: string
  formatAmount?: AmountFormatter
} & Omit<HTMLAttributes<HTMLElement>, 'onClick'>

/** A card in the "Completed goals" carousel: an accent tile, then name and amount. */
export function CompletedGoalCard({
  name,
  amount,
  image,
  imageAlt,
  accent = 'magenta',
  onClick,
  href,
  formatAmount,
  className,
  ...rest
}: CompletedGoalCardProps) {
  const content = (
    <>
      <span className="completed-goal-card-tile">
        {image ? (
          <img
            className="completed-goal-card-image"
            src={image}
            alt={imageAlt ?? ''}
            aria-hidden={imageAlt ? undefined : 'true'}
          />
        ) : null}
      </span>
      <span className="completed-goal-card-body">
        <span className="completed-goal-card-name">{name}</span>
        <span className="completed-goal-card-amount">{format(amount, formatAmount)}</span>
      </span>
    </>
  )

  const classes = classNames(
    'completed-goal-card',
    accentClass(accent),
    (href || onClick) && 'completed-goal-card-interactive',
    className,
  )

  if (href) {
    return (
      <a className={classes} href={href} onClick={onClick} {...rest}>
        {content}
      </a>
    )
  }

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} {...rest}>
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
