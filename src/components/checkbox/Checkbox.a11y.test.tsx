import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { Checkbox } from './Checkbox'

describe('Checkbox accessibility', () => {
  it('names the native checkbox from its visible label in the default state', async () => {
    const { container, getByRole } = renderThemed(<Checkbox label="Round up my purchases" />)

    const checkbox = getByRole('checkbox', { name: 'Round up my purchases' })
    expect(checkbox).not.toBeChecked()
    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes the checked state', async () => {
    const { container, getByRole } = renderThemed(<Checkbox label="Round up" defaultChecked />)

    expect(getByRole('checkbox', { name: 'Round up' })).toBeChecked()
    await expect(container).toHaveNoAxeViolations()
  })

  it('describes the checkbox with its helper text', async () => {
    const { container, getByRole } = renderThemed(
      <Checkbox label="Round up" description="We add the difference to your goal" />,
    )

    expect(getByRole('checkbox', { name: 'Round up' })).toHaveAccessibleDescription(
      'We add the difference to your goal',
    )
    await expect(container).toHaveNoAxeViolations()
  })

  it('marks the invalid state and references the message from aria-describedby', async () => {
    const { container, getByRole, getByText } = renderThemed(
      <Checkbox label="Accept the terms" error="You must accept the terms" />,
    )

    const checkbox = getByRole('checkbox', { name: 'Accept the terms' })
    const message = getByText('You must accept the terms')

    expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    expect((checkbox.getAttribute('aria-describedby') ?? '').split(' ')).toContain(message.id)
    expect(checkbox).toHaveAccessibleDescription('You must accept the terms')
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations when disabled', async () => {
    const { container } = renderThemed(<Checkbox label="Round up" disabled />)

    await expect(container).toHaveNoAxeViolations()
  })

  it('is reachable and toggleable from the keyboard with no positive tabIndex', async () => {
    const { container, getByRole, user } = renderThemed(<Checkbox label="Round up" />)

    const checkbox = getByRole('checkbox', { name: 'Round up' })
    await user.tab()
    expect(checkbox).toHaveFocus()

    await user.keyboard(' ')
    expect(checkbox).toBeChecked()
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
  })
})
