import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { AccountCard } from './AccountCard'

describe('AccountCard accessibility', () => {
  it('renders the static row without violations', async () => {
    const { container, getByText } = renderThemed(
      <AccountCard name="Everyday checking" subtitle="•••• 4821" amount={1284.5} meta="Updated today" />,
    )

    expect(getByText('$1,284.50')).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('hides the decorative logo tile artwork when the image carries no alt text', async () => {
    const { container } = renderThemed(
      <AccountCard name="Everyday checking" amount="$1,284.50" image="/bank.png" />,
    )

    expect(container.querySelector('.account-card-image')).toHaveAttribute('aria-hidden', 'true')
    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes the tile image when it carries alt text', async () => {
    const { container, getByRole } = renderThemed(
      <AccountCard name="Everyday checking" amount="$1,284.50" image="/bank.png" imageAlt="Northgate Bank" />,
    )

    expect(getByRole('img', { name: 'Northgate Bank' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations with an icon tile and a non-default accent', async () => {
    const { container } = renderThemed(
      <AccountCard name="Travel fund" amount={420} icon="wallet" accent="blue" />,
    )

    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes the clickable row as one named button reachable by Tab', async () => {
    const { container, getByRole, user } = renderThemed(
      <AccountCard name="Everyday checking" amount="$1,284.50" onClick={() => {}} />,
    )

    const button = getByRole('button')
    expect(button).toHaveAccessibleName(/Everyday checking/)

    await user.tab()
    expect(button).toHaveFocus()
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes the linked row as one named link reachable by Tab', async () => {
    const { container, getByRole, user } = renderThemed(
      <AccountCard name="Everyday checking" amount="$1,284.50" href="/accounts/1" />,
    )

    const link = getByRole('link')
    expect(link).toHaveAccessibleName(/Everyday checking/)

    await user.tab()
    expect(link).toHaveFocus()
    await expect(container).toHaveNoAxeViolations()
  })
})
