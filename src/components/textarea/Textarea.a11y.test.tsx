import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { Textarea } from './Textarea'

describe('Textarea accessibility', () => {
  it('names the control from its visible label in the default state', async () => {
    const { container, getByRole } = renderThemed(<Textarea label="Note" />)

    expect(getByRole('textbox', { name: 'Note' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('keeps an accessible name when the label is visually hidden', async () => {
    const { container, getByRole } = renderThemed(<Textarea label="Note" showLabel={false} />)

    expect(getByRole('textbox', { name: 'Note' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('describes the control with its helper text', async () => {
    const { container, getByRole } = renderThemed(
      <Textarea label="Note" description="Only you can see this" />,
    )

    expect(getByRole('textbox', { name: 'Note' })).toHaveAccessibleDescription('Only you can see this')
    await expect(container).toHaveNoAxeViolations()
  })

  it('marks the invalid state and references the message from aria-describedby', async () => {
    const { container, getByRole, getByText } = renderThemed(
      <Textarea label="Note" error="Say something about this goal" />,
    )

    const textarea = getByRole('textbox', { name: 'Note' })
    const message = getByText('Say something about this goal')

    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    expect((textarea.getAttribute('aria-describedby') ?? '').split(' ')).toContain(message.id)
    expect(textarea).toHaveAccessibleDescription('Say something about this goal')
    await expect(container).toHaveNoAxeViolations()
  })

  it('keeps both the description and the message in aria-describedby when invalid', async () => {
    const { container, getByRole, getByText } = renderThemed(
      <Textarea label="Note" description="Only you can see this" errorMessage="Say something" invalid />,
    )

    const describedBy = (
      getByRole('textbox', { name: 'Note' }).getAttribute('aria-describedby') ?? ''
    ).split(' ')

    expect(describedBy).toContain(getByText('Only you can see this').id)
    expect(describedBy).toContain(getByText('Say something').id)
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations when disabled', async () => {
    const { container } = renderThemed(<Textarea label="Note" disabled />)

    await expect(container).toHaveNoAxeViolations()
  })

  it('is reachable by Tab and carries no positive tabIndex', async () => {
    const { container, getByRole, user } = renderThemed(<Textarea label="Note" />)

    await user.tab()
    expect(getByRole('textbox', { name: 'Note' })).toHaveFocus()
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
  })
})
