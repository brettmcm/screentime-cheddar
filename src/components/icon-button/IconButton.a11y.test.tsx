import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { IconButton } from './IconButton'

describe('IconButton accessibility', () => {
  it('names the icon-only control from its label in the default state', async () => {
    const { container, getByRole } = renderThemed(<IconButton />)

    expect(getByRole('button', { name: 'Icon action' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('uses the supplied label rather than the icon name', async () => {
    const { container, getByRole } = renderThemed(<IconButton icon="plus" label="Add money" />)

    expect(getByRole('button', { name: 'Add money' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it.each(['primary', 'neutral', 'outline', 'ghost'] as const)(
    'stays free of violations in the %s variant',
    async (variant) => {
      const { container } = renderThemed(<IconButton variant={variant} label="Dismiss" />)

      await expect(container).toHaveNoAxeViolations()
    },
  )

  it('stays named at the small size', async () => {
    const { container, getByRole } = renderThemed(<IconButton size="small" icon="x" label="Close" />)

    expect(getByRole('button', { name: 'Close' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('drops out of the tab order when disabled without losing its name', async () => {
    const { container, getByRole, user } = renderThemed(<IconButton label="Close" disabled />)

    await user.tab()
    expect(getByRole('button', { name: 'Close' })).not.toHaveFocus()
    await expect(container).toHaveNoAxeViolations()
  })

  it('is reachable by Tab and carries no positive tabIndex', async () => {
    const { container, getByRole, user } = renderThemed(<IconButton label="Edit" icon="edit" />)

    await user.tab()
    expect(getByRole('button', { name: 'Edit' })).toHaveFocus()
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
  })
})
