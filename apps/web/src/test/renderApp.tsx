import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'

export function renderApp() {
  const user = userEvent.setup()
  render(<App />)
  return user
}

/** Every test starts past onboarding unless it is testing onboarding. */
export async function enterApp() {
  const user = renderApp()
  await user.click(screen.getByRole('button', { name: 'Sign in' }))
  return user
}

export const dialog = () => screen.getByRole('dialog')

/** Types an amount on the design system's `NumberPad`. */
export async function typeAmount(user: ReturnType<typeof userEvent.setup>, amount: string) {
  const pad = within(dialog()).getByRole('group', { name: 'Amount' })
  for (const character of amount) {
    const key =
      character === '.'
        ? within(pad).getByRole('button', { name: 'Decimal point' })
        : within(pad).getByRole('button', { name: character })
    await user.click(key)
  }
}

/** GoalCard folds its amounts into the control's accessible name. */
export const goalCard = (name: string) =>
  screen.getByRole('button', { name: new RegExp(`^${name},`) })
