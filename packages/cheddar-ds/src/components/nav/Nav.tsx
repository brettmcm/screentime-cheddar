import type { KeyboardEvent, Ref } from 'react'
import { useRef } from 'react'
import { IconButton } from '../icon-button/IconButton'
import { classNames } from '../utils/classNames'
import type { IconName } from '../icon/Icon'
import { Icon } from '../icon/Icon'

type NavItemKey = 'home' | 'wallet' | 'add' | 'learn' | 'profile'

export type NavItemConfig = {
  key: string
  icon: IconName
  label: string
  /** Renders an `<a>` instead of a `<button>`. */
  href?: string
  onSelect?: () => void
  /** Renders the filled centre affordance rather than a ghost icon. */
  isPrimary?: boolean
}

export type NavProps = {
  activeItem?: NavItemKey | (string & Record<never, never>)
  /** Overrides the default five items. */
  items?: NavItemConfig[]
  /**
   * Fires for every item except the centre Add action when `onAddSelect` is
   * also supplied — in that case Add routes to `onAddSelect` only.
   */
  onItemSelect?: (key: string) => void
  onAddSelect?: () => void
  /**
   * Label for the centre Add action.
   * @default 'Add'
   */
  addLabel?: string
  /** Renders the item labels as visible text under each icon. */
  showLabels?: boolean
  className?: string
  ref?: Ref<HTMLElement>
}

const defaultNavItems: NavItemConfig[] = [
  { key: 'home', icon: 'home', label: 'Home' },
  { key: 'wallet', icon: 'wallet', label: 'Wallet' },
  { key: 'add', icon: 'plus', label: 'Add', isPrimary: true },
  { key: 'learn', icon: 'learn', label: 'Learn' },
  { key: 'profile', icon: 'profile', label: 'Profile' },
]

function isAddItem(item: NavItemConfig) {
  return item.isPrimary === true || item.key === 'add'
}

export function Nav({
  activeItem = 'home',
  items = defaultNavItems,
  onItemSelect,
  onAddSelect,
  addLabel,
  showLabels = false,
  className,
  ref,
}: NavProps) {
  const listRef = useRef<HTMLUListElement>(null)

  const getControls = () =>
    Array.from(listRef.current?.querySelectorAll<HTMLElement>('.nav-item > .icon-btn') ?? [])

  const handleSelect = (item: NavItemConfig) => {
    item.onSelect?.()
    if (isAddItem(item) && onAddSelect) {
      onAddSelect()
      return
    }
    onItemSelect?.(item.key)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const controls = getControls()
    if (controls.length === 0) {
      return
    }
    const activeIndex = controls.findIndex((control) => control === document.activeElement)
    const from = activeIndex >= 0 ? activeIndex : 0
    let next: number
    if (event.key === 'ArrowLeft') {
      next = (from - 1 + controls.length) % controls.length
    } else if (event.key === 'ArrowRight') {
      next = (from + 1) % controls.length
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = controls.length - 1
    } else {
      return
    }
    event.preventDefault()
    controls[next]?.focus()
  }

  return (
    <nav ref={ref} className={classNames('bottom-nav', className)} aria-label="Primary">
      <ul ref={listRef} onKeyDown={handleKeyDown}>
        {items.map((item) => {
          const isPrimary = isAddItem(item)
          const isActive = activeItem === item.key
          const label = isPrimary ? addLabel ?? item.label : item.label
          const controlClass = classNames(
            isPrimary ? 'nav-icon-add' : 'nav-icon',
            !isPrimary && isActive && 'nav-icon-active',
          )
          const ariaCurrent = isActive ? 'page' : undefined

          return (
            <li key={item.key} className="nav-item">
              {item.href ? (
                <a
                  href={item.href}
                  className={classNames(
                    'icon-btn',
                    isPrimary ? 'icon-btn-primary' : 'icon-btn-ghost',
                    'icon-btn-medium',
                    isPrimary ? 'icon-btn-primary-medium' : 'icon-btn-ghost-medium',
                    controlClass,
                  )}
                  aria-label={label}
                  aria-current={ariaCurrent}
                  onClick={() => {
                    handleSelect(item)
                  }}
                >
                  <Icon name={item.icon} width={24} />
                  <span className="sr-only">{label}</span>
                </a>
              ) : (
                <IconButton
                  icon={item.icon}
                  variant={isPrimary ? 'primary' : 'ghost'}
                  className={controlClass}
                  label={label}
                  aria-current={ariaCurrent}
                  onClick={() => {
                    handleSelect(item)
                  }}
                />
              )}
              {showLabels ? (
                <span className="nav-item-label" aria-hidden="true">
                  {label}
                </span>
              ) : null}
              {!isPrimary ? (
                <span
                  className={classNames('nav-item-indicator', isActive && 'nav-item-indicator-active')}
                  aria-hidden="true"
                />
              ) : null}
            </li>
          )
        })}
      </ul>
      <div className="home-indicator" aria-hidden="true" />
    </nav>
  )
}
