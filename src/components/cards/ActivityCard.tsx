import type { HTMLAttributes, ReactNode } from 'react'
import { classNames } from '../utils/classNames'

export type ActivityCardProps = {
  /** The rows, normally `ActivityItem`s. */
  children?: ReactNode
} & HTMLAttributes<HTMLElement>

/**
 * `Card / Activity` — the surface behind a run of `ActivityItem`s, with the
 * spacing between them. Figma models the contents as a slot and so does this:
 * the card owns the container and nothing about the rows, which lets a list
 * mix item states, group by day or paginate without the card knowing.
 */
export function ActivityCard({ children, className, ...rest }: ActivityCardProps) {
  return (
    <article className={classNames('activity-card', className)} {...rest}>
      <div className="activity-card-content">{children}</div>
    </article>
  )
}
