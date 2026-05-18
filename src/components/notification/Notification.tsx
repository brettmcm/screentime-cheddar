import type { ReactNode } from 'react'
import { IconButton } from '../icon-button/IconButton'
import type { IconName } from '../icon/Icon'
import { Icon } from '../icon/Icon'

type NotificationVariant = 'default' | 'trend' | 'opportunity'

export type NotificationProps = {
  variant?: NotificationVariant
  label?: string
  title?: string
  body?: ReactNode
  linkLabel?: string
  onDismiss?: () => void
  onLinkClick?: () => void
}

type NotificationConfig = {
  title: string
  icon: IconName
  iconBg: string
  body: ReactNode
}

const notificationConfig: Record<NotificationVariant, NotificationConfig> = {
  default: {
    title: 'Nice!',
    icon: 'piggybank',
    iconBg: 'notif-illo-default',
    body: 'You’re saving 20% more than you usually are by this point each month.',
  },
  trend: {
    title: 'New trend',
    icon: 'chart',
    iconBg: 'notif-illo-trend',
    body: (
      <>
        You’re spending more on <strong>Travel</strong> this month than you usually do.
      </>
    ),
  },
  opportunity: {
    title: 'Watch out!',
    icon: 'sparkle',
    iconBg: 'notif-illo-opportunity',
    body: 'You’re spending 35% more than you usually are by this point each month.',
  },
}

export function Notification({
  variant = 'default',
  label,
  title,
  body,
  linkLabel = 'Learn more',
  onDismiss,
  onLinkClick,
}: NotificationProps) {
  const config = notificationConfig[variant]
  const heading =
    variant === 'default' ? label ?? title ?? config.title : config.title
  const content = body ?? config.body

  return (
    <article className="notification" aria-label={heading}>
      <div className={`notif-illustration ${config.iconBg}`} aria-hidden="true">
        <Icon name={config.icon} width={36} height={36} />
      </div>
      <div className="notif-body">
        <header className="notif-header">
          <h4 className="notif-title">{heading}</h4>
          <IconButton
            icon="x"
            variant="neutral"
            size="small"
            onClick={onDismiss}
          />
        </header>
        <p className="notif-text">{content}</p>
        <button type="button" className="notif-link" onClick={onLinkClick}>
          <span>{linkLabel}</span>
          <Icon name="caret-right" width={12} height={12} aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}
