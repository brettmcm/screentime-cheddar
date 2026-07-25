import type { HTMLAttributes } from 'react'
import { Logo } from '../brand/Brand'
import type { IconName } from '../icon/Icon'
import { Icon } from '../icon/Icon'
import { classNames } from '../utils/classNames'
import type { Accent } from './accent'
import { accentClass } from './accent'
import type { AmountFormatter, Money } from './formatAmount'
import { formatAmount as format } from './formatAmount'

export type AccountCardProps = {
  name: string
  subtitle?: string
  amount: Money
  meta?: string
  icon?: IconName
  image?: string
  imageAlt?: string
  accent?: Accent
  onClick?: () => void
  href?: string
  formatAmount?: AmountFormatter
} & Omit<HTMLAttributes<HTMLElement>, 'onClick'>

/**
 * A linked account row: a tile, the account name and number on the left, the
 * balance and its freshness on the right. The tile falls back to the Cheddar
 * logo when neither `image` nor `icon` is supplied.
 */
export function AccountCard({
  name,
  subtitle,
  amount,
  meta,
  icon,
  image,
  imageAlt,
  accent = 'magenta',
  onClick,
  href,
  formatAmount,
  className,
  ...rest
}: AccountCardProps) {
  const content = (
    <>
      <span className="account-card-tile">
        {image ? (
          <img
            className="account-card-image"
            src={image}
            alt={imageAlt ?? ''}
            aria-hidden={imageAlt ? undefined : 'true'}
          />
        ) : icon ? (
          <Icon name={icon} width={24} height={24} aria-hidden="true" />
        ) : (
          <Logo />
        )}
      </span>
      <span className="account-card-copy">
        <span className="account-card-name">{name}</span>
        {subtitle ? <span className="account-card-subtitle">{subtitle}</span> : null}
      </span>
      <span className="account-card-balance">
        <span className="account-card-amount">{format(amount, formatAmount)}</span>
        {meta ? <span className="account-card-meta">{meta}</span> : null}
      </span>
    </>
  )

  const classes = classNames(
    'account-card',
    accentClass(accent),
    (href || onClick) && 'account-card-interactive',
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
