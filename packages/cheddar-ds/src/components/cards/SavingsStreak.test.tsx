import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { SavingsStreak } from './SavingsStreak'

const days = [
  { label: 'M', name: 'Monday', complete: true },
  { label: 'T', name: 'Tuesday', complete: false, today: true },
]

describe('SavingsStreak', () => {
  it('renders the default title', () => {
    renderThemed(<SavingsStreak days={days} />)

    expect(screen.getByText('Savings streak')).toBeInTheDocument()
  })

  it('renames the title', () => {
    renderThemed(<SavingsStreak title="This week" days={days} />)

    expect(screen.getByText('This week')).toBeInTheDocument()
  })

  it('renders one item per day', () => {
    renderThemed(<SavingsStreak days={days} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('spells out each day and its state for assistive tech', () => {
    renderThemed(<SavingsStreak days={days} />)

    expect(screen.getByLabelText('Monday: saved')).toBeInTheDocument()
    expect(screen.getByLabelText('Tuesday: not saved')).toBeInTheDocument()
  })

  it('falls back to the visible letter when a day has no spoken name', () => {
    renderThemed(<SavingsStreak days={[{ label: 'W', complete: true }]} />)

    expect(screen.getByLabelText('W: saved')).toBeInTheDocument()
  })

  it('renames the state labels', () => {
    renderThemed(<SavingsStreak days={days} completeLabel="done" incompleteLabel="pending" />)

    expect(screen.getByLabelText('Monday: done')).toBeInTheDocument()
    expect(screen.getByLabelText('Tuesday: pending')).toBeInTheDocument()
  })

  it('marks the completed and current days', () => {
    renderThemed(<SavingsStreak days={days} />)

    const [monday, tuesday] = screen.getAllByRole('listitem')
    expect(monday).toHaveClass('savings-streak-day-complete')
    expect(tuesday).toHaveClass('savings-streak-day-today')
  })

  it('renders an empty week without days', () => {
    renderThemed(<SavingsStreak days={[]} />)

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})
