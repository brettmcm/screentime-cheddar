import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { SpendingChartPanel } from './SpendingChartPanel'

const segments = [
  { label: 'Travel', amount: 300 },
  { label: 'Food', amount: 100 },
]

describe('SpendingChartPanel', () => {
  it('renders the title', () => {
    renderThemed(<SpendingChartPanel title="This month" segments={segments} />)

    expect(screen.getByText('This month')).toBeInTheDocument()
  })

  it('renders the badge', () => {
    renderThemed(<SpendingChartPanel title="This month" badge={<span>+8%</span>} segments={segments} />)

    expect(screen.getByText('+8%')).toBeInTheDocument()
  })

  describe('legend', () => {
    it('renders one row per segment with its formatted amount', () => {
      renderThemed(<SpendingChartPanel segments={segments} />)

      const rows = screen.getAllByRole('listitem')
      expect(rows).toHaveLength(2)
      expect(within(rows[0]).getByText('Travel')).toBeInTheDocument()
      expect(within(rows[0]).getByText('$300.00')).toBeInTheDocument()
    })

    it('formats money with a custom formatter', () => {
      renderThemed(
        <SpendingChartPanel segments={segments} formatAmount={(value) => `${value} pts`} />,
      )

      expect(screen.getByText('300 pts')).toBeInTheDocument()
    })
  })

  describe('total', () => {
    it('sums the segments when total is omitted', () => {
      renderThemed(<SpendingChartPanel segments={segments} />)

      expect(screen.getByText('$400.00')).toBeInTheDocument()
    })

    it('lets an explicit total win', () => {
      renderThemed(<SpendingChartPanel segments={segments} total={999} />)

      expect(screen.getByText('$999.00')).toBeInTheDocument()
    })
  })

  describe('chart', () => {
    it('summarises the bar chart for assistive tech', () => {
      renderThemed(<SpendingChartPanel title="This month" segments={segments} />)

      expect(
        screen.getByRole('img', { name: 'This month: Travel $300.00, 75%; Food $100.00, 25%' }),
      ).toBeInTheDocument()
    })

    it('renders a donut when type is pie', () => {
      const { container } = renderThemed(<SpendingChartPanel type="pie" segments={segments} />)

      expect(container.querySelector('.chart-panel-donut')).toBeInTheDocument()
      expect(container.querySelector('.chart-panel-bar')).toBeNull()
    })

    it('sizes each bar segment by its share', () => {
      const { container } = renderThemed(<SpendingChartPanel segments={segments} />)

      const bars = container.querySelectorAll<HTMLElement>('.chart-panel-bar-segment')
      expect(bars).toHaveLength(2)
      expect(bars[0]).toHaveStyle({ width: '75%' })
      expect(bars[1]).toHaveStyle({ width: '25%' })
    })
  })

  describe('empty state', () => {
    it('renders the empty label instead of a legend', () => {
      renderThemed(<SpendingChartPanel segments={[]} />)

      expect(screen.getByText('No spending yet')).toBeInTheDocument()
      expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    })

    it('renames the empty label', () => {
      renderThemed(<SpendingChartPanel segments={[]} emptyLabel="Nothing spent" />)

      expect(screen.getByText('Nothing spent')).toBeInTheDocument()
    })

    it('says so in the chart summary too', () => {
      renderThemed(<SpendingChartPanel title="This month" segments={[]} />)

      expect(
        screen.getByRole('img', { name: 'This month: No spending yet' }),
      ).toBeInTheDocument()
    })
  })
})
