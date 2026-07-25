import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { SwitchField } from './SwitchField'

describe('SwitchField accessibility', () => {
  it('exposes a named switch in the default state', async () => {
    const { container, getByRole } = renderThemed(<SwitchField label="Push notifications" />)

    const control = getByRole('switch', { name: 'Push notifications' })
    expect(control).not.toBeChecked()
    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes the on state', async () => {
    const { container, getByRole } = renderThemed(<SwitchField label="Push notifications" defaultChecked />)

    expect(getByRole('switch', { name: 'Push notifications' })).toBeChecked()
    await expect(container).toHaveNoAxeViolations()
  })

  it('keeps an accessible name when the label is visually hidden', async () => {
    const { container, getByRole } = renderThemed(
      <SwitchField label="Push notifications" showLabel={false} />,
    )

    expect(getByRole('switch', { name: 'Push notifications' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('describes the switch with its helper text', async () => {
    const { container, getByRole } = renderThemed(
      <SwitchField label="Push notifications" description="Goal reminders and streaks" />,
    )

    expect(getByRole('switch', { name: 'Push notifications' })).toHaveAccessibleDescription(
      'Goal reminders and streaks',
    )
    await expect(container).toHaveNoAxeViolations()
  })

  it('marks the invalid state and references the message from aria-describedby', async () => {
    const { container, getByRole, getByText } = renderThemed(
      <SwitchField label="Push notifications" error="Turn this on to continue" />,
    )

    const control = getByRole('switch', { name: 'Push notifications' })
    const message = getByText('Turn this on to continue')

    expect(control).toHaveAttribute('aria-invalid', 'true')
    expect((control.getAttribute('aria-describedby') ?? '').split(' ')).toContain(message.id)
    expect(control).toHaveAccessibleDescription('Turn this on to continue')
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations when disabled', async () => {
    const { container } = renderThemed(<SwitchField label="Push notifications" disabled />)

    await expect(container).toHaveNoAxeViolations()
  })

  it('is reachable and toggleable from the keyboard with no positive tabIndex', async () => {
    const { container, getByRole, user } = renderThemed(<SwitchField label="Push notifications" />)

    const control = getByRole('switch', { name: 'Push notifications' })
    await user.tab()
    expect(control).toHaveFocus()

    await user.keyboard(' ')
    expect(control).toBeChecked()
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
  })
})
