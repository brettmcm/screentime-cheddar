import { describe, expect, it } from 'vitest'
import { Tag } from '../tag/Tag'
import { renderThemed } from '../../test/render'
import { TotalSavingsCard } from './TotalSavingsCard'

describe('TotalSavingsCard accessibility', () => {
  it('renders the hero balance without violations', async () => {
    const { container, getByText } = renderThemed(<TotalSavingsCard amount={1284.5} />)

    expect(getByText('Total savings')).toBeInTheDocument()
    expect(getByText('$1,284')).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes the brand logo badge as a named image', async () => {
    const { container, getByRole } = renderThemed(<TotalSavingsCard amount="$1,284.50" showLogo />)

    expect(getByRole('img', { name: 'Cheddar logo' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations with a custom badge in place of the logo', async () => {
    const { container, getByRole } = renderThemed(
      <TotalSavingsCard amount="$1,284.50" badge={<Tag label="On track" dismissible={false} />} />,
    )

    expect(getByRole('article')).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('reaches every action button by Tab with no positive tabIndex', async () => {
    const { container, getByRole, user } = renderThemed(
      <TotalSavingsCard
        amount={1284.5}
        actions={[
          { label: 'Add money', icon: 'deposit', onClick: () => {} },
          { label: 'Withdraw', icon: 'withdraw', onClick: () => {} },
        ]}
      />,
    )

    await user.tab()
    expect(getByRole('button', { name: 'Add money' })).toHaveFocus()

    await user.tab()
    expect(getByRole('button', { name: 'Withdraw' })).toHaveFocus()

    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
    await expect(container).toHaveNoAxeViolations()
  })
})
