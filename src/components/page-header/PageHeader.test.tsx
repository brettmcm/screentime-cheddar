import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { PageHeader } from './PageHeader'

/** The inert back control is hidden from assistive tech, so it needs `hidden`. */
function backControl() {
  return screen.getByRole('button', { hidden: true })
}

describe('PageHeader', () => {
  it('renders the title as a level-one heading by default', () => {
    renderThemed(<PageHeader title="Goals" />)

    expect(screen.getByRole('heading', { level: 1, name: 'Goals' })).toBeInTheDocument()
  })

  it.each([
    ['h1', 1],
    ['h2', 2],
    ['h3', 3],
  ] as const)('renders the title as %s when as is set', (as, level) => {
    renderThemed(<PageHeader title="Goals" as={as} />)

    expect(screen.getByRole('heading', { level, name: 'Goals' })).toBeInTheDocument()
  })

  describe('back control', () => {
    it('calls onBack when the back control is clicked', async () => {
      const onBack = vi.fn()
      const { user } = renderThemed(<PageHeader title="Goals" onBack={onBack} />)

      await user.click(screen.getByRole('button', { name: 'Back' }))

      expect(onBack).toHaveBeenCalledOnce()
    })

    it('names the back control with backLabel', () => {
      renderThemed(<PageHeader title="Goals" onBack={vi.fn()} backLabel="Back to wallet" />)

      expect(screen.getByRole('button', { name: 'Back to wallet' })).toBeInTheDocument()
    })

    it('renders the back control inert when onBack is absent', () => {
      renderThemed(<PageHeader title="Goals" />)

      const back = backControl()
      expect(back).toBeDisabled()
      expect(back).toHaveAttribute('aria-hidden', 'true')
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('does not name the inert back control', () => {
      renderThemed(<PageHeader title="Goals" backLabel="Back to wallet" />)

      expect(backControl()).not.toHaveAttribute('aria-label')
    })

    it('hides the back control on a centred header by default', () => {
      renderThemed(<PageHeader title="Goals" align="center" />)

      expect(screen.queryByRole('button', { hidden: true })).not.toBeInTheDocument()
    })

    it('shows the back control on a centred header once onBack is given', () => {
      renderThemed(<PageHeader title="Goals" align="center" onBack={vi.fn()} />)

      expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
    })

    it('forces the back control on with showBack', () => {
      renderThemed(<PageHeader title="Goals" align="center" showBack />)

      expect(backControl()).toBeInTheDocument()
    })

    it('forces the back control off with showBack={false} even with onBack', () => {
      renderThemed(<PageHeader title="Goals" onBack={vi.fn()} showBack={false} />)

      expect(screen.queryByRole('button', { hidden: true })).not.toBeInTheDocument()
    })
  })

  // Alignment itself is pure CSS, so it is checked through the class plus the
  // back control, whose default visibility depends on it.
  describe('alignment', () => {
    it('lays the header out left by default', () => {
      const { container } = renderThemed(<PageHeader title="Goals" />)

      expect(container.querySelector('.page-header')).toHaveClass('page-header-left')
    })

    it('honours the deprecated variant prop', () => {
      const { container } = renderThemed(<PageHeader title="Goals" variant="center" />)

      expect(container.querySelector('.page-header')).toHaveClass('page-header-center')
      expect(screen.queryByRole('button', { hidden: true })).not.toBeInTheDocument()
    })

    it('lets align win over variant', () => {
      const { container } = renderThemed(<PageHeader title="Goals" variant="center" align="left" />)

      expect(container.querySelector('.page-header')).toHaveClass('page-header-left')
      expect(backControl()).toBeInTheDocument()
    })

    it('lets align win over variant in the other direction too', () => {
      const { container } = renderThemed(<PageHeader title="Goals" variant="left" align="center" />)

      expect(container.querySelector('.page-header')).toHaveClass('page-header-center')
      expect(screen.queryByRole('button', { hidden: true })).not.toBeInTheDocument()
    })
  })

  describe('slots', () => {
    it('renders the leading slot alongside the back control', () => {
      renderThemed(
        <PageHeader title="Goals" onBack={vi.fn()} leading={<span>Leading</span>} />,
      )

      expect(screen.getByText('Leading')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
    })

    it('renders the trailing slot', async () => {
      const onEdit = vi.fn()
      const { user } = renderThemed(
        <PageHeader
          title="Goals"
          trailing={
            <button type="button" onClick={onEdit}>
              Edit
            </button>
          }
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Edit' }))

      expect(onEdit).toHaveBeenCalledOnce()
    })

    it('keeps the leading slot when there is no back control at all', () => {
      renderThemed(
        <PageHeader title="Goals" align="center" leading={<span>Leading</span>} />,
      )

      expect(screen.getByText('Leading')).toBeInTheDocument()
    })
  })

  it('forwards a ref to the header element', () => {
    const ref = createRef<HTMLElement>()
    renderThemed(<PageHeader title="Goals" ref={ref} />)

    expect(ref.current?.tagName).toBe('HEADER')
    expect(ref.current).toHaveClass('page-header')
  })
})
