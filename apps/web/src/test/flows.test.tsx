import { screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { dialog, enterApp, goalCard, typeAmount } from './renderApp'

const nav = () => screen.getByRole('navigation', { name: 'Primary' })

describe('add goal', () => {
  it('creates a goal from the two-step flow', async () => {
    const user = await enterApp()
    await user.click(within(nav()).getByRole('button', { name: 'Add goal' }))

    const next = screen.getByRole('button', { name: 'Next: Set amount' })
    expect(next).toBeDisabled()

    await user.type(screen.getByLabelText('Goal name'), 'Guitar')
    await user.click(screen.getByRole('button', { name: 'Trip' }))
    await user.click(next)

    const pad = screen.getByRole('group', { name: 'Goal amount' })
    for (const key of ['3', '0', '0']) {
      await user.click(within(pad).getByRole('button', { name: key }))
    }
    await user.click(screen.getByRole('button', { name: 'Add Goal: Guitar' }))

    // Lands back on Home with the goal in the list.
    expect(screen.getByRole('heading', { name: 'Hi, Jamie' })).toBeInTheDocument()
    expect(goalCard('Guitar')).toHaveAccessibleName('Guitar, $0.00 of $300.00, 0% saved')
  })

  it('carries a starting balance into the new goal', async () => {
    const user = await enterApp()
    await user.click(within(nav()).getByRole('button', { name: 'Add goal' }))
    await user.type(screen.getByLabelText('Goal name'), 'Guitar')
    await user.click(screen.getByRole('button', { name: 'Next: Set amount' }))

    const target = screen.getByRole('group', { name: 'Goal amount' })
    for (const key of ['2', '0', '0']) {
      await user.click(within(target).getByRole('button', { name: key }))
    }
    await user.click(screen.getByRole('button', { name: /Starting saved amount/ }))
    const starting = screen.getByRole('group', { name: 'Starting saved amount' })
    for (const key of ['5', '0']) {
      await user.click(within(starting).getByRole('button', { name: key }))
    }
    await user.click(screen.getByRole('button', { name: 'Add Goal: Guitar' }))

    expect(goalCard('Guitar')).toHaveAccessibleName('Guitar, $50.00 of $200.00, 25% saved')
  })

  it('steps back to the details step before leaving the screen', async () => {
    const user = await enterApp()
    await user.click(within(nav()).getByRole('button', { name: 'Add goal' }))
    await user.type(screen.getByLabelText('Goal name'), 'Guitar')
    await user.click(screen.getByRole('button', { name: 'Next: Set amount' }))

    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByLabelText('Goal name')).toHaveValue('Guitar')

    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('heading', { name: 'Hi, Jamie' })).toBeInTheDocument()
  })
})

describe('learn', () => {
  const openLearn = async (user: Awaited<ReturnType<typeof enterApp>>) => {
    await user.click(within(nav()).getByRole('button', { name: 'Learn' }))
  }

  it('filters articles as you search', async () => {
    const user = await enterApp()
    await openLearn(user)

    expect(screen.getByRole('heading', { name: 'Guides' })).toBeInTheDocument()

    await user.type(screen.getByLabelText('Search articles'), 'credit')

    expect(screen.queryByRole('heading', { name: 'Guides' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tips & Tricks' })).toBeInTheDocument()
  })

  it('reports when nothing matches', async () => {
    const user = await enterApp()
    await openLearn(user)

    await user.type(screen.getByLabelText('Search articles'), 'zzzz')

    expect(screen.getByText(/No articles match/)).toBeInTheDocument()
  })

  it('opens an article and returns to the list', async () => {
    const user = await enterApp()
    await openLearn(user)

    await user.click(screen.getByRole('button', { name: 'Savings 101' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Savings 101' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Key takeaways' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back to Learn' }))
    expect(screen.getByLabelText('Search articles')).toBeInTheDocument()
  })
})

describe('profile', () => {
  it('edits the display name and handle', async () => {
    const user = await enterApp()
    await user.click(within(nav()).getByRole('button', { name: 'Profile' }))

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    const name = within(dialog()).getByLabelText('Display name')
    await user.clear(name)
    await user.type(name, 'Alex R.')
    await user.click(within(dialog()).getByRole('button', { name: 'Save changes' }))

    expect(screen.getByText('Alex R.')).toBeInTheDocument()
    expect(screen.getByText('Profile updated')).toBeInTheDocument()
  })

  it('recalculates the Stack Master badge from real savings', async () => {
    const user = await enterApp()
    await user.click(within(nav()).getByRole('button', { name: 'Profile' }))

    expect(screen.getByText('$194.70 of $500.00 total savings')).toBeInTheDocument()
  })

  it('summarises every goal with a total', async () => {
    const user = await enterApp()
    await user.click(within(nav()).getByRole('button', { name: 'Profile' }))

    const summary = screen.getByText('Total savings').closest('article')
    expect(summary).not.toBeNull()
    expect(within(summary as HTMLElement).getByText('Freshman Trip')).toBeInTheDocument()
    expect(within(summary as HTMLElement).getByText('$194.70')).toBeInTheDocument()
  })
})

describe('sharing', () => {
  // `navigator.share` and `navigator.clipboard` are getter-only in jsdom.
  const stubNavigator = (members: Record<string, unknown>) => {
    for (const [key, value] of Object.entries(members)) {
      Object.defineProperty(navigator, key, { value, configurable: true, writable: true })
    }
  }

  afterEach(() => {
    stubNavigator({ share: undefined, clipboard: undefined })
  })

  it('uses the native share sheet when the browser has one', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    const user = await enterApp()
    // After `userEvent.setup()`, which installs a clipboard stub of its own.
    stubNavigator({ share })

    await user.click(within(nav()).getByRole('button', { name: 'Profile' }))
    await user.click(screen.getByRole('button', { name: 'Share' }))

    expect(share).toHaveBeenCalledOnce()
  })

  it('falls back to the clipboard when it does not', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    const user = await enterApp()
    stubNavigator({ share: undefined, clipboard: { writeText } })

    await user.click(within(nav()).getByRole('button', { name: 'Profile' }))
    await user.click(screen.getByRole('button', { name: 'Share' }))

    expect(writeText).toHaveBeenCalledWith("I'm saving with Cheddar!")
    await waitFor(() => expect(screen.getByText('Copied to clipboard')).toBeInTheDocument())
  })
})

describe('theme switching', () => {
  it('applies the chosen brand to the frame', async () => {
    const user = await enterApp()
    await user.click(within(nav()).getByRole('button', { name: 'Profile' }))
    await user.click(screen.getByRole('button', { name: 'Theme settings' }))

    await user.click(screen.getByRole('radio', { name: 'Blue' }))

    expect(document.querySelector('.app-frame')).toHaveAttribute('data-brand', 'blue')
    expect(screen.getByText('Blue theme selected')).toBeInTheDocument()
  })

  it('themes portalled sheets through the document element', async () => {
    const user = await enterApp()
    await user.click(within(nav()).getByRole('button', { name: 'Profile' }))
    await user.click(screen.getByRole('button', { name: 'Theme settings' }))
    await user.click(screen.getByRole('radio', { name: 'Green' }))

    // Sheets render outside .app-frame, so the theme has to reach the root too.
    expect(document.documentElement).toHaveAttribute('data-brand', 'green')
    expect(document.documentElement).toHaveAttribute('data-appearance', 'brand')
  })

  it('swaps the brand appearance for the light scheme', async () => {
    const user = await enterApp()
    await user.click(within(nav()).getByRole('button', { name: 'Profile' }))
    await user.click(screen.getByRole('button', { name: 'Theme settings' }))

    await user.click(screen.getByRole('radio', { name: 'Light' }))

    // The two are separate token layers and appearance would win over scheme,
    // so light mode has to drop the brand appearance rather than add to it.
    const frame = document.querySelector('.app-frame')
    expect(frame).toHaveAttribute('data-theme', 'light')
    expect(frame).not.toHaveAttribute('data-appearance')
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(document.documentElement).not.toHaveAttribute('data-appearance')
  })

  it('keeps the brand when the mode changes', async () => {
    const user = await enterApp()
    await user.click(within(nav()).getByRole('button', { name: 'Profile' }))
    await user.click(screen.getByRole('button', { name: 'Theme settings' }))

    await user.click(screen.getByRole('radio', { name: 'Purple' }))
    await user.click(screen.getByRole('radio', { name: 'Light' }))

    const frame = document.querySelector('.app-frame')
    expect(frame).toHaveAttribute('data-brand', 'purple')
    expect(frame).toHaveAttribute('data-theme', 'light')
  })

  it('returns to the brand appearance for dark', async () => {
    const user = await enterApp()
    await user.click(within(nav()).getByRole('button', { name: 'Profile' }))
    await user.click(screen.getByRole('button', { name: 'Theme settings' }))

    await user.click(screen.getByRole('radio', { name: 'Light' }))
    await user.click(screen.getByRole('radio', { name: 'Dark' }))

    const frame = document.querySelector('.app-frame')
    expect(frame).toHaveAttribute('data-appearance', 'brand')
    expect(frame).not.toHaveAttribute('data-theme')
  })
})

describe('goal unlock slider', () => {
  const reachGoal = async (user: Awaited<ReturnType<typeof enterApp>>) => {
    await user.click(screen.getByRole('button', { name: 'Deposit' }))
    await user.click(within(dialog()).getByRole('radio', { name: /Sneakers/ }))
    await typeAmount(user, '20')
    await user.click(within(dialog()).getByRole('button', { name: 'Confirm deposit' }))
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Goal Reached' })).toBeInTheDocument(),
    )
  }

  it('latches after the first completion', async () => {
    const user = await enterApp()
    await reachGoal(user)

    const slider = screen.getByRole('slider')
    slider.focus()
    await user.keyboard('{End}')

    // Unlocking is one-way: the control is inert, so it cannot fire again.
    expect(slider).toHaveAttribute('aria-disabled', 'true')
    await user.keyboard('{Home}')
    expect(slider).toHaveAttribute('aria-valuenow', '100')
  })

  it('continues to Home exactly once', async () => {
    const user = await enterApp()
    await reachGoal(user)

    const slider = screen.getByRole('slider')
    slider.focus()
    await user.keyboard('{End}')
    await user.keyboard('{End}')

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Hi, Jamie' })).toBeInTheDocument(),
    )

    await user.click(within(nav()).getByRole('button', { name: 'Learn' }))
    await new Promise((resolve) => setTimeout(resolve, 400))

    // A second queued navigation would have pulled the app back to Home.
    expect(screen.getByRole('heading', { name: 'Learn' })).toBeInTheDocument()
  })
})
