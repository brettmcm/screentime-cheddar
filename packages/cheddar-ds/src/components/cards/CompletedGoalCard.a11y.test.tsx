import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { CompletedGoalCard } from './CompletedGoalCard'

describe('CompletedGoalCard accessibility', () => {
  it('renders the static card without violations', async () => {
    const { container, getByText } = renderThemed(<CompletedGoalCard name="Camera" amount={500} />)

    expect(getByText('$500.00')).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('hides the decorative tile artwork when the image carries no alt text', async () => {
    const { container } = renderThemed(
      <CompletedGoalCard name="Camera" amount="$500.00" image="/camera.png" />,
    )

    expect(container.querySelector('.completed-goal-card-image')).toHaveAttribute('aria-hidden', 'true')
    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes the tile image when it carries alt text', async () => {
    const { container, getByRole } = renderThemed(
      <CompletedGoalCard name="Camera" amount="$500.00" image="/camera.png" imageAlt="A camera" />,
    )

    expect(getByRole('img', { name: 'A camera' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes the clickable card as one named button reachable by Tab', async () => {
    const { container, getByRole, user } = renderThemed(
      <CompletedGoalCard name="Camera" amount="$500.00" accent="green" onClick={() => {}} />,
    )

    const button = getByRole('button')
    expect(button).toHaveAccessibleName(/Camera/)

    await user.tab()
    expect(button).toHaveFocus()
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes the linked card as one named link reachable by Tab', async () => {
    const { container, getByRole, user } = renderThemed(
      <CompletedGoalCard name="Camera" amount="$500.00" href="/goals/camera" />,
    )

    await user.tab()
    expect(getByRole('link')).toHaveFocus()
    await expect(container).toHaveNoAxeViolations()
  })
})
