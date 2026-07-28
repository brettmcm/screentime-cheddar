import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { GoalSummaryCard } from './GoalSummaryCard'

const items = [
  { id: 'camera', label: 'Camera', amount: 500 },
  { id: 'trip', label: 'Ski trip', amount: 18.2 },
  { id: 'shoes', label: 'Sneakers', amount: 100 },
]

describe('GoalSummaryCard accessibility', () => {
  it('exposes the breakdown as a list with one item per goal', async () => {
    const { container, getAllByRole, getByRole } = renderThemed(
      <GoalSummaryCard title="Where your money is" items={items} />,
    )

    expect(getByRole('list')).toBeInTheDocument()
    expect(getAllByRole('listitem')).toHaveLength(3)
    await expect(container).toHaveNoAxeViolations()
  })

  it('renders the derived total without violations', async () => {
    const { container, getByText } = renderThemed(<GoalSummaryCard items={items} />)

    expect(getByText('$618.20')).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('renders an explicit total and label without violations', async () => {
    const { container, getByText } = renderThemed(
      <GoalSummaryCard items={items} total="$620.00" totalLabel="All goals" />,
    )

    expect(getByText('All goals')).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations with an empty breakdown', async () => {
    const { container } = renderThemed(<GoalSummaryCard items={[]} />)

    await expect(container).toHaveNoAxeViolations()
  })
})
