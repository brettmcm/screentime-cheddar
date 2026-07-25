import type { HTMLAttributes } from 'react'
import { Icon } from '../icon/Icon'
import { classNames } from '../utils/classNames'

export type SavingsStreakDay = {
  id?: string
  /** The single letter shown in the circle, e.g. `'M'`. */
  label: string
  /** The spoken day name, e.g. `'Monday'`. Falls back to `label`. */
  name?: string
  complete?: boolean
  today?: boolean
}

export type SavingsStreakProps = {
  title?: string
  days: SavingsStreakDay[]
  completeLabel?: string
  incompleteLabel?: string
} & HTMLAttributes<HTMLElement>

/**
 * The Profile screen streak: a row of day circles, filled with a check when
 * the day's saving is done.
 *
 * The visible label is a single ambiguous letter, so each day carries its
 * spoken name and state on the list item — pass `name` per day for the full
 * word.
 */
export function SavingsStreak({
  title = 'Savings streak',
  days,
  completeLabel = 'saved',
  incompleteLabel = 'not saved',
  className,
  ...rest
}: SavingsStreakProps) {
  return (
    <section className={classNames('savings-streak', className)} {...rest}>
      {title ? <p className="savings-streak-title">{title}</p> : null}
      <ul className="savings-streak-list">
        {days.map((day, index) => (
          <li
            key={day.id ?? `${day.label}-${index}`}
            className={classNames(
              'savings-streak-day',
              day.complete && 'savings-streak-day-complete',
              day.today && 'savings-streak-day-today',
            )}
            aria-label={`${day.name ?? day.label}: ${day.complete ? completeLabel : incompleteLabel}`}
          >
            <span className="savings-streak-mark" aria-hidden="true">
              {day.complete ? <Icon name="check" width={16} height={16} /> : null}
            </span>
            <span className="savings-streak-label" aria-hidden="true">
              {day.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
