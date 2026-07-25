import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { Nav, type NavItemConfig } from './Nav'

const DEFAULT_ITEM_NAMES = ['Home', 'Wallet', 'Add', 'Learn', 'Profile']

function navItems() {
  return DEFAULT_ITEM_NAMES.map((name) => screen.getByRole('button', { name }))
}

describe('Nav', () => {
  it('renders the five default items inside a primary navigation landmark', () => {
    renderThemed(<Nav />)

    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(navItems()).toHaveLength(5)
  })

  describe('selection', () => {
    it.each([
      ['Home', 'home'],
      ['Wallet', 'wallet'],
      ['Learn', 'learn'],
      ['Profile', 'profile'],
    ])('calls onItemSelect with the item key when %s is clicked', async (name, key) => {
      const onItemSelect = vi.fn()
      const { user } = renderThemed(<Nav onItemSelect={onItemSelect} />)

      await user.click(screen.getByRole('button', { name }))

      expect(onItemSelect).toHaveBeenCalledExactlyOnceWith(key)
    })

    it('routes the centre Add action to onItemSelect when onAddSelect is absent', async () => {
      const onItemSelect = vi.fn()
      const { user } = renderThemed(<Nav onItemSelect={onItemSelect} />)

      await user.click(screen.getByRole('button', { name: 'Add' }))

      expect(onItemSelect).toHaveBeenCalledExactlyOnceWith('add')
    })

    it('routes the centre Add action to onAddSelect only when it is supplied', async () => {
      const onItemSelect = vi.fn()
      const onAddSelect = vi.fn()
      const { user } = renderThemed(<Nav onItemSelect={onItemSelect} onAddSelect={onAddSelect} />)

      await user.click(screen.getByRole('button', { name: 'Add' }))

      expect(onAddSelect).toHaveBeenCalledOnce()
      expect(onItemSelect).not.toHaveBeenCalled()
    })

    it('leaves the other items routed to onItemSelect when onAddSelect is supplied', async () => {
      const onItemSelect = vi.fn()
      const onAddSelect = vi.fn()
      const { user } = renderThemed(<Nav onItemSelect={onItemSelect} onAddSelect={onAddSelect} />)

      await user.click(screen.getByRole('button', { name: 'Wallet' }))

      expect(onItemSelect).toHaveBeenCalledExactlyOnceWith('wallet')
      expect(onAddSelect).not.toHaveBeenCalled()
    })

    it('calls the per-item onSelect alongside onItemSelect', async () => {
      const onSelect = vi.fn()
      const onItemSelect = vi.fn()
      const items: NavItemConfig[] = [
        { key: 'home', icon: 'home', label: 'Home' },
        { key: 'saved', icon: 'piggybank', label: 'Saved', onSelect },
      ]
      const { user } = renderThemed(<Nav items={items} onItemSelect={onItemSelect} />)

      await user.click(screen.getByRole('button', { name: 'Saved' }))

      expect(onSelect).toHaveBeenCalledOnce()
      expect(onItemSelect).toHaveBeenCalledExactlyOnceWith('saved')
    })

    it('calls the per-item onSelect for the Add action even when onAddSelect takes over', async () => {
      const onSelect = vi.fn()
      const onAddSelect = vi.fn()
      const items: NavItemConfig[] = [
        { key: 'add', icon: 'plus', label: 'Add', isPrimary: true, onSelect },
      ]
      const { user } = renderThemed(<Nav items={items} onAddSelect={onAddSelect} />)

      await user.click(screen.getByRole('button', { name: 'Add' }))

      expect(onSelect).toHaveBeenCalledOnce()
      expect(onAddSelect).toHaveBeenCalledOnce()
    })
  })

  describe('active item', () => {
    it('marks Home as the current page by default', () => {
      renderThemed(<Nav />)

      expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    })

    it.each(['wallet', 'learn', 'profile'])('sets aria-current on the %s item', (key) => {
      renderThemed(<Nav activeItem={key} />)

      const current = screen.getAllByRole('button').filter((item) => item.getAttribute('aria-current') === 'page')
      expect(current).toHaveLength(1)
      expect(current[0]).toHaveAccessibleName(`${key[0].toUpperCase()}${key.slice(1)}`)
    })

    it('marks no item as current when activeItem matches nothing', () => {
      renderThemed(<Nav activeItem="nowhere" />)

      expect(
        screen.getAllByRole('button').filter((item) => item.hasAttribute('aria-current')),
      ).toHaveLength(0)
    })
  })

  describe('keyboard navigation', () => {
    it('reaches every destination with Tab', async () => {
      const { user } = renderThemed(<Nav />)

      for (const label of ['Home', 'Wallet', 'Add', 'Learn', 'Profile']) {
        await user.tab()
        expect(screen.getByRole('button', { name: label })).toHaveFocus()
      }
    })

    it('leaves every control in the tab sequence', () => {
      renderThemed(<Nav activeItem="wallet" />)

      for (const label of ['Home', 'Wallet', 'Add', 'Learn', 'Profile']) {
        expect(screen.getByRole('button', { name: label })).not.toHaveAttribute('tabindex')
      }
    })

    it('moves focus to the next item on ArrowRight', async () => {
      const { user } = renderThemed(<Nav />)

      await user.tab()
      await user.keyboard('{ArrowRight}')

      expect(screen.getByRole('button', { name: 'Wallet' })).toHaveFocus()
    })

    it('wraps from the last item to the first on ArrowRight', async () => {
      const { user } = renderThemed(<Nav />)

      await user.tab()
      await user.keyboard('{End}{ArrowRight}')

      expect(screen.getByRole('button', { name: 'Home' })).toHaveFocus()
    })

    it('wraps from the first item to the last on ArrowLeft', async () => {
      const { user } = renderThemed(<Nav />)

      await user.tab()
      await user.keyboard('{ArrowLeft}')

      expect(screen.getByRole('button', { name: 'Profile' })).toHaveFocus()
    })

    it('moves focus to the first item on Home and the last on End', async () => {
      const { user } = renderThemed(<Nav />)

      await user.tab()
      await user.keyboard('{End}')
      expect(screen.getByRole('button', { name: 'Profile' })).toHaveFocus()

      await user.keyboard('{Home}')
      expect(screen.getByRole('button', { name: 'Home' })).toHaveFocus()
    })

    it('ignores keys it does not handle', async () => {
      const { user } = renderThemed(<Nav />)

      await user.tab()
      await user.keyboard('{ArrowDown}')

      expect(screen.getByRole('button', { name: 'Home' })).toHaveFocus()
    })
  })

  // Each control already carries its label as screen-reader-only text, so in a
  // layout-free environment the visible label is only distinguishable by its class.
  describe('labels', () => {
    it('hides the item labels from view by default', () => {
      renderThemed(<Nav />)

      expect(document.querySelectorAll('.nav-item-label')).toHaveLength(0)
    })

    it('renders visible labels under each item when showLabels is set', () => {
      renderThemed(<Nav showLabels />)

      const labels = Array.from(document.querySelectorAll('.nav-item-label')).map(
        (node) => node.textContent,
      )
      expect(labels).toEqual(DEFAULT_ITEM_NAMES)
    })

    it('renames the centre action with addLabel', () => {
      renderThemed(<Nav addLabel="New transfer" />)

      expect(screen.getByRole('button', { name: 'New transfer' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Add' })).not.toBeInTheDocument()
    })
  })

  describe('custom items', () => {
    it('replaces the default items entirely', () => {
      const items: NavItemConfig[] = [
        { key: 'a', icon: 'home', label: 'Alpha' },
        { key: 'b', icon: 'chart', label: 'Beta' },
      ]
      renderThemed(<Nav items={items} activeItem="a" />)

      expect(screen.getAllByRole('button')).toHaveLength(2)
      expect(screen.getByRole('button', { name: 'Alpha' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Wallet' })).not.toBeInTheDocument()
    })

    it('renders an item with href as a link that still reports its selection', async () => {
      const onItemSelect = vi.fn()
      const items: NavItemConfig[] = [{ key: 'home', icon: 'home', label: 'Home', href: '#home' }]
      const { user } = renderThemed(<Nav items={items} onItemSelect={onItemSelect} />)

      const link = screen.getByRole('link', { name: 'Home' })
      expect(link).toHaveAttribute('href', '#home')

      await user.click(link)

      expect(onItemSelect).toHaveBeenCalledExactlyOnceWith('home')
    })

    it('moves focus across link items with the arrow keys too', async () => {
      const items: NavItemConfig[] = [
        { key: 'home', icon: 'home', label: 'Home', href: '#home' },
        { key: 'learn', icon: 'learn', label: 'Learn', href: '#learn' },
      ]
      const { user } = renderThemed(<Nav items={items} />)

      await user.tab()
      await user.keyboard('{ArrowRight}')

      expect(screen.getByRole('link', { name: 'Learn' })).toHaveFocus()
    })
  })
})
