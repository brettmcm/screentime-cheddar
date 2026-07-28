import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { GoalCard } from './GoalCard'

describe('GoalCard accessibility', () => {
  it('names the progress bar after the goal and derives its value', async () => {
    const { container, getByRole } = renderThemed(
      <GoalCard name="Headphones" target={200} saved={50} />,
    )

    const progress = getByRole('progressbar', { name: 'Headphones progress' })
    expect(progress).toHaveAttribute('aria-valuenow', '25')
    expect(progress).toHaveAttribute('aria-valuemin', '0')
    expect(progress).toHaveAttribute('aria-valuemax', '100')
    await expect(container).toHaveNoAxeViolations()
  })

  it('reports a completed goal as full progress alongside its label', async () => {
    const { container, getByRole, getByText } = renderThemed(
      <GoalCard name="Camera" target={500} saved={500} complete completeLabel="Goal reached!" />,
    )

    expect(getByRole('progressbar', { name: 'Camera progress' })).toHaveAttribute('aria-valuenow', '100')
    expect(getByText('Goal reached!')).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations with pre-formatted string amounts and an icon tile', async () => {
    const { container } = renderThemed(
      <GoalCard
        name="Ski trip"
        target="$500.00"
        saved="$18.20"
        remaining="$481.80"
        progress={6}
        icon="learn"
        accent="green"
      />,
    )

    await expect(container).toHaveNoAxeViolations()
  })

  it('hides the decorative tile artwork when the image carries no alt text', async () => {
    const { container } = renderThemed(
      <GoalCard name="Sneakers" target={120} saved={100} image="/sneakers.png" />,
    )

    expect(container.querySelector('.goal-card-image')).toHaveAttribute('aria-hidden', 'true')
    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes the clickable goal as one named button reachable by Tab', async () => {
    const { container, getByRole, user } = renderThemed(
      <GoalCard name="Headphones" target={200} saved={50} onClick={() => {}} />,
    )

    const button = getByRole('button')
    expect(button).toHaveAccessibleName(/Headphones/)

    await user.tab()
    expect(button).toHaveFocus()
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
    await expect(container).toHaveNoAxeViolations()
  })

  // A11Y-2 was that an interactive card swallowed its own progress: ARIA makes a
  // button's children presentational, so the nested progressbar's aria-valuenow
  // never reached assistive tech. The percentage and the amounts are folded into
  // the control's accessible name instead, which is assertable from jsdom.
  it('reports the progress value in the name of an interactive goal card', () => {
    const { getByRole } = renderThemed(
      <GoalCard name="Headphones" target={200} saved={50} onClick={() => {}} />,
    )

    expect(getByRole('button')).toHaveAccessibleName('Headphones, $50.00 of $200.00, 25% saved')
  })

  it('names a completed interactive card by its completion label', () => {
    const { getByRole } = renderThemed(
      <GoalCard name="Camera" target={500} saved={500} complete onClick={() => {}} />,
    )

    expect(getByRole('button')).toHaveAccessibleName(/^Camera, /)
  })

  it('exposes the linked goal as one named link reachable by Tab', async () => {
    const { container, getByRole, user } = renderThemed(
      <GoalCard name="Headphones" target={200} saved={50} href="/goals/headphones" />,
    )

    await user.tab()
    expect(getByRole('link')).toHaveFocus()
    await expect(container).toHaveNoAxeViolations()
  })
})
