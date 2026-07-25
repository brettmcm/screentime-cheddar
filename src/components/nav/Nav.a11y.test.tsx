import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { Nav } from './Nav'

/** The five default items, in DOM order. */
const DEFAULT_LABELS = ['Home', 'Wallet', 'Add', 'Learn', 'Profile']

describe('Nav accessibility', () => {
  it('exposes a labelled navigation landmark listing every destination', async () => {
    const { container, getByRole, getAllByRole } = renderThemed(<Nav />)

    expect(getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(getAllByRole('button').map((button) => button.getAttribute('aria-label'))).toEqual(
      DEFAULT_LABELS,
    )
    await expect(container).toHaveNoAxeViolations()
  })

  it('marks the active destination with aria-current="page"', async () => {
    const { container, getByRole } = renderThemed(<Nav activeItem="wallet" />)

    expect(getByRole('button', { name: 'Wallet' })).toHaveAttribute('aria-current', 'page')
    expect(getByRole('button', { name: 'Home' })).not.toHaveAttribute('aria-current')
    await expect(container).toHaveNoAxeViolations()
  })

  it('hides the duplicated visible labels from assistive tech', async () => {
    const { container, getAllByRole } = renderThemed(<Nav showLabels />)

    // Each control already carries the label as its accessible name, so the
    // visible text below the icon must not be announced twice.
    expect(getAllByRole('button', { name: 'Home' })).toHaveLength(1)
    await expect(container).toHaveNoAxeViolations()
  })

  it('renders href items as named links', async () => {
    const { container, getByRole } = renderThemed(
      <Nav
        activeItem="home"
        items={[
          { key: 'home', icon: 'home', label: 'Home', href: '/' },
          { key: 'wallet', icon: 'wallet', label: 'Wallet', href: '/wallet' },
          { key: 'add', icon: 'plus', label: 'Add', isPrimary: true },
        ]}
      />,
    )

    expect(getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    expect(getByRole('link', { name: 'Wallet' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('renames the centre action when addLabel is supplied', async () => {
    const { container, getByRole } = renderThemed(<Nav addLabel="Add money" />)

    expect(getByRole('button', { name: 'Add money' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('keeps every item in the tab order and never a positive tabIndex', async () => {
    const { getAllByRole } = renderThemed(<Nav activeItem="learn" />)

    const items = getAllByRole('button')

    expect(items.filter((item) => item.tabIndex === 0)).toHaveLength(items.length)
    expect(items.filter((item) => item.tabIndex > 0)).toHaveLength(0)
  })

  it('moves focus between items with the arrow, Home and End keys', async () => {
    const { getByRole, user } = renderThemed(<Nav />)

    await user.tab()
    expect(getByRole('button', { name: 'Home' })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(getByRole('button', { name: 'Wallet' })).toHaveFocus()

    await user.keyboard('{ArrowLeft}')
    expect(getByRole('button', { name: 'Home' })).toHaveFocus()

    await user.keyboard('{End}')
    expect(getByRole('button', { name: 'Profile' })).toHaveFocus()

    await user.keyboard('{Home}')
    expect(getByRole('button', { name: 'Home' })).toHaveFocus()
  })

  // A bottom nav is a set of destinations, not a composite widget, so every item
  // stays in the tab order (WCAG 2.1.1). The arrow-key handler is an additional
  // shortcut rather than the only way across.
  it('makes every navigation destination reachable by Tab', async () => {
    const { getByRole, user } = renderThemed(<Nav />)

    for (const label of DEFAULT_LABELS) {
      await user.tab()
      expect(getByRole('button', { name: label })).toHaveFocus()
    }
  })
})
