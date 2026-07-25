import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { ActivityItem } from '../activity-item/ActivityItem'
import { ActivityCard } from './ActivityCard'

describe('ActivityCard', () => {
  it('puts its children on the card surface', () => {
    const { container } = renderThemed(
      <ActivityCard>
        <ActivityItem type="deposit" amount="$20.00" />
        <ActivityItem type="withdrawal" amount="$8.00" />
      </ActivityCard>,
    )

    const card = container.querySelector('.activity-card')
    expect(card).toBeInTheDocument()
    expect(card?.querySelectorAll('.activity-card-content .activity-item')).toHaveLength(2)
  })

  it('renders an empty card when there is nothing to show', () => {
    const { container } = renderThemed(<ActivityCard />)

    expect(container.querySelector('.activity-card-content')).toBeEmptyDOMElement()
  })

  it('passes className and native attributes through to the surface', () => {
    const { container } = renderThemed(
      <ActivityCard className="custom" aria-label="Recent activity" />,
    )

    const card = container.querySelector('.activity-card')
    expect(card).toHaveClass('activity-card', 'custom')
    expect(screen.getByLabelText('Recent activity')).toBe(card)
  })
})
