import type { HTMLAttributes, ReactNode } from 'react'
import { Avatar } from '../avatar/Avatar'
import { Button } from '../button/Button'
import type { IconName } from '../icon/Icon'
import { classNames } from '../utils/classNames'

export type ProfileCardAction = {
  label: string
  icon?: IconName
  onClick?: () => void
}

export type ProfileCardProps = {
  name: string
  handle?: string
  avatarSrc?: string
  avatarAlt?: string
  initials?: string
  avatarSize?: '40' | '32' | '24'
  actions?: ProfileCardAction[]
  children?: ReactNode
} & HTMLAttributes<HTMLElement>

/** The Profile screen header card: avatar, name, handle and a row of actions. */
export function ProfileCard({
  name,
  handle,
  avatarSrc,
  avatarAlt,
  initials,
  avatarSize = '40',
  actions,
  children,
  className,
  ...rest
}: ProfileCardProps) {
  return (
    <article className={classNames('profile-card', className)} {...rest}>
      <span className="profile-card-avatar">
        <Avatar src={avatarSrc} alt={avatarAlt} initials={initials} name={name} size={avatarSize} />
      </span>
      <p className="profile-card-name">{name}</p>
      {handle ? <p className="profile-card-handle">{handle}</p> : null}
      {actions?.length ? (
        <div className="profile-card-actions">
          {actions.map((action) => (
            <Button
              key={action.label}
              label={action.label}
              icon={action.icon}
              variant="secondary"
              size="large"
              className="profile-card-action"
              onClick={action.onClick}
            />
          ))}
        </div>
      ) : null}
      {children}
    </article>
  )
}
