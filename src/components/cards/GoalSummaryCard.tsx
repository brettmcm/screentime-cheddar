import type { HTMLAttributes } from 'react'
import { classNames } from '../utils/classNames'
import type { AmountFormatter, Money } from './formatAmount'
import { amountValue, formatAmount as format } from './formatAmount'

export type GoalSummaryItem = {
  id?: string
  label: string
  amount: Money
}

export type GoalSummaryCardProps = {
  title?: string
  items: GoalSummaryItem[]
  totalLabel?: string
  total?: Money
  formatAmount?: AmountFormatter
} & HTMLAttributes<HTMLElement>

/**
 * A breakdown of what each goal holds, with a total row.
 *
 * `total` is derived by summing the item amounts when it is omitted and every
 * item amount is a number.
 */
export function GoalSummaryCard({
  title,
  items,
  totalLabel = 'Total savings',
  total,
  formatAmount,
  className,
  ...rest
}: GoalSummaryCardProps) {
  const values = items.map((item) => amountValue(item.amount))
  const derivedTotal = values.includes(undefined)
    ? undefined
    : values.reduce<number>((sum, value) => sum + (value ?? 0), 0)
  const resolvedTotal = total ?? derivedTotal

  return (
    <article className={classNames('goal-summary-card', className)} {...rest}>
      {title ? <p className="goal-summary-card-title">{title}</p> : null}
      <ul className="goal-summary-card-list">
        {items.map((item, index) => (
          <li key={item.id ?? `${item.label}-${index}`}>
            <span>{item.label}</span>
            <strong>{format(item.amount, formatAmount)}</strong>
          </li>
        ))}
      </ul>
      {resolvedTotal !== undefined ? (
        <p className="goal-summary-card-total">
          <strong>{totalLabel}</strong>
          <strong>{format(resolvedTotal, formatAmount)}</strong>
        </p>
      ) : null}
    </article>
  )
}
