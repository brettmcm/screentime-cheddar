import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { GoalSummaryCard } from './GoalSummaryCard'

const items = [
  { label: 'New bike', amount: 300 },
  { label: 'Concert tickets', amount: 240 },
]

describe('GoalSummaryCard', () => {
  it('renders one row per item with its formatted amount', () => {
    renderThemed(<GoalSummaryCard items={items} />)

    const rows = screen.getAllByRole('listitem')
    expect(rows).toHaveLength(2)
    expect(within(rows[0]).getByText('New bike')).toBeInTheDocument()
    expect(within(rows[0]).getByText('$300.00')).toBeInTheDocument()
  })

  it('renders the title when given', () => {
    renderThemed(<GoalSummaryCard title="Where your money sits" items={items} />)

    expect(screen.getByText('Where your money sits')).toBeInTheDocument()
  })

  describe('total', () => {
    it('sums the item amounts when total is omitted', () => {
      renderThemed(<GoalSummaryCard items={items} />)

      expect(screen.getByText('Total savings')).toBeInTheDocument()
      expect(screen.getByText('$540.00')).toBeInTheDocument()
    })

    it('lets an explicit total win', () => {
      renderThemed(<GoalSummaryCard items={items} total={1000} />)

      expect(screen.getByText('$1,000.00')).toBeInTheDocument()
      expect(screen.queryByText('$540.00')).not.toBeInTheDocument()
    })

    it('renames the total row', () => {
      renderThemed(<GoalSummaryCard items={items} totalLabel="All goals" />)

      expect(screen.getByText('All goals')).toBeInTheDocument()
    })

    it('omits the total row when an item amount is not a number', () => {
      renderThemed(
        <GoalSummaryCard items={[{ label: 'New bike', amount: 'Just started' }, items[1]]} />,
      )

      expect(screen.queryByText('Total savings')).not.toBeInTheDocument()
    })
  })

  it('formats money with a custom formatter', () => {
    renderThemed(<GoalSummaryCard items={items} formatAmount={(value) => `${value} pts`} />)

    expect(screen.getByText('300 pts')).toBeInTheDocument()
    expect(screen.getByText('540 pts')).toBeInTheDocument()
  })

  it('renders an empty list with a zero total', () => {
    renderThemed(<GoalSummaryCard items={[]} />)

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    expect(screen.getByText('$0.00')).toBeInTheDocument()
  })
})
