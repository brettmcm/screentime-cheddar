import { IconButton } from '../icon-button/IconButton'
import { classNames } from '../utils/classNames'
import type { IconName } from '../icon/Icon'

type NavItem = 'home' | 'wallet' | 'learn' | 'profile'

export type NavProps = {
  activeItem?: NavItem
}

type NavButtonKey = NavItem | 'add'
type NavItemConfig = { key: NavButtonKey; icon: IconName; label: string; isPrimary?: boolean }

const navItems: NavItemConfig[] = [
  { key: 'home', icon: 'home', label: 'Home' },
  { key: 'wallet', icon: 'wallet', label: 'Wallet' },
  { key: 'add', icon: 'plus', label: 'Add', isPrimary: true },
  { key: 'learn', icon: 'learn', label: 'Learn' },
  { key: 'profile', icon: 'profile', label: 'Profile' },
]

export function Nav({ activeItem = 'home' }: NavProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <ul>
        {navItems.map((item) => (
          <li key={item.key} className="nav-item">
            <IconButton
              icon={item.icon}
              variant={item.isPrimary ? 'primary' : 'ghost'}
              className={classNames(
                item.isPrimary ? 'nav-icon-add' : 'nav-icon',
                !item.isPrimary && activeItem === item.key && 'nav-icon-active',
              )}
              label={item.label}
              aria-current={!item.isPrimary && activeItem === item.key ? 'page' : undefined}
            />
            {!item.isPrimary ? (
              <span
                className={classNames('nav-item-indicator', activeItem === item.key && 'nav-item-indicator-active')}
                aria-hidden="true"
              />
            ) : null}
          </li>
        ))}
      </ul>
      <div className="home-indicator" aria-hidden="true" />
    </nav>
  )
}
