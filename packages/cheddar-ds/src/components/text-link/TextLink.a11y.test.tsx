import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { TextLink } from './TextLink'

describe('TextLink accessibility', () => {
  it('renders a named link when given an href and hides the affordance icon', async () => {
    const { container, getByRole } = renderThemed(<TextLink href="/goals">View all</TextLink>)

    expect(getByRole('link', { name: 'View all' })).toBeInTheDocument()
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    await expect(container).toHaveNoAxeViolations()
  })

  it('renders a named button when there is no href', async () => {
    const { container, getByRole } = renderThemed(<TextLink>View all</TextLink>)

    expect(getByRole('button', { name: 'View all' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('keeps the name intact with a leading icon', async () => {
    const { container, getByRole } = renderThemed(
      <TextLink href="/back" icon="caret-left" iconPosition="leading">
        Go back
      </TextLink>,
    )

    expect(getByRole('link', { name: 'Go back' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations without an icon at the small size', async () => {
    const { container } = renderThemed(
      <TextLink href="/goals" icon={null} size="small">
        View all
      </TextLink>,
    )

    await expect(container).toHaveNoAxeViolations()
  })

  it('is reachable by Tab and carries no positive tabIndex', async () => {
    const { container, getByRole, user } = renderThemed(<TextLink href="/goals">View all</TextLink>)

    await user.tab()
    expect(getByRole('link', { name: 'View all' })).toHaveFocus()
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
  })
})
