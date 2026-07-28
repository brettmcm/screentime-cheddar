import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { SavingsStreak } from './SavingsStreak'

const week = [
  { id: 'mon', label: 'M', name: 'Monday', complete: true },
  { id: 'tue', label: 'T', name: 'Tuesday', complete: true },
  { id: 'wed', label: 'W', name: 'Wednesday', today: true },
  { id: 'thu', label: 'T', name: 'Thursday' },
]

describe('SavingsStreak accessibility', () => {
  it('spells out each day and its state rather than the ambiguous letter', async () => {
    const { container, getAllByRole } = renderThemed(<SavingsStreak days={week} />)

    expect(getAllByRole('listitem').map((day) => day.getAttribute('aria-label'))).toEqual([
      'Monday: saved',
      'Tuesday: saved',
      'Wednesday: not saved',
      'Thursday: not saved',
    ])
    await expect(container).toHaveNoAxeViolations()
  })

  it('hides the single-letter marks from assistive tech', async () => {
    const { container } = renderThemed(<SavingsStreak days={week} />)

    for (const mark of container.querySelectorAll('.savings-streak-label, .savings-streak-mark')) {
      expect(mark).toHaveAttribute('aria-hidden', 'true')
    }
    await expect(container).toHaveNoAxeViolations()
  })

  it('falls back to the visible letter when a day has no spoken name', async () => {
    const { container, getAllByRole } = renderThemed(
      <SavingsStreak days={[{ label: 'F', complete: true }]} completeLabel="done" />,
    )

    expect(getAllByRole('listitem')[0]).toHaveAttribute('aria-label', 'F: done')
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations with an empty week', async () => {
    const { container } = renderThemed(<SavingsStreak days={[]} />)

    await expect(container).toHaveNoAxeViolations()
  })
})
