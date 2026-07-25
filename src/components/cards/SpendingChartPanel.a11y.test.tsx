import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { SpendingChartPanel } from './SpendingChartPanel'

const segments = [
  { id: 'travel', label: 'Travel', amount: 120 },
  { id: 'food', label: 'Food', amount: 80 },
]

describe('SpendingChartPanel accessibility', () => {
  it('summarises the bar chart in one image label and hides the bars', async () => {
    const { container, getByRole } = renderThemed(
      <SpendingChartPanel title="This month" segments={segments} />,
    )

    expect(getByRole('img')).toHaveAccessibleName(
      'This month: Travel $120.00, 60%; Food $80.00, 40%',
    )
    for (const bar of container.querySelectorAll('.chart-panel-bar-segment')) {
      expect(bar).toHaveAttribute('aria-hidden', 'true')
    }
    await expect(container).toHaveNoAxeViolations()
  })

  it('summarises the donut chart in one image label', async () => {
    const { container, getByRole } = renderThemed(
      <SpendingChartPanel type="pie" title="This month" segments={segments} />,
    )

    expect(getByRole('img')).toHaveAccessibleName(
      'This month: Travel $120.00, 60%; Food $80.00, 40%',
    )
    await expect(container).toHaveNoAxeViolations()
  })

  it('repeats the data as a legend list so it is not image-only', async () => {
    const { container, getAllByRole } = renderThemed(<SpendingChartPanel segments={segments} />)

    const legend = getAllByRole('listitem')
    expect(legend).toHaveLength(2)
    expect(legend[0]).toHaveTextContent('Travel')
    expect(legend[0]).toHaveTextContent('$120.00')
    await expect(container).toHaveNoAxeViolations()
  })

  it('names the empty chart with its empty-state copy', async () => {
    const { container, getByRole, getByText } = renderThemed(
      <SpendingChartPanel title="This month" segments={[]} emptyLabel="No spending yet" />,
    )

    expect(getByRole('img')).toHaveAccessibleName('This month: No spending yet')
    expect(getByText('No spending yet')).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })
})
