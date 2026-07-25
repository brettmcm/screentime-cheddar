import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { SectionHeader } from './SectionHeader'

describe('SectionHeader', () => {
  it('renders the title as a level-two heading by default', () => {
    renderThemed(<SectionHeader title="Your goals" />)

    expect(screen.getByRole('heading', { level: 2, name: 'Your goals' })).toBeInTheDocument()
  })

  it.each([
    ['h2', 2],
    ['h3', 3],
    ['h4', 4],
  ] as const)('renders the title as %s when as is set', (as, level) => {
    renderThemed(<SectionHeader title="Your goals" as={as} />)

    expect(screen.getByRole('heading', { level, name: 'Your goals' })).toBeInTheDocument()
  })

  it('puts the id on the heading so a region can point at it', () => {
    renderThemed(<SectionHeader title="Your goals" id="goals-heading" />)

    expect(screen.getByRole('heading', { name: 'Your goals' })).toHaveAttribute(
      'id',
      'goals-heading',
    )
  })

  describe('action', () => {
    it('renders no action without actionLabel', () => {
      renderThemed(<SectionHeader title="Your goals" />)

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('renders a button that calls onAction', async () => {
      const onAction = vi.fn()
      const { user } = renderThemed(
        <SectionHeader title="Your goals" actionLabel="View all" onAction={onAction} />,
      )

      await user.click(screen.getByRole('button', { name: 'View all' }))

      expect(onAction).toHaveBeenCalledOnce()
    })

    it('renders an anchor when actionHref is given', () => {
      renderThemed(
        <SectionHeader title="Your goals" actionLabel="View all" actionHref="#goals" />,
      )

      expect(screen.getByRole('link', { name: 'View all' })).toHaveAttribute('href', '#goals')
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  it('renders the trailing slot alongside the action', () => {
    renderThemed(
      <SectionHeader title="Your goals" actionLabel="View all" trailing={<span>3 goals</span>} />,
    )

    expect(screen.getByText('3 goals')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'View all' })).toBeInTheDocument()
  })

  it('renders the trailing slot on its own', () => {
    renderThemed(<SectionHeader title="Your goals" trailing={<span>3 goals</span>} />)

    expect(screen.getByText('3 goals')).toBeInTheDocument()
  })
})
