import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { AccountCard } from './AccountCard'

describe('AccountCard', () => {
  it('renders the name and the formatted balance', () => {
    renderThemed(<AccountCard name="Checking" amount={2480.5} />)

    expect(screen.getByText('Checking')).toBeInTheDocument()
    expect(screen.getByText('$2,480.50')).toBeInTheDocument()
  })

  it('renders the subtitle and meta lines', () => {
    renderThemed(
      <AccountCard name="Checking" subtitle="•••• 4021" amount={2480.5} meta="Updated today" />,
    )

    expect(screen.getByText('•••• 4021')).toBeInTheDocument()
    expect(screen.getByText('Updated today')).toBeInTheDocument()
  })

  it('renders a string amount verbatim', () => {
    renderThemed(<AccountCard name="Checking" amount="Hidden" />)

    expect(screen.getByText('Hidden')).toBeInTheDocument()
  })

  it('formats money with a custom formatter', () => {
    renderThemed(
      <AccountCard name="Checking" amount={2480} formatAmount={(value) => `${value} USD`} />,
    )

    expect(screen.getByText('2480 USD')).toBeInTheDocument()
  })

  describe('tile', () => {
    it('renders an image with its alt text', () => {
      renderThemed(
        <AccountCard
          name="Checking"
          amount={10}
          image="https://example.test/bank.png"
          imageAlt="Bank logo"
        />,
      )

      expect(screen.getByRole('img', { name: 'Bank logo' })).toBeInTheDocument()
    })

    it('falls back to the Cheddar logo when there is no image or icon', () => {
      const { container } = renderThemed(<AccountCard name="Checking" amount={10} />)

      expect(container.querySelector('.account-card-tile svg')).toBeInTheDocument()
      expect(container.querySelector('img')).toBeNull()
    })
  })

  describe('interaction', () => {
    it('renders a plain article by default', () => {
      renderThemed(<AccountCard name="Checking" amount={10} />)

      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('renders a button that calls onClick', async () => {
      const onClick = vi.fn()
      const { user } = renderThemed(
        <AccountCard name="Checking" amount={10} onClick={onClick} />,
      )

      await user.click(screen.getByRole('button', { name: /Checking/ }))

      expect(onClick).toHaveBeenCalledOnce()
    })

    it('renders an anchor when href is given', () => {
      renderThemed(<AccountCard name="Checking" amount={10} href="#accounts/checking" />)

      expect(screen.getByRole('link', { name: /Checking/ })).toHaveAttribute(
        'href',
        '#accounts/checking',
      )
    })
  })

  it('applies the accent class', () => {
    const { container } = renderThemed(
      <AccountCard name="Checking" amount={10} accent="blue" />,
    )

    expect(container.querySelector('.account-card')).toHaveClass('accent-blue')
  })
})
