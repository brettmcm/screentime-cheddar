import { describe, expect, it } from 'vitest'
import { IconButton } from '../icon-button/IconButton'
import { renderThemed } from '../../test/render'
import { PageHeader } from './PageHeader'

describe('PageHeader accessibility', () => {
  it('renders the title as the level-one heading in the default state', async () => {
    const { container, getByRole } = renderThemed(<PageHeader title="Goals" />)

    expect(getByRole('heading', { level: 1, name: 'Goals' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('honours a lower heading level when the header is nested in a page', async () => {
    const { container, getByRole } = renderThemed(<PageHeader title="Goals" as="h2" />)

    expect(getByRole('heading', { level: 2, name: 'Goals' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('names the back control when it is wired up', async () => {
    const { container, getByRole } = renderThemed(<PageHeader title="Goals" onBack={() => {}} />)

    expect(getByRole('button', { name: 'Back' })).toBeEnabled()
    await expect(container).toHaveNoAxeViolations()
  })

  it('uses a custom back label', async () => {
    const { container, getByRole } = renderThemed(
      <PageHeader title="Goals" onBack={() => {}} backLabel="Back to home" />,
    )

    expect(getByRole('button', { name: 'Back to home' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('hides the placeholder back control from assistive tech and from the tab order', async () => {
    const { container, queryByRole, user } = renderThemed(<PageHeader title="Goals" />)

    const back = container.querySelector('.page-header-back')
    expect(back).toHaveAttribute('aria-hidden', 'true')
    expect(back).toBeDisabled()
    expect(queryByRole('button')).not.toBeInTheDocument()

    await user.tab()
    expect(back).not.toHaveFocus()
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations when centred without a back control', async () => {
    const { container, getByRole } = renderThemed(<PageHeader title="Profile" align="center" />)

    expect(getByRole('heading', { level: 1, name: 'Profile' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations with leading and trailing controls', async () => {
    const { container, getByRole, user } = renderThemed(
      <PageHeader
        title="Goals"
        onBack={() => {}}
        trailing={<IconButton icon="settings" label="Settings" />}
      />,
    )

    await user.tab()
    expect(getByRole('button', { name: 'Back' })).toHaveFocus()
    await user.tab()
    expect(getByRole('button', { name: 'Settings' })).toHaveFocus()

    expect(
      [...container.querySelectorAll<HTMLElement>('[tabindex]')].filter((el) => el.tabIndex > 0),
    ).toHaveLength(0)
    await expect(container).toHaveNoAxeViolations()
  })
})
