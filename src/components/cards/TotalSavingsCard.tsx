import type { HTMLAttributes, ReactNode } from 'react'
import { Logo } from '../brand/Brand'
import { Button } from '../button/Button'
import type { IconName } from '../icon/Icon'
import { classNames } from '../utils/classNames'
import type { AmountFormatter, Money } from './formatAmount'
import { formatAmount as format, splitAmount } from './formatAmount'

export type TotalSavingsAction = {
  label: string
  icon?: IconName
  onClick?: () => void
}

export type TotalSavingsCardProps = {
  label?: string
  amount: Money
  actions?: TotalSavingsAction[]
  badge?: ReactNode
  showLogo?: boolean
  formatAmount?: AmountFormatter
  children?: ReactNode
} & HTMLAttributes<HTMLElement>

/**
 * The Home screen hero: an eyebrow row, the balance in display type with the
 * cents set smaller and raised, and a row of secondary actions.
 *
 * `badge` takes precedence over `showLogo` when both are supplied.
 */
export function TotalSavingsCard({
  label = 'Total savings',
  amount,
  actions,
  badge,
  showLogo = false,
  formatAmount,
  children,
  className,
  ...rest
}: TotalSavingsCardProps) {
  const { major, minor } = splitAmount(format(amount, formatAmount))

  return (
    <article className={classNames('total-savings-card', className)} {...rest}>
      <div className="total-savings-card-header">
        <p className="total-savings-card-label">{label}</p>
        {badge ?? (showLogo ? <span className="total-savings-card-logo"><Logo /></span> : null)}
      </div>
      <p className="total-savings-card-amount">
        <span>{major}</span>
        {minor ? <span className="total-savings-card-cents">{minor}</span> : null}
      </p>
      {actions?.length ? (
        <div className="total-savings-card-actions">
          {actions.map((action) => (
            <Button
              key={action.label}
              label={action.label}
              icon={action.icon}
              variant="secondary"
              size="large"
              className="total-savings-card-action"
              onClick={action.onClick}
            />
          ))}
        </div>
      ) : null}
      {children}
    </article>
  )
}
