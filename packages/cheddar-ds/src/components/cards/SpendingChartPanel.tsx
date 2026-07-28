import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { classNames } from '../utils/classNames'
import type { Accent } from './accent'
import { accentAt, accentClass } from './accent'
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
  type?: 'bar' | 'pie' | 'segmented'
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
  tint: string
  accentName: Accent
}

const accentSwatch: Record<Accent, string> = {
  magenta: 'var(--token-color-brand-300)',
  blue: 'var(--token-color-blue-300)',
  green: 'var(--token-color-green-300)',
  purple: 'var(--token-color-purple-300)',
}

/**
 * Segmented columns are filled from the light end of each ramp and labelled
 * with the dark end. The saturated `-300` that marks a legend row is far too
 * heavy to carry text across a whole column, so the two are deliberately
 * different: the legend stays saturated, the column reads as a tint.
 */
const accentTint: Record<Accent, string> = {
  magenta: 'var(--token-color-brand-500)',
  blue: 'var(--token-color-blue-500)',
  green: 'var(--token-color-green-500)',
  purple: 'var(--token-color-purple-500)',
}

/**
 * `Panel / Chart` — a spending breakdown as one of three layouts, always
 * followed by the legend that carries the real data:
 *
 * - `bar` — a single stacked track
 * - `pie` — a donut with the total in the hole
 * - `segmented` — full-height columns whose widths carry the share, each
 *   labelled with its own amount
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
  const resolved: ResolvedSegment[] = segments.map((segment, index) => {
    const accentName = segment.accent ?? accentAt(index)
    return {
      ...segment,
      key: segment.id ?? `${segment.label}-${index}`,
      share: sum > 0 ? Math.max(0, segment.amount || 0) / sum : 0,
      swatch: segment.color ?? accentSwatch[accentName],
      tint: segment.color ?? accentTint[accentName],
      accentName,
    }
  })

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
          {/* Segmented columns are labelled individually, so a total stacked on
            * top of them only repeats what the row already says. */}
          {sum > 0 && type !== 'segmented' ? (
            <p className="chart-panel-total">{format(totalValue, formatAmount)}</p>
          ) : null}
          {type === 'segmented' ? (
            <div className="chart-panel-segmented" role="img" aria-label={chartLabel}>
              {resolved.map((segment) => (
                <span
                  key={segment.key}
                  className={classNames(
                    'chart-panel-segmented-segment',
                    accentClass(segment.accentName),
                  )}
                  aria-hidden="true"
                  // The share rides on `flex-grow` rather than `width` so that a
                  // segment held open by `min-width` takes its extra space from
                  // the wider ones instead of pushing the row past 100%. Shares
                  // are scaled up because grow factors summing below 1 leave the
                  // row short of the container.
                  style={{ flexGrow: segment.share * 100, background: segment.tint }}
                >
                  <span className="chart-panel-segmented-amount">
                    {format(segment.amount, formatAmount)}
                  </span>
                </span>
              ))}
            </div>
          ) : (
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
          )}
        </>
      )}

      {sum > 0 ? (
        <ul className="chart-panel-legend">
          {resolved.map((segment) => (
            <li key={segment.key}>
              <span
                className="chart-panel-swatch"
                aria-hidden="true"
                // The key has to be painted in whatever the chart itself used,
                // and the segmented columns are the tint rather than the
                // saturated swatch the bar and donut draw with.
                style={{ background: type === 'segmented' ? segment.tint : segment.swatch }}
              />
              <span className="chart-panel-legend-label">{segment.label}</span>
              {type === 'segmented' ? null : (
                <span className="chart-panel-legend-amount">
                  {format(segment.amount, formatAmount)}
                </span>
              )}
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
