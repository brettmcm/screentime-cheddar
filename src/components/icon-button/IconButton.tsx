import type { ButtonHTMLAttributes } from 'react'
import { classNames } from '../utils/classNames'
import type { IconName } from '../icon/Icon'
import { Icon } from '../icon/Icon'

type IconButtonVariant = 'primary' | 'neutral' | 'outline' | 'ghost'
type IconButtonSize = 'medium' | 'small'

export type IconButtonProps = {
  icon?: IconName
  variant?: IconButtonVariant
  size?: IconButtonSize
  label?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

export function IconButton({
  icon = 'x',
  variant = 'primary',
  size = 'medium',
  label = 'Icon action',
  className,
  disabled,
  ...buttonProps
}: IconButtonProps) {
  const classes = classNames(
    'icon-btn',
    `icon-btn-${variant}`,
    `icon-btn-${size}`,
    `icon-btn-${variant}-${size}`,
    className,
  )

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      aria-label={label}
      {...buttonProps}
    >
      <Icon name={icon} width={size === 'small' ? 16 : 24} />
      <span className="sr-only">{label}</span>
    </button>
  )
}
