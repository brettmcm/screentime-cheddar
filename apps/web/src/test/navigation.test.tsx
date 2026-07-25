import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { enterApp, goalCard, renderApp } from './renderApp'

const nav = () => screen.getByRole('navigation', { name: 'Primary' })

describe('navigation', () => {
  it('enters the app from onboarding', async () => {
    const user = renderApp()
    expect(screen.getByRole('heading', { name: /Save\. Unlock\./ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Sign up' }))

    expect(screen.getByRole('heading', { name: 'Hi, Jamie' })).toBeInTheDocument()
  })

  it('moves between every tab from the design system nav', async () => {
    const user = await enterApp()

    await user.click(within(nav()).getByRole('button', { name: 'Wallet' }))
    expect(screen.getByRole('heading', { name: 'Savings' })).toBeInTheDocument()

    await user.click(within(nav()).getByRole('button', { name: 'Learn' }))
    expect(screen.getByRole('heading', { name: 'Learn' })).toBeInTheDocument()

    await user.click(within(nav()).getByRole('button', { name: 'Profile' }))
    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument()

    await user.click(within(nav()).getByRole('button', { name: 'Home' }))
    expect(screen.getByRole('heading', { name: 'Hi, Jamie' })).toBeInTheDocument()
  })

  it('marks the active tab with aria-current', async () => {
    const user = await enterApp()
    expect(within(nav()).getByRole('button', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page',
    )

    await user.click(within(nav()).getByRole('button', { name: 'Learn' }))

    expect(within(nav()).getByRole('button', { name: 'Learn' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(nav()).getByRole('button', { name: 'Home' })).not.toHaveAttribute('aria-current')
  })

  it('exposes exactly one control per destination', async () => {
    await enterApp()
    // The old build overlaid an invisible hit-area grid on top of the nav.
    expect(within(nav()).getAllByRole('button')).toHaveLength(5)
  })

  it('opens Add Goal from the centre nav action', async () => {
    const user = await enterApp()

    await user.click(within(nav()).getByRole('button', { name: 'Add goal' }))

    expect(screen.getByRole('heading', { name: 'Add Goal' })).toBeInTheDocument()
  })

  it('returns a stack screen to the tab it was opened from', async () => {
    const user = await enterApp()
    await user.click(within(nav()).getByRole('button', { name: 'Wallet' }))

    await user.click(goalCard('Headphones'))
    expect(screen.getByRole('heading', { name: 'Headphones' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back' }))

    // Opened from Savings, so it goes back to Savings rather than Home.
    expect(screen.getByRole('heading', { name: 'Savings' })).toBeInTheDocument()
  })

  it('keeps the nav in step with the tab a stack screen returns to', async () => {
    const user = await enterApp()
    await user.click(within(nav()).getByRole('button', { name: 'Profile' }))
    await user.click(screen.getByRole('button', { name: 'Theme settings' }))
    await user.click(screen.getByRole('button', { name: 'Back' }))

    expect(within(nav()).getByRole('button', { name: 'Profile' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
