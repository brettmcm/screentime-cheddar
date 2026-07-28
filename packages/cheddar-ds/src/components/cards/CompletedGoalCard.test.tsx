import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { CompletedGoalCard } from './CompletedGoalCard'

describe('CompletedGoalCard', () => {
  it('renders the name and the formatted amount', () => {
    renderThemed(<CompletedGoalCard name="Concert tickets" amount={240} />)

    expect(screen.getByText('Concert tickets')).toBeInTheDocument()
    expect(screen.getByText('$240.00')).toBeInTheDocument()
  })

  it('renders a string amount verbatim', () => {
    renderThemed(<CompletedGoalCard name="Concert tickets" amount="Fully funded" />)

    expect(screen.getByText('Fully funded')).toBeInTheDocument()
  })

  it('formats money with a custom formatter', () => {
    renderThemed(
      <CompletedGoalCard
        name="Concert tickets"
        amount={240}
        formatAmount={(value) => `${value} saved`}
      />,
    )

    expect(screen.getByText('240 saved')).toBeInTheDocument()
  })

  it('renders an image with its alt text', () => {
    renderThemed(
      <CompletedGoalCard
        name="Concert tickets"
        amount={240}
        image="https://example.test/tickets.png"
        imageAlt="Two tickets"
      />,
    )

    expect(screen.getByRole('img', { name: 'Two tickets' })).toBeInTheDocument()
  })

  describe('interaction', () => {
    it('renders a plain article by default', () => {
      renderThemed(<CompletedGoalCard name="Concert tickets" amount={240} />)

      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('renders a button that calls onClick', async () => {
      const onClick = vi.fn()
      const { user } = renderThemed(
        <CompletedGoalCard name="Concert tickets" amount={240} onClick={onClick} />,
      )

      await user.click(screen.getByRole('button', { name: /Concert tickets/ }))

      expect(onClick).toHaveBeenCalledOnce()
    })

    it('renders an anchor when href is given', () => {
      renderThemed(
        <CompletedGoalCard name="Concert tickets" amount={240} href="#goals/tickets" />,
      )

      expect(screen.getByRole('link', { name: /Concert tickets/ })).toHaveAttribute(
        'href',
        '#goals/tickets',
      )
    })
  })

  it('applies the accent class', () => {
    const { container } = renderThemed(
      <CompletedGoalCard name="Concert tickets" amount={240} accent="green" />,
    )

    expect(container.querySelector('.completed-goal-card')).toHaveClass('accent-green')
  })
})
