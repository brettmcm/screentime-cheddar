import { Icon } from '../icon/Icon'

type ActivityType = 'deposit' | 'withdrawal'

export type ActivityItemProps = {
  type?: ActivityType
  time?: string
  amount?: string
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
}: ActivityItemProps) {
  const config = defaults[type]
  const isWithdrawal = type === 'withdrawal'

  return (
    <div className="activity-item">
      <span className="activity-item-icon" aria-hidden="true">
        <Icon name={config.icon} width={24} height={24} />
      </span>
      <div className="activity-item-content">
        <div className="activity-item-text">
          <p className="activity-item-label">{config.label}</p>
          <p className="activity-item-time">{time}</p>
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
