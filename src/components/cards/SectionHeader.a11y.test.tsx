import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { SectionHeader } from './SectionHeader'

describe('SectionHeader accessibility', () => {
  it('renders a level-two heading by default', async () => {
    const { container, getByRole } = renderThemed(<SectionHeader title="Recent activity" />)

    expect(getByRole('heading', { level: 2, name: 'Recent activity' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it.each(['h2', 'h3', 'h4'] as const)('honours the %s heading level', async (as) => {
    const { container, getByRole } = renderThemed(<SectionHeader title="Recent activity" as={as} />)

    expect(getByRole('heading', { level: Number(as.slice(1)) })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('labels the region it heads when given an id', async () => {
    const { container, getByRole } = renderThemed(
      <section aria-labelledby="recent-activity">
        <SectionHeader id="recent-activity" title="Recent activity" />
      </section>,
    )

    expect(getByRole('region', { name: 'Recent activity' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('names the action affordance as a link when given an href', async () => {
    const { container, getByRole, user } = renderThemed(
      <SectionHeader title="Recent activity" actionLabel="View all" actionHref="/activity" />,
    )

    const link = getByRole('link', { name: 'View all' })
    await user.tab()
    expect(link).toHaveFocus()
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
    await expect(container).toHaveNoAxeViolations()
  })

  it('names the action affordance as a button when there is no href', async () => {
    const { container, getByRole } = renderThemed(
      <SectionHeader title="Recent activity" actionLabel="View all" onAction={() => {}} />,
    )

    expect(getByRole('button', { name: 'View all' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })
})
