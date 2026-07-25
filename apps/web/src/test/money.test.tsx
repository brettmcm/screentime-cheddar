import { screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { dialog, enterApp, goalCard, typeAmount } from './renderApp'

const nav = () => screen.getByRole('navigation', { name: 'Primary' })

/** Seed data: Headphones $76.50/$280, Sneakers $100/$120, Freshman Trip $18.20/$500. */
describe('deposit', () => {
  it('credits the chosen goal', async () => {
    const user = await enterApp()

    await user.click(screen.getByRole('button', { name: 'Deposit' }))
    await user.click(within(dialog()).getByRole('radio', { name: /Headphones/ }))
    await typeAmount(user, '20')
    await user.click(within(dialog()).getByRole('button', { name: 'Confirm deposit' }))

    expect(goalCard('Headphones')).toHaveAccessibleName(
      'Headphones, $96.50 of $280.00, 34% saved',
    )
  })

  it('refuses to submit without a goal and an amount', async () => {
    const user = await enterApp()

    await user.click(screen.getByRole('button', { name: 'Deposit' }))
    const confirm = within(dialog()).getByRole('button', { name: 'Confirm deposit' })
    expect(confirm).toBeDisabled()

    await user.click(within(dialog()).getByRole('radio', { name: /Headphones/ }))
    expect(confirm).toBeDisabled()

    await typeAmount(user, '5')
    expect(confirm).toBeEnabled()
  })
})

describe('transfer from a goal', () => {
  it('sends from the goal it was opened on', async () => {
    const user = await enterApp()
    await user.click(goalCard('Headphones'))

    await user.click(screen.getByRole('button', { name: 'Transfer' }))
    const to = within(within(dialog()).getByRole('group', { name: 'To' }))
    await user.click(to.getByRole('radio', { name: /^Freshman Trip/ }))
    await typeAmount(user, '6.50')
    await user.click(within(dialog()).getByRole('button', { name: 'Confirm transfer' }))

    // The detail screen leads with the saved-of-target readout, split for type size.
    expect(screen.getByText('$70')).toBeInTheDocument()
    expect(screen.getByText('/ $280.00')).toBeInTheDocument()
  })

  it('preselects that goal as the source', async () => {
    const user = await enterApp()
    await user.click(goalCard('Headphones'))
    await user.click(screen.getByRole('button', { name: 'Transfer' }))

    const from = within(within(dialog()).getByRole('group', { name: 'From' }))
    expect(from.getByRole('radio', { name: /^Headphones/ })).toBeChecked()
  })

  it('cannot send more than the goal holds', async () => {
    const user = await enterApp()
    await user.click(goalCard('Headphones'))
    await user.click(screen.getByRole('button', { name: 'Transfer' }))
    const to = within(within(dialog()).getByRole('group', { name: 'To' }))
    await user.click(to.getByRole('radio', { name: /^Freshman Trip/ }))

    await typeAmount(user, '999')

    expect(within(dialog()).getByRole('button', { name: 'Confirm transfer' })).toBeDisabled()
  })
})

describe('transfer', () => {
  const picker = (legend: 'From' | 'To') =>
    within(within(dialog()).getByRole('group', { name: legend }))

  const openTransfer = async (user: Awaited<ReturnType<typeof enterApp>>) => {
    await user.click(screen.getByRole('button', { name: 'Transfer' }))
    await user.click(picker('From').getByRole('radio', { name: /^Headphones/ }))
    await user.click(picker('To').getByRole('radio', { name: /^Freshman Trip/ }))
    await typeAmount(user, '10')
    await user.click(within(dialog()).getByRole('button', { name: 'Confirm transfer' }))
  }

  it('moves money from one goal to another instead of depositing', async () => {
    const user = await enterApp()

    await openTransfer(user)

    // The source is debited...
    expect(goalCard('Headphones')).toHaveAccessibleName('Headphones, $66.50 of $280.00, 24% saved')
    // ...and the destination credited by the same amount.
    expect(goalCard('Freshman Trip')).toHaveAccessibleName(
      'Freshman Trip, $28.20 of $500.00, 6% saved',
    )
  })

  it('leaves total savings unchanged', async () => {
    const user = await enterApp()
    const total = () => screen.getByText('Total savings').closest('article')?.textContent

    const before = total()
    await openTransfer(user)

    expect(total()).toBe(before)
  })

  /** The newest entry is the one the transfer just wrote. */
  const latestActivity = () => within(screen.getAllByRole('listitem')[0])

  it('records a withdrawal against the source goal', async () => {
    const user = await enterApp()
    await openTransfer(user)

    await user.click(goalCard('Headphones'))

    expect(latestActivity().getByText('Withdrawal')).toBeInTheDocument()
    expect(latestActivity().getByText('$10.00')).toBeInTheDocument()
  })

  it('credits the destination goal with a deposit', async () => {
    const user = await enterApp()
    await openTransfer(user)

    await user.click(goalCard('Freshman Trip'))

    expect(latestActivity().getByText('Deposit')).toBeInTheDocument()
    expect(latestActivity().getByText('$10.00')).toBeInTheDocument()
  })

  it('cannot send a goal to itself', async () => {
    const user = await enterApp()
    await user.click(screen.getByRole('button', { name: 'Transfer' }))

    await user.click(picker('From').getByRole('radio', { name: /^Headphones/ }))

    // The chosen source is removed from the destination list entirely.
    expect(picker('To').queryByRole('radio', { name: /^Headphones/ })).not.toBeInTheDocument()
    expect(picker('To').getByRole('radio', { name: /^Sneakers/ })).toBeInTheDocument()
  })

  it('cannot move more than the source holds', async () => {
    const user = await enterApp()
    await user.click(screen.getByRole('button', { name: 'Transfer' }))
    await user.click(picker('From').getByRole('radio', { name: /^Headphones/ }))
    await user.click(picker('To').getByRole('radio', { name: /^Sneakers/ }))

    await typeAmount(user, '999')

    expect(within(dialog()).getByRole('button', { name: 'Confirm transfer' })).toBeDisabled()
  })
})

describe('goal completion', () => {
  it('files a finished goal and celebrates it', async () => {
    const user = await enterApp()

    // Sneakers needs $20 to reach its $120 target.
    await user.click(screen.getByRole('button', { name: 'Deposit' }))
    await user.click(within(dialog()).getByRole('radio', { name: /Sneakers/ }))
    await typeAmount(user, '20')
    await user.click(within(dialog()).getByRole('button', { name: 'Confirm deposit' }))

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Goal Reached' })).toBeInTheDocument(),
    )
    expect(screen.getByText('You saved $120.00 for Sneakers')).toBeInTheDocument()
  })

  it('moves the goal into the completed carousel', async () => {
    const user = await enterApp()
    await user.click(screen.getByRole('button', { name: 'Deposit' }))
    await user.click(within(dialog()).getByRole('radio', { name: /Sneakers/ }))
    await typeAmount(user, '20')
    await user.click(within(dialog()).getByRole('button', { name: 'Confirm deposit' }))
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Goal Reached' })).toBeInTheDocument(),
    )

    const slider = screen.getByRole('slider')
    slider.focus()
    await user.keyboard('{End}')
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Hi, Jamie' })).toBeInTheDocument(),
    )

    await user.click(within(nav()).getByRole('button', { name: 'Wallet' }))
    expect(screen.getByRole('button', { name: /^Sneakers/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Sneakers, \$/ })).not.toBeInTheDocument()
  })
})
