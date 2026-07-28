import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { Search } from './Search'

describe('Search accessibility', () => {
  it('names the field and hides the decorative icon in the default state', async () => {
    const { container, getByRole } = renderThemed(<Search />)

    expect(getByRole('searchbox', { name: 'Search' })).toBeInTheDocument()
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    await expect(container).toHaveNoAxeViolations()
  })

  it('uses a custom label as the accessible name', async () => {
    const { container, getByRole } = renderThemed(<Search label="Search transactions" />)

    expect(getByRole('searchbox', { name: 'Search transactions' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('describes the field with its helper text', async () => {
    const { container, getByRole } = renderThemed(<Search description="Try a merchant name" />)

    expect(getByRole('searchbox', { name: 'Search' })).toHaveAccessibleDescription('Try a merchant name')
    await expect(container).toHaveNoAxeViolations()
  })

  it('marks the invalid state and references the message from aria-describedby', async () => {
    const { container, getByRole, getByText } = renderThemed(<Search error="No results found" />)

    const input = getByRole('searchbox', { name: 'Search' })
    const message = getByText('No results found')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect((input.getAttribute('aria-describedby') ?? '').split(' ')).toContain(message.id)
    expect(input).toHaveAccessibleDescription('No results found')
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations when disabled', async () => {
    const { container } = renderThemed(<Search disabled />)

    await expect(container).toHaveNoAxeViolations()
  })

  it('is reachable by Tab with no positive tabIndex', async () => {
    const { container, getByRole, user } = renderThemed(<Search />)

    await user.tab()
    expect(getByRole('searchbox', { name: 'Search' })).toHaveFocus()
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
  })
})
