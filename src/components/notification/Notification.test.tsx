import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { Notification } from './Notification'

describe('Notification', () => {
  describe('per-variant defaults', () => {
    it.each([
      ['default', 'Nice!', /saving 20% more/],
      ['trend', 'New trend', /spending more on/],
      ['opportunity', 'Watch out!', /spending 35% more/],
    ] as const)('renders the %s copy', (variant, title, body) => {
      renderThemed(<Notification variant={variant} />)

      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
      expect(screen.getByText(body)).toBeInTheDocument()
    })

    it('renders the default variant when none is given', () => {
      renderThemed(<Notification />)

      expect(screen.getByRole('heading', { name: 'Nice!' })).toBeInTheDocument()
    })

    it('names the article after its heading', () => {
      renderThemed(<Notification variant="trend" />)

      expect(screen.getByRole('article', { name: 'New trend' })).toBeInTheDocument()
    })
  })

  describe('content overrides', () => {
    it('renders a title in place of the variant default', () => {
      renderThemed(<Notification title="You did it" />)

      expect(screen.getByRole('heading', { name: 'You did it' })).toBeInTheDocument()
      expect(screen.queryByText('Nice!')).not.toBeInTheDocument()
    })

    it('lets label win over title', () => {
      renderThemed(<Notification label="From label" title="From title" />)

      expect(screen.getByRole('heading', { name: 'From label' })).toBeInTheDocument()
    })

    it('renders a body in place of the variant default', () => {
      renderThemed(<Notification body="Keep it up." />)

      expect(screen.getByText('Keep it up.')).toBeInTheDocument()
      expect(screen.queryByText(/saving 20% more/)).not.toBeInTheDocument()
    })

    it('renders a rich body node', () => {
      renderThemed(
        <Notification
          body={
            <>
              You saved <strong>$40</strong>
            </>
          }
        />,
      )

      expect(screen.getByText('$40').tagName).toBe('STRONG')
    })

    it('renders an image in the illustration tile instead of the icon', () => {
      const { container } = renderThemed(<Notification image="https://example.test/piggy.png" />)

      const image = container.querySelector('img.notif-image')
      expect(image).toHaveAttribute('src', 'https://example.test/piggy.png')
      expect(container.querySelector('.notif-illustration svg')).toBeNull()
    })

    it('renders a named icon in the illustration tile', () => {
      const { container } = renderThemed(<Notification icon="chart" />)

      expect(container.querySelector('.notif-illustration svg')).toBeInTheDocument()
    })

    it('renders a custom illustration node', () => {
      renderThemed(<Notification icon={<span>Custom art</span>} />)

      expect(screen.getByText('Custom art')).toBeInTheDocument()
    })
  })

  describe('dismiss', () => {
    it('renders a Dismiss control by default', () => {
      renderThemed(<Notification />)

      expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
    })

    it('calls onDismiss when the control is clicked', async () => {
      const onDismiss = vi.fn()
      const { user } = renderThemed(<Notification onDismiss={onDismiss} />)

      await user.click(screen.getByRole('button', { name: 'Dismiss' }))

      expect(onDismiss).toHaveBeenCalledOnce()
    })

    it('renames the control with dismissLabel', () => {
      renderThemed(<Notification dismissLabel="Hide this tip" />)

      expect(screen.getByRole('button', { name: 'Hide this tip' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument()
    })

    it('removes the control when showDismiss is false', () => {
      renderThemed(<Notification showDismiss={false} onDismiss={vi.fn()} />)

      expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument()
    })
  })

  describe('link affordance', () => {
    it('renders a Learn more button by default', () => {
      renderThemed(<Notification />)

      expect(screen.getByRole('button', { name: 'Learn more' })).toBeInTheDocument()
    })

    it('renames the link with linkLabel', () => {
      renderThemed(<Notification linkLabel="See the breakdown" />)

      expect(screen.getByRole('button', { name: 'See the breakdown' })).toBeInTheDocument()
    })

    it('calls onLinkClick when the button is clicked', async () => {
      const onLinkClick = vi.fn()
      const { user } = renderThemed(<Notification onLinkClick={onLinkClick} />)

      await user.click(screen.getByRole('button', { name: 'Learn more' }))

      expect(onLinkClick).toHaveBeenCalledOnce()
    })

    it('renders an anchor when href is given', () => {
      renderThemed(<Notification href="#insights" />)

      expect(screen.getByRole('link', { name: 'Learn more' })).toHaveAttribute('href', '#insights')
      expect(screen.queryByRole('button', { name: 'Learn more' })).not.toBeInTheDocument()
    })

    it('calls onLinkClick from the anchor too', async () => {
      const onLinkClick = vi.fn()
      const { user } = renderThemed(<Notification href="#insights" onLinkClick={onLinkClick} />)

      await user.click(screen.getByRole('link', { name: 'Learn more' }))

      expect(onLinkClick).toHaveBeenCalledOnce()
    })

    it('replaces the built-in link with a custom action', async () => {
      const onAction = vi.fn()
      const { user } = renderThemed(
        <Notification
          action={
            <button type="button" onClick={onAction}>
              Move money
            </button>
          }
        />,
      )

      expect(screen.queryByRole('button', { name: 'Learn more' })).not.toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Move money' }))
      expect(onAction).toHaveBeenCalledOnce()
    })
  })

  it('keeps its own class alongside a caller class', () => {
    renderThemed(<Notification className="home-notification" />)

    expect(screen.getByRole('article')).toHaveClass('notification', 'home-notification')
  })

  it('forwards a ref to the article element', () => {
    const ref = createRef<HTMLElement>()
    renderThemed(<Notification ref={ref} />)

    expect(ref.current).toBe(screen.getByRole('article'))
  })
})
