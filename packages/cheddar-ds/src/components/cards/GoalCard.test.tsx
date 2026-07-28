import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { GoalCard } from './GoalCard'

describe('GoalCard', () => {
  it('renders the name and the formatted target', () => {
    renderThemed(<GoalCard name="New bike" target={1200} saved={300} />)

    expect(screen.getByText('New bike')).toBeInTheDocument()
    expect(screen.getByText('$1,200.00')).toBeInTheDocument()
  })

  it('renders the saved amount and the derived remainder', () => {
    renderThemed(<GoalCard name="New bike" target={1200} saved={300} />)

    expect(screen.getByText('$300.00')).toBeInTheDocument()
    expect(screen.getByText('$900.00')).toBeInTheDocument()
  })

  it('lets an explicit remaining override the derived one', () => {
    renderThemed(<GoalCard name="New bike" target={1200} saved={300} remaining={50} />)

    expect(screen.getByText('$50.00')).toBeInTheDocument()
    expect(screen.queryByText('$900.00')).not.toBeInTheDocument()
  })

  it('formats money with a custom formatter', () => {
    renderThemed(
      <GoalCard
        name="New bike"
        target={1200}
        saved={300}
        formatAmount={(value) => `${value} pts`}
      />,
    )

    expect(screen.getByText('1200 pts')).toBeInTheDocument()
    expect(screen.getByText('300 pts')).toBeInTheDocument()
  })

  it('renders string amounts verbatim', () => {
    renderThemed(<GoalCard name="New bike" target="TBD" saved="Just started" />)

    expect(screen.getByText('TBD')).toBeInTheDocument()
    expect(screen.getByText('Just started')).toBeInTheDocument()
  })

  describe('progress', () => {
    it('derives the progress from saved and target', () => {
      renderThemed(<GoalCard name="New bike" target={1200} saved={300} />)

      expect(screen.getByRole('progressbar', { name: 'New bike progress' })).toHaveAttribute(
        'aria-valuenow',
        '25',
      )
    })

    it('lets an explicit progress override the derived one', () => {
      renderThemed(<GoalCard name="New bike" target={1200} saved={300} progress={80} />)

      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '80')
    })

    it('clamps progress into the 0-100 range', () => {
      renderThemed(<GoalCard name="New bike" target={1200} saved={300} progress={140} />)

      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    })

    it('reports no progress when the amounts are not numbers', () => {
      renderThemed(<GoalCard name="New bike" target="TBD" saved="Just started" />)

      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    })

    it('exposes the full progress range', () => {
      renderThemed(<GoalCard name="New bike" target={1200} saved={300} />)

      const bar = screen.getByRole('progressbar')
      expect(bar).toHaveAttribute('aria-valuemin', '0')
      expect(bar).toHaveAttribute('aria-valuemax', '100')
    })
  })

  describe('complete', () => {
    it('shows the completion label instead of the saved amount', () => {
      renderThemed(<GoalCard name="New bike" target={1200} saved={1200} complete />)

      expect(screen.getByText('Goal reached!')).toBeInTheDocument()
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    })

    it('renames the completion label', () => {
      renderThemed(
        <GoalCard name="New bike" target={1200} saved={1200} complete completeLabel="All done" />,
      )

      expect(screen.getByText('All done')).toBeInTheDocument()
    })
  })

  describe('media', () => {
    it('renders an image with its alt text', () => {
      renderThemed(
        <GoalCard
          name="New bike"
          target={1200}
          saved={300}
          image="https://example.test/bike.png"
          imageAlt="A red bike"
        />,
      )

      expect(screen.getByRole('img', { name: 'A red bike' })).toHaveAttribute(
        'src',
        'https://example.test/bike.png',
      )
    })

    it('hides an unnamed image from assistive tech', () => {
      const { container } = renderThemed(
        <GoalCard name="New bike" target={1200} saved={300} image="https://example.test/bike.png" />,
      )

      expect(container.querySelector('img')).toHaveAttribute('aria-hidden', 'true')
    })

    it('falls back to an icon tile', () => {
      const { container } = renderThemed(
        <GoalCard name="New bike" target={1200} saved={300} icon="piggybank" />,
      )

      expect(container.querySelector('.goal-card-tile svg')).toBeInTheDocument()
    })
  })

  describe('interaction', () => {
    it('renders a plain article by default', () => {
      renderThemed(<GoalCard name="New bike" target={1200} saved={300} />)

      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('renders a button that calls onClick', async () => {
      const onClick = vi.fn()
      const { user } = renderThemed(
        <GoalCard name="New bike" target={1200} saved={300} onClick={onClick} />,
      )

      await user.click(screen.getByRole('button', { name: /New bike/ }))

      expect(onClick).toHaveBeenCalledOnce()
    })

    it('renders an anchor when href is given', () => {
      renderThemed(<GoalCard name="New bike" target={1200} saved={300} href="#goals/bike" />)

      expect(screen.getByRole('link', { name: /New bike/ })).toHaveAttribute('href', '#goals/bike')
    })
  })

  it('applies the accent class', () => {
    const { container } = renderThemed(
      <GoalCard name="New bike" target={1200} saved={300} accent="green" />,
    )

    expect(container.querySelector('.goal-card')).toHaveClass('accent-green')
  })
})
