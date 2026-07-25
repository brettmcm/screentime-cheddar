import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { BadgeCard } from './BadgeCard'

describe('BadgeCard', () => {
  it('renders the title and caption', () => {
    renderThemed(<BadgeCard title="Streak starter" caption="3 of 7 days" />)

    expect(screen.getByText('Streak starter')).toBeInTheDocument()
    expect(screen.getByText('3 of 7 days')).toBeInTheDocument()
  })

  describe('progress', () => {
    it('renders no progress bar when progress is omitted', () => {
      renderThemed(<BadgeCard title="Streak starter" />)

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    it('reports the progress it is given', () => {
      renderThemed(<BadgeCard title="Streak starter" progress={40} />)

      expect(screen.getByRole('progressbar', { name: 'Streak starter progress' })).toHaveAttribute(
        'aria-valuenow',
        '40',
      )
    })

    it('renders a progress bar at zero', () => {
      renderThemed(<BadgeCard title="Streak starter" progress={0} />)

      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    })

    it.each([
      [-20, '0'],
      [140, '100'],
    ])('clamps a progress of %d to %s', (progress, expected) => {
      renderThemed(<BadgeCard title="Streak starter" progress={progress} />)

      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', expected)
    })
  })

  describe('tile', () => {
    it('renders an image with its alt text', () => {
      renderThemed(
        <BadgeCard
          title="Streak starter"
          image="https://example.test/badge.png"
          imageAlt="A gold star"
        />,
      )

      expect(screen.getByRole('img', { name: 'A gold star' })).toBeInTheDocument()
    })

    it('falls back to an icon', () => {
      const { container } = renderThemed(<BadgeCard title="Streak starter" icon="sparkle" />)

      expect(container.querySelector('.badge-card-tile svg')).toBeInTheDocument()
    })
  })

  describe('interaction', () => {
    it('renders a plain article by default', () => {
      renderThemed(<BadgeCard title="Streak starter" />)

      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('renders a button that calls onClick', async () => {
      const onClick = vi.fn()
      const { user } = renderThemed(<BadgeCard title="Streak starter" onClick={onClick} />)

      await user.click(screen.getByRole('button', { name: /Streak starter/ }))

      expect(onClick).toHaveBeenCalledOnce()
    })
  })

  it('applies the accent class', () => {
    const { container } = renderThemed(<BadgeCard title="Streak starter" accent="purple" />)

    expect(container.querySelector('.badge-card')).toHaveClass('accent-purple')
  })
})
