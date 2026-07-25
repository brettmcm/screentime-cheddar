import { ActivityItem } from '@screentime/cheddar-ds'
import { useApp } from '../state/AppContext'
import { formatCurrency } from '../state/model'

/**
 * The library deprecated its activity card and asks callers to compose
 * `ActivityItem` on a surface instead. `panel` is that surface: under the brand
 * appearance it re-scopes its subtree to light tokens, which the hand-rolled
 * equivalent could not do for the items nested inside it.
 */
export function ActivityFeed({ goalId, limit }: { goalId?: string; limit?: number }) {
  const { activities } = useApp()
  const rows = activities.filter((item) => !goalId || item.goalId === goalId).slice(0, limit)

  if (!rows.length) return <p className="panel activity-list-empty">No activity yet</p>

  return (
    <ul className="panel activity-list">
      {rows.map((item) => (
        <li key={item.id}>
          {/* ActivityItem draws the minus for a withdrawal itself. */}
          <ActivityItem type={item.type} time={item.time} amount={formatCurrency(item.amount)} />
        </li>
      ))}
    </ul>
  )
}
