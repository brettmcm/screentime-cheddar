import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { ActivityItem } from './ActivityItem'

describe('ActivityItem', () => {
  describe('defaults', () => {
    it('renders a deposit with its default copy', () => {
      renderThemed(<ActivityItem />)

      expect(screen.getByText('Deposit')).toBeInTheDocument()
      expect(screen.getByText('Today, 11:17am')).toBeInTheDocument()
      expect(screen.getByText('$80.00')).toBeInTheDocument()
    })

    it('renders a withdrawal with its default copy', () => {
      renderThemed(<ActivityItem type="withdrawal" />)

      expect(screen.getByText('Withdrawal')).toBeInTheDocument()
    })

    it('is not interactive without onClick or href', () => {
      renderThemed(<ActivityItem />)

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
  })

  describe('overrides', () => {
    it('renders a title in place of the type label', () => {
      renderThemed(<ActivityItem title="Payday" />)

      expect(screen.getByText('Payday')).toBeInTheDocument()
      expect(screen.queryByText('Deposit')).not.toBeInTheDocument()
    })

    it('renders a subtitle in place of the time', () => {
      renderThemed(<ActivityItem time="Today, 11:17am" subtitle="From Checking" />)

      expect(screen.getByText('From Checking')).toBeInTheDocument()
      expect(screen.queryByText('Today, 11:17am')).not.toBeInTheDocument()
    })

    it('renders a custom time', () => {
      renderThemed(<ActivityItem time="Yesterday, 4:02pm" />)

      expect(screen.getByText('Yesterday, 4:02pm')).toBeInTheDocument()
    })

    it('renders a custom amount', () => {
      renderThemed(<ActivityItem amount="$1,250.00" />)

      expect(screen.getByText('$1,250.00')).toBeInTheDocument()
    })

    it('renders a rich amount node', () => {
      renderThemed(<ActivityItem amount={<em>pending</em>} />)

      expect(screen.getByText('pending').tagName).toBe('EM')
    })

    it('renders a custom icon in place of the derived arrow', () => {
      const { container } = renderThemed(<ActivityItem icon="piggybank" />)

      expect(container.querySelector('.activity-item-icon svg')).toBeInTheDocument()
    })
  })

  describe('withdrawal', () => {
    it('prefixes the amount with a minus sign', () => {
      const { container } = renderThemed(<ActivityItem type="withdrawal" amount="$40.00" />)

      const withdrawal = container.querySelector('.activity-item-withdrawal')
      expect(withdrawal).toHaveTextContent('-$40.00')
      expect(container.querySelector('.activity-item-minus')).toHaveTextContent('-')
    })

    it('does not prefix a deposit amount', () => {
      const { container } = renderThemed(<ActivityItem type="deposit" amount="$40.00" />)

      expect(container.querySelector('.activity-item-minus')).toBeNull()
      expect(container.querySelector('.activity-item-amount')).toHaveTextContent('$40.00')
    })
  })

  describe('interactive', () => {
    it('renders a button that calls onClick', async () => {
      const onClick = vi.fn()
      const { user } = renderThemed(<ActivityItem title="Payday" onClick={onClick} />)

      const button = screen.getByRole('button', { name: /Payday/ })
      expect(button).toHaveAttribute('type', 'button')

      await user.click(button)
      expect(onClick).toHaveBeenCalledOnce()
    })

    it('renders an anchor when href is given', () => {
      renderThemed(<ActivityItem title="Payday" href="#activity/1" />)

      expect(screen.getByRole('link', { name: /Payday/ })).toHaveAttribute('href', '#activity/1')
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('calls onClick from the anchor too', async () => {
      const onClick = vi.fn()
      const { user } = renderThemed(
        <ActivityItem title="Payday" href="#activity/1" onClick={onClick} />,
      )

      await user.click(screen.getByRole('link', { name: /Payday/ }))

      expect(onClick).toHaveBeenCalledOnce()
    })

    it('keeps the amount inside the interactive control', () => {
      renderThemed(<ActivityItem title="Payday" amount="$80.00" onClick={vi.fn()} />)

      expect(screen.getByRole('button')).toHaveTextContent('$80.00')
    })
  })

  it('keeps its own class alongside a caller class', () => {
    const { container } = renderThemed(<ActivityItem className="ledger-row" />)

    expect(container.querySelector('.activity-item')).toHaveClass('activity-item', 'ledger-row')
  })
})
