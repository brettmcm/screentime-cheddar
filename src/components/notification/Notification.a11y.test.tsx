import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { Notification } from './Notification'

describe('Notification accessibility', () => {
  it.each(['default', 'trend', 'opportunity'] as const)(
    'exposes the %s variant as a named article with a heading',
    async (variant) => {
      const { container, getAllByRole } = renderThemed(<Notification variant={variant} />)

      expect(getAllByRole('heading')).toHaveLength(1)
      await expect(container).toHaveNoAxeViolations()
    },
  )

  it('names the article and its heading from the supplied title', async () => {
    const { container, getByRole } = renderThemed(<Notification title="Nice work" body="You saved more." />)

    expect(getByRole('article', { name: 'Nice work' })).toBeInTheDocument()
    expect(getByRole('heading', { name: 'Nice work' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('names the dismiss control and the link affordance', async () => {
    const { container, getByRole } = renderThemed(<Notification linkLabel="See the trend" />)

    expect(getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'See the trend' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('renders the affordance as a link when given an href', async () => {
    const { container, getByRole } = renderThemed(<Notification href="/insights" linkLabel="Learn more" />)

    expect(getByRole('link', { name: 'Learn more' })).toHaveAttribute('href', '/insights')
    await expect(container).toHaveNoAxeViolations()
  })

  it('hides the decorative illustration from assistive tech', async () => {
    const { container } = renderThemed(<Notification image="/illustration.png" />)

    expect(container.querySelector('.notif-illustration')).toHaveAttribute('aria-hidden', 'true')
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations without the dismiss control', async () => {
    const { container, queryByRole } = renderThemed(<Notification showDismiss={false} />)

    expect(queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('reaches the dismiss control and the link by Tab with no positive tabIndex', async () => {
    const { container, getByRole, user } = renderThemed(
      <Notification dismissLabel="Dismiss" linkLabel="Learn more" href="/insights" />,
    )

    await user.tab()
    expect(getByRole('button', { name: 'Dismiss' })).toHaveFocus()

    await user.tab()
    expect(getByRole('link', { name: 'Learn more' })).toHaveFocus()

    expect(
      [...container.querySelectorAll<HTMLElement>('[tabindex]')].filter((el) => el.tabIndex > 0),
    ).toHaveLength(0)
  })
})
