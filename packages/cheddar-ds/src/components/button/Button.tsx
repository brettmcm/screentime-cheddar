import type { ButtonHTMLAttributes } from 'react'
import { classNames } from '../utils/classNames'
import type { IconName } from '../icon/Icon'
import { Icon } from '../icon/Icon'

type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'large' | 'medium' | 'small'

export type ButtonProps = {
  label: string
  icon?: IconName
  variant?: ButtonVariant
  size?: ButtonSize
  showIcon?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

export function Button({
  label,
  icon,
  variant = 'primary',
  size = 'large',
  showIcon = false,
  className,
  disabled,
  ...buttonProps
}: ButtonProps) {
  const iconName = icon ?? (showIcon ? (size === 'small' ? 'caret-down' : 'home') : undefined)
  const classes = classNames(
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    variant === 'secondary' && size === 'small' && 'btn-secondary-small-fill',
    className,
  )

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      {...buttonProps}
    >
      {iconName ? <Icon name={iconName} width={size === 'small' ? 12 : 20} /> : null}
      <span>{label}</span>
    </button>
  )
}
