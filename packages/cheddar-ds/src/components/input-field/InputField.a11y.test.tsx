import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { InputField } from './InputField'

describe('InputField accessibility', () => {
  it('names the input from its visible label in the default state', async () => {
    const { container, getByRole } = renderThemed(<InputField label="Account name" />)

    expect(getByRole('textbox', { name: 'Account name' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('keeps an accessible name when the label is visually hidden', async () => {
    const { container, getByRole } = renderThemed(<InputField label="Account name" showLabel={false} />)

    expect(getByRole('textbox', { name: 'Account name' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('describes the input with its helper text', async () => {
    const { container, getByRole } = renderThemed(
      <InputField label="Account name" description="Shown on your statements" />,
    )

    const input = getByRole('textbox', { name: 'Account name' })
    expect(input).toHaveAccessibleDescription('Shown on your statements')
    await expect(container).toHaveNoAxeViolations()
  })

  it('marks the invalid state and references the message from aria-describedby', async () => {
    const { container, getByRole, getByText } = renderThemed(
      <InputField label="Account name" error="Enter a name" />,
    )

    const input = getByRole('textbox', { name: 'Account name' })
    const message = getByText('Enter a name')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect((input.getAttribute('aria-describedby') ?? '').split(' ')).toContain(message.id)
    expect(input).toHaveAccessibleDescription('Enter a name')
    await expect(container).toHaveNoAxeViolations()
  })

  it('keeps both the description and the message in aria-describedby when invalid', async () => {
    const { container, getByRole, getByText } = renderThemed(
      <InputField label="Account name" description="Shown on your statements" errorMessage="Enter a name" invalid />,
    )

    const input = getByRole('textbox', { name: 'Account name' })
    const describedBy = (input.getAttribute('aria-describedby') ?? '').split(' ')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(describedBy).toContain(getByText('Shown on your statements').id)
    expect(describedBy).toContain(getByText('Enter a name').id)
    await expect(container).toHaveNoAxeViolations()
  })

  it('marks the invalid state without a message when only `invalid` is set', async () => {
    const { container, getByRole } = renderThemed(<InputField label="Account name" invalid />)

    expect(getByRole('textbox', { name: 'Account name' })).toHaveAttribute('aria-invalid', 'true')
    await expect(container).toHaveNoAxeViolations()
  })

  it('names the dropdown and its options', async () => {
    const { container, getByRole } = renderThemed(
      <InputField label="Account type" dropdown options={['Checking', 'Savings']} />,
    )

    expect(getByRole('combobox', { name: 'Account type' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('wires the invalid dropdown to its message', async () => {
    const { container, getByRole, getByText } = renderThemed(
      <InputField label="Account type" dropdown error="Pick an account" />,
    )

    const select = getByRole('combobox', { name: 'Account type' })

    expect(select).toHaveAttribute('aria-invalid', 'true')
    expect((select.getAttribute('aria-describedby') ?? '').split(' ')).toContain(
      getByText('Pick an account').id,
    )
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations when disabled or read-only', async () => {
    const { container } = renderThemed(
      <>
        <InputField label="Disabled field" disabled />
        <InputField label="Read-only field" readOnly value="Locked" onValueChange={() => {}} />
      </>,
    )

    await expect(container).toHaveNoAxeViolations()
  })

  it('is reachable by Tab and carries no positive tabIndex', async () => {
    const { container, getByRole, user } = renderThemed(<InputField label="Account name" />)

    await user.tab()
    expect(getByRole('textbox', { name: 'Account name' })).toHaveFocus()
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
  })
})
