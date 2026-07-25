import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { ActivityItem } from './ActivityItem'

describe('ActivityItem accessibility', () => {
  it('renders the static deposit row without violations', async () => {
    const { container } = renderThemed(<ActivityItem />)

    await expect(container).toHaveNoAxeViolations()
  })

  it('renders the static withdrawal row without violations', async () => {
    const { container, getByText } = renderThemed(<ActivityItem type="withdrawal" amount="$13.75" />)

    expect(getByText('Withdrawal')).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes the whole row as one named button when it is clickable', async () => {
    const { container, getByRole } = renderThemed(
      <ActivityItem title="Deposit" time="Today, 11:17am" amount="$80.00" onClick={() => {}} />,
    )

    const button = getByRole('button')
    expect(button).toHaveAccessibleName(/Deposit/)
    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes the whole row as one named link when it has an href', async () => {
    const { container, getByRole } = renderThemed(
      <ActivityItem href="/activity/1" title="Deposit" amount="$80.00" />,
    )

    expect(getByRole('link')).toHaveAccessibleName(/Deposit/)
    await expect(container).toHaveNoAxeViolations()
  })

  it('reaches the interactive row by Tab with no positive tabIndex', async () => {
    const { container, getByRole, user } = renderThemed(<ActivityItem onClick={() => {}} />)

    await user.tab()
    expect(getByRole('button')).toHaveFocus()
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
  })
})
