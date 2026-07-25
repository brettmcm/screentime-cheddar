import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { classNames } from '../utils/classNames'
import type { Accent } from './accent'
import { accentAt } from './accent'
import type { AmountFormatter, Money } from './formatAmount'
import { formatAmount as format } from './formatAmount'

export type SpendingSegment = {
  id?: string
  label: string
  amount: number
  accent?: Accent
  /** Any CSS colour, for data that is not one of the four accents. */
  color?: string
}

export type SpendingChartPanelProps = {
  type?: 'bar' | 'pie'
  title?: string
  total?: Money
  badge?: ReactNode
  segments: SpendingSegment[]
  formatAmount?: AmountFormatter
  emptyLabel?: string
} & HTMLAttributes<HTMLElement>

type ResolvedSegment = SpendingSegment & {
  key: string
  share: number
  swatch: string
}

const accentSwatch: Record<Accent, string> = {
  magenta: 'var(--token-color-brand-300)',
  blue: 'var(--token-color-blue-300)',
  green: 'var(--token-color-green-300)',
  purple: 'var(--token-color-purple-300)',
}

/**
 * `Panel / Chart` — a spending breakdown as either a single stacked bar or a
 * donut, always followed by the legend that carries the real data.
 *
 * The chart is decorative: it is exposed as one `role="img"` with a summary
 * label and its bars are hidden from assistive technology.
 */
export function SpendingChartPanel({
  type = 'bar',
  title,
  total,
  badge,
  segments,
  formatAmount,
  emptyLabel = 'No spending yet',
  className,
  ...rest
}: SpendingChartPanelProps) {
  const sum = segments.reduce((value, segment) => value + Math.max(0, segment.amount || 0), 0)
  const resolved: ResolvedSegment[] = segments.map((segment, index) => ({
    ...segment,
    key: segment.id ?? `${segment.label}-${index}`,
    share: sum > 0 ? Math.max(0, segment.amount || 0) / sum : 0,
    swatch: segment.color ?? accentSwatch[segment.accent ?? accentAt(index)],
  }))

  const totalValue: Money = total ?? sum
  const summary = resolved
    .map(
      (segment) =>
        `${segment.label} ${format(segment.amount, formatAmount)}, ${Math.round(segment.share * 100)}%`,
    )
    .join('; ')
  const chartLabel = sum > 0 ? `${title ?? 'Spending'}: ${summary}` : `${title ?? 'Spending'}: ${emptyLabel}`

  return (
    // The modifier is namespaced because `chart-panel-${type}` put
    // `.chart-panel-bar` on the root for type="bar", colliding with the inner
    // bar's own class and collapsing the whole panel into a 16px pill.
    <section className={classNames('chart-panel', `chart-panel-type-${type}`, className)} {...rest}>
      {title || badge ? (
        <div className="chart-panel-header">
          {title ? <p className="chart-panel-title">{title}</p> : null}
          {badge}
        </div>
      ) : null}

      {type === 'pie' ? (
        <div className="chart-panel-donut" role="img" aria-label={chartLabel}>
          <div className="chart-panel-donut-ring" aria-hidden="true" style={donutStyle(resolved)} />
          <div className="chart-panel-donut-hole" aria-hidden="true">
            <span className="chart-panel-donut-total">{format(totalValue, formatAmount)}</span>
          </div>
        </div>
      ) : (
        <>
          {sum > 0 ? (
            <p className="chart-panel-total">{format(totalValue, formatAmount)}</p>
          ) : null}
          <div className="chart-panel-bar" role="img" aria-label={chartLabel}>
            {resolved.map((segment) => (
              <span
                key={segment.key}
                className="chart-panel-bar-segment"
                aria-hidden="true"
                style={{ width: `${segment.share * 100}%`, background: segment.swatch }}
              />
            ))}
          </div>
        </>
      )}

      {sum > 0 ? (
        <ul className="chart-panel-legend">
          {resolved.map((segment) => (
            <li key={segment.key}>
              <span
                className="chart-panel-swatch"
                aria-hidden="true"
                style={{ background: segment.swatch }}
              />
              <span className="chart-panel-legend-label">{segment.label}</span>
              <span className="chart-panel-legend-amount">
                {format(segment.amount, formatAmount)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="chart-panel-empty">{emptyLabel}</p>
      )}
    </section>
  )
}

function donutStyle(segments: ResolvedSegment[]): CSSProperties {
  const filled = segments.filter((segment) => segment.share > 0)

  if (filled.length === 0) {
    return { background: 'var(--cds-color-track-default)' }
  }

  let position = 0
  const stops = filled.map((segment, index) => {
    const from = position
    // Snap the last stop to 100% so rounding never leaves a sliver of gap.
    position = index === filled.length - 1 ? 100 : position + segment.share * 100
    return `${segment.swatch} ${from}% ${position}%`
  })

  return { background: `conic-gradient(${stops.join(', ')})` }
}
