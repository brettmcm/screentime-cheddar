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

  describe('segmented', () => {
    it('renders columns instead of the stacked bar', () => {
      const { container } = renderThemed(
        <SpendingChartPanel type="segmented" segments={segments} />,
      )

      expect(container.querySelector('.chart-panel-segmented')).toBeInTheDocument()
      expect(container.querySelector('.chart-panel-bar')).toBeNull()
      expect(container.querySelector('.chart-panel-donut')).toBeNull()
    })

    /**
     * Width has to come from `flex-grow`, not `width`, or a column widened by
     * `min-width` would push the row past the container instead of taking the
     * space from its neighbours.
     */
    it('carries the share on flex-grow rather than a fixed width', () => {
      const { container } = renderThemed(
        <SpendingChartPanel type="segmented" segments={segments} />,
      )

      const columns = container.querySelectorAll<HTMLElement>('.chart-panel-segmented-segment')
      expect(columns).toHaveLength(2)
      expect(columns[0]).toHaveStyle({ flexGrow: '75' })
      expect(columns[1]).toHaveStyle({ flexGrow: '25' })
      expect(columns[0].style.width).toBe('')
    })

    it('labels every column with its own amount', () => {
      const { container } = renderThemed(
        <SpendingChartPanel type="segmented" segments={segments} />,
      )

      const amounts = [
        ...container.querySelectorAll('.chart-panel-segmented-amount'),
      ].map((node) => node.textContent)
      expect(amounts).toEqual(['$300.00', '$100.00'])
    })

    it('still shows a tiny share so its amount can be read', () => {
      const { container } = renderThemed(
        <SpendingChartPanel
          type="segmented"
          segments={[
            { label: 'Rent', amount: 1450 },
            { label: 'Coffee', amount: 9.1 },
          ]}
        />,
      )

      const columns = container.querySelectorAll<HTMLElement>('.chart-panel-segmented-segment')
      expect(within(columns[1]).getByText('$9.10')).toBeInTheDocument()
      // The floor is CSS (`min-width: min-content`), so the inline grow stays
      // truthful to the data and jsdom sees the raw share.
      expect(Number(columns[1].style.flexGrow)).toBeCloseTo(0.62, 1)
    })

    /** The columns are labelled, so a total above them is a second telling. */
    it('drops the total the bar layout shows', () => {
      const { container } = renderThemed(
        <SpendingChartPanel type="segmented" segments={segments} />,
      )

      expect(container.querySelector('.chart-panel-total')).toBeNull()
      expect(screen.queryByText('$400.00')).toBeNull()
    })

    it('reduces the legend to a key, leaving amounts on the columns', () => {
      const { container } = renderThemed(
        <SpendingChartPanel type="segmented" segments={segments} />,
      )

      expect(container.querySelector('.chart-panel-legend-amount')).toBeNull()
      expect(screen.getByText('Travel')).toBeInTheDocument()
      // $300.00 appears once — on its column, not repeated in the legend.
      expect(screen.getAllByText('$300.00')).toHaveLength(1)
    })

    it('fills columns from the light end of the ramp, not the legend swatch', () => {
      const { container } = renderThemed(
        <SpendingChartPanel type="segmented" segments={[{ label: 'Travel', amount: 10 }]} />,
      )

      const column = container.querySelector<HTMLElement>('.chart-panel-segmented-segment')
      expect(column).toHaveStyle({ background: 'var(--token-color-brand-500)' })
      expect(column).toHaveClass('accent-magenta')
    })

    it('paints the legend key in the same tint as the columns', () => {
      const { container } = renderThemed(
        <SpendingChartPanel type="segmented" segments={[{ label: 'Travel', amount: 10 }]} />,
      )

      const column = container.querySelector<HTMLElement>('.chart-panel-segmented-segment')
      const swatch = container.querySelector<HTMLElement>('.chart-panel-swatch')
      expect(swatch!.style.background).toBe(column!.style.background)
    })

    it('leaves the bar layout on the saturated swatch', () => {
      const { container } = renderThemed(
        <SpendingChartPanel segments={[{ label: 'Travel', amount: 10 }]} />,
      )

      expect(container.querySelector<HTMLElement>('.chart-panel-swatch')).toHaveStyle({
        background: 'var(--token-color-brand-300)',
      })
    })

    it('keeps the same assistive summary as the other layouts', () => {
      renderThemed(
        <SpendingChartPanel type="segmented" title="This month" segments={segments} />,
      )

      expect(
        screen.getByRole('img', { name: 'This month: Travel $300.00, 75%; Food $100.00, 25%' }),
      ).toBeInTheDocument()
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
