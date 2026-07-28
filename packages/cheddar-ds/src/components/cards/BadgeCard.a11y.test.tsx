import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { BadgeCard } from './BadgeCard'

describe('BadgeCard accessibility', () => {
  it('renders the static badge without violations', async () => {
    const { container, getByText } = renderThemed(
      <BadgeCard title="Finance nerd" caption="3 of 5 lessons" />,
    )

    expect(getByText('Finance nerd')).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('names the progress bar after the badge and reports its value', async () => {
    const { container, getByRole } = renderThemed(<BadgeCard title="Finance nerd" progress={60} />)

    const progress = getByRole('progressbar', { name: 'Finance nerd progress' })
    expect(progress).toHaveAttribute('aria-valuenow', '60')
    expect(progress).toHaveAttribute('aria-valuemin', '0')
    expect(progress).toHaveAttribute('aria-valuemax', '100')
    await expect(container).toHaveNoAxeViolations()
  })

  it('clamps an out-of-range progress value into the reported range', async () => {
    const { container, getByRole } = renderThemed(<BadgeCard title="Finance nerd" progress={140} />)

    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    await expect(container).toHaveNoAxeViolations()
  })

  it('hides the decorative tile artwork when the image carries no alt text', async () => {
    const { container } = renderThemed(<BadgeCard title="Double down" image="/badge.png" />)

    expect(container.querySelector('.badge-card-image')).toHaveAttribute('aria-hidden', 'true')
    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes the clickable badge as one named button reachable by Tab', async () => {
    const { container, getByRole, user } = renderThemed(
      <BadgeCard title="Stack master" caption="Unlocked" accent="purple" onClick={() => {}} />,
    )

    const button = getByRole('button')
    expect(button).toHaveAccessibleName(/Stack master/)

    await user.tab()
    expect(button).toHaveFocus()
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
    await expect(container).toHaveNoAxeViolations()
  })
})
