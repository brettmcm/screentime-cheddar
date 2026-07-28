import type { ReactNode } from 'react'
import { classNames } from '../utils/classNames'
import type { IconName } from '../icon/Icon'
import { Icon } from '../icon/Icon'

type ActivityType = 'deposit' | 'withdrawal'

export type ActivityItemProps = {
  type?: ActivityType
  time?: string
  amount?: ReactNode
  /** Overrides the label derived from `type`. */
  title?: string
  /** Overrides `time` on the secondary line. */
  subtitle?: string
  /** Overrides the arrow derived from `type`. */
  icon?: IconName
  onClick?: () => void
  /** Renders an `<a>` instead of a `<button>`. */
  href?: string
  className?: string
}

const defaults: Record<ActivityType, { label: string; icon: 'arrow-up' | 'arrow-down' }> = {
  deposit: {
    label: 'Deposit',
    icon: 'arrow-up',
  },
  withdrawal: {
    label: 'Withdrawal',
    icon: 'arrow-down',
  },
}

export function ActivityItem({
  type = 'deposit',
  time = 'Today, 11:17am',
  amount = '$80.00',
  title,
  subtitle,
  icon,
  onClick,
  href,
  className,
}: ActivityItemProps) {
  const config = defaults[type]
  const isWithdrawal = type === 'withdrawal'
  const heading = title ?? config.label
  const secondary = subtitle ?? time
  const interactive = href !== undefined || onClick !== undefined

  const amountNode = isWithdrawal ? (
    <span className="activity-item-withdrawal">
      <span className="activity-item-minus">-</span>
      <span>{amount}</span>
    </span>
  ) : (
    <span className="activity-item-amount">{amount}</span>
  )

  const media = (
    <span className="activity-item-icon" aria-hidden="true">
      <Icon name={icon ?? config.icon} width={24} height={24} />
    </span>
  )

  if (interactive) {
    const inner = (
      <>
        {media}
        <span className="activity-item-content">
          <span className="activity-item-text">
            <span className="activity-item-label">{heading}</span>
            <span className="activity-item-time">{secondary}</span>
          </span>
          {amountNode}
        </span>
      </>
    )
    const classes = classNames('activity-item', 'activity-item-interactive', className)

    return href !== undefined ? (
      <a className={classes} href={href} onClick={onClick}>
        {inner}
      </a>
    ) : (
      <button type="button" className={classes} onClick={onClick}>
        {inner}
      </button>
    )
  }

  return (
    <div className={classNames('activity-item', className)}>
      {media}
      <div className="activity-item-content">
        <div className="activity-item-text">
          <p className="activity-item-label">{heading}</p>
          <p className="activity-item-time">{secondary}</p>
        </div>
        {isWithdrawal ? (
          <p className="activity-item-withdrawal">
            <span className="activity-item-minus">-</span>
            <span>{amount}</span>
          </p>
        ) : (
          <span className="activity-item-amount">{amount}</span>
        )}
      </div>
    </div>
  )
}
