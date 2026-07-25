import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { Card, type CardVariant } from './Card'

/**
 * `Card` is deprecated but still exported, so every variant it can still render
 * is held to the same bar as its prop-driven replacement.
 */
const VARIANTS: CardVariant[] = [
  'article-large',
  'guide',
  'activity',
  'activity-feed',
  'total-savings',
  'customer-article-credit-card',
  'customer-article-friends',
  'article-small-credit',
  'article-small-expenses',
  'article-small-fifty-thirty',
  'article-small-emergency',
  'profile',
  'goal-finished',
  'goal-finished-variant-2',
  'goal-finished-variant-3',
  'badge-finance-nerd',
  'badge-double-down',
  'badge-stack-master',
  'account',
  'goal-summary',
  'goal-headphones',
  'goal-sneakers',
  'goal-ski-trip',
  'goal-reached',
]

describe('Card (deprecated) accessibility', () => {
  it.each(VARIANTS)('has no axe violations in the %s variant', async (variant) => {
    const { container } = renderThemed(<Card variant={variant} />)

    await expect(container).toHaveNoAxeViolations()
  })

  it('hides the demo illustration from assistive tech', async () => {
    const { container } = renderThemed(<Card variant="goal-headphones" illustration="/goal.png" />)

    expect(container.querySelector('img')).toHaveAttribute('aria-hidden', 'true')
    await expect(container).toHaveNoAxeViolations()
  })

  it('renders the activity feed as a list of named rows without violations', async () => {
    const { container, getAllByText } = renderThemed(<Card variant="activity-feed" />)

    expect(getAllByText('Deposit').length).toBeGreaterThan(0)
    await expect(container).toHaveNoAxeViolations()
  })
})
