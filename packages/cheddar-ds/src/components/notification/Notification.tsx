import type { ReactNode, Ref } from 'react'
import { IconButton } from '../icon-button/IconButton'
import { classNames } from '../utils/classNames'
import type { IconName } from '../icon/Icon'
import { Icon } from '../icon/Icon'
import coinDiscPng from '../../assets/demo/coin-disc.png'
import pieChartPng from '../../assets/demo/pie-chart.png'
import piggyBankPng from '../../assets/demo/piggy-bank.png'

type NotificationVariant = 'default' | 'trend' | 'opportunity'

export type NotificationProps = {
  /** Maps to the Figma `Type` property. */
  variant?: NotificationVariant
  label?: string
  title?: string
  body?: ReactNode
  linkLabel?: string
  onDismiss?: () => void
  onLinkClick?: () => void
  /** Overrides the per-variant illustration. */
  icon?: IconName | ReactNode
  /** Renders an image inside the illustration tile instead of an icon. */
  image?: string
  /** @default true */
  showDismiss?: boolean
  /** @default 'Dismiss' */
  dismissLabel?: string
  /** Renders the link affordance as an `<a>`. */
  href?: string
  /** Replaces the built-in link affordance. */
  action?: ReactNode
  className?: string
  ref?: Ref<HTMLElement>
}

type NotificationConfig = {
  title: string
  /** Figma places a chrome illustration here; the icon is the fallback tile. */
  image: string
  icon: IconName
  iconBg: string
  body: ReactNode
}

const notificationConfig: Record<NotificationVariant, NotificationConfig> = {
  default: {
    title: 'Nice!',
    image: piggyBankPng,
    icon: 'piggybank',
    iconBg: 'notif-illo-default',
    body: 'You’re saving 20% more than you usually are by this point each month.',
  },
  trend: {
    title: 'New trend',
    image: pieChartPng,
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
    image: coinDiscPng,
    icon: 'sparkle',
    iconBg: 'notif-illo-opportunity',
    body: 'You’re spending 35% more than you usually are by this point each month.',
  },
}

function isIconName(value: IconName | ReactNode): value is IconName {
  return typeof value === 'string'
}

export function Notification({
  variant = 'default',
  label,
  title,
  body,
  linkLabel = 'Learn more',
  onDismiss,
  onLinkClick,
  icon,
  image,
  showDismiss = true,
  dismissLabel = 'Dismiss',
  href,
  action,
  className,
  ref,
}: NotificationProps) {
  const config = notificationConfig[variant]
  const heading = label ?? title ?? config.title
  const content = body ?? config.body

  const iconOverride = icon !== undefined
  const illustration = iconOverride ? (
    isIconName(icon) ? (
      <Icon name={icon} width={36} height={36} />
    ) : (
      icon
    )
  ) : (
    <img className="notif-image" src={image ?? config.image} alt="" />
  )

  const link =
    href !== undefined ? (
      <a className="notif-link" href={href} onClick={onLinkClick}>
        <span>{linkLabel}</span>
        <Icon name="caret-right" width={4.82} height={8.7} aria-hidden="true" />
      </a>
    ) : (
      <button type="button" className="notif-link" onClick={onLinkClick}>
        <span>{linkLabel}</span>
        <Icon name="caret-right" width={4.82} height={8.7} aria-hidden="true" />
      </button>
    )

  return (
    <article
      ref={ref}
      className={classNames('notification', className)}
      aria-label={heading}
    >
      <div
        className={classNames(
          'notif-illustration',
          iconOverride && `notif-illustration-tile ${config.iconBg}`
        )}
        aria-hidden="true"
      >
        {illustration}
      </div>
      <div className="notif-body">
        <header className="notif-header">
          <h4 className="notif-title">{heading}</h4>
          {showDismiss ? (
            <IconButton
              icon="x"
              variant="neutral"
              size="small"
              label={dismissLabel}
              onClick={onDismiss}
            />
          ) : null}
        </header>
        <p className="notif-text">{content}</p>
        {action ?? link}
      </div>
    </article>
  )
}
