import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { TotalSavingsCard } from './TotalSavingsCard'

describe('TotalSavingsCard', () => {
  it('renders the default label', () => {
    renderThemed(<TotalSavingsCard amount={1234.56} />)

    expect(screen.getByText('Total savings')).toBeInTheDocument()
  })

  it('renames the label', () => {
    renderThemed(<TotalSavingsCard label="Your balance" amount={1234.56} />)

    expect(screen.getByText('Your balance')).toBeInTheDocument()
  })

  describe('amount', () => {
    it('splits the cents out of the formatted amount', () => {
      const { container } = renderThemed(<TotalSavingsCard amount={1234.56} />)

      expect(container.querySelector('.total-savings-card-amount')).toHaveTextContent('$1,234.56')
      expect(container.querySelector('.total-savings-card-cents')).toHaveTextContent('.56')
    })

    it('renders a string amount verbatim without cents', () => {
      const { container } = renderThemed(<TotalSavingsCard amount="Hidden" />)

      expect(screen.getByText('Hidden')).toBeInTheDocument()
      expect(container.querySelector('.total-savings-card-cents')).toBeNull()
    })

    it('formats money with a custom formatter', () => {
      renderThemed(<TotalSavingsCard amount={1234} formatAmount={(value) => `${value} pts`} />)

      expect(screen.getByText('1234 pts')).toBeInTheDocument()
    })
  })

  describe('actions', () => {
    it('renders no action row without actions', () => {
      renderThemed(<TotalSavingsCard amount={10} />)

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('renders one button per action', () => {
      renderThemed(
        <TotalSavingsCard amount={10} actions={[{ label: 'Add' }, { label: 'Withdraw' }]} />,
      )

      expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
        'Add',
        'Withdraw',
      ])
    })

    it('calls the action onClick', async () => {
      const onClick = vi.fn()
      const { user } = renderThemed(
        <TotalSavingsCard amount={10} actions={[{ label: 'Add', icon: 'plus', onClick }]} />,
      )

      await user.click(screen.getByRole('button', { name: 'Add' }))

      expect(onClick).toHaveBeenCalledOnce()
    })
  })

  describe('badge and logo', () => {
    it('renders nothing in the header slot by default', () => {
      const { container } = renderThemed(<TotalSavingsCard amount={10} />)

      expect(container.querySelector('.total-savings-card-logo')).toBeNull()
    })

    it('renders the logo when showLogo is set', () => {
      const { container } = renderThemed(<TotalSavingsCard amount={10} showLogo />)

      expect(container.querySelector('.total-savings-card-logo svg')).toBeInTheDocument()
    })

    it('lets a badge win over the logo', () => {
      const { container } = renderThemed(
        <TotalSavingsCard amount={10} showLogo badge={<span>+12%</span>} />,
      )

      expect(screen.getByText('+12%')).toBeInTheDocument()
      expect(container.querySelector('.total-savings-card-logo')).toBeNull()
    })
  })

  it('renders its children', () => {
    renderThemed(
      <TotalSavingsCard amount={10}>
        <span>Extra content</span>
      </TotalSavingsCard>,
    )

    expect(screen.getByText('Extra content')).toBeInTheDocument()
  })
})
