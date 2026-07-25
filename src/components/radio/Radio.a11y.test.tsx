import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { Radio } from './Radio'

describe('Radio accessibility', () => {
  it('names the native radio from its visible label in the default state', async () => {
    const { container, getByRole } = renderThemed(<Radio label="Weekly" name="cadence" />)

    const radio = getByRole('radio', { name: 'Weekly' })
    expect(radio).not.toBeChecked()
    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes the checked state', async () => {
    const { container, getByRole } = renderThemed(<Radio label="Weekly" name="cadence" defaultChecked />)

    expect(getByRole('radio', { name: 'Weekly' })).toBeChecked()
    await expect(container).toHaveNoAxeViolations()
  })

  it('describes the radio with its helper text', async () => {
    const { container, getByRole } = renderThemed(
      <Radio label="Weekly" name="cadence" description="Every Monday morning" />,
    )

    expect(getByRole('radio', { name: 'Weekly' })).toHaveAccessibleDescription('Every Monday morning')
    await expect(container).toHaveNoAxeViolations()
  })

  it('marks the invalid state and references the message from aria-describedby', async () => {
    const { container, getByRole, getByText } = renderThemed(
      <Radio label="Weekly" name="cadence" error="Pick a cadence" />,
    )

    const radio = getByRole('radio', { name: 'Weekly' })
    const message = getByText('Pick a cadence')

    expect(radio).toHaveAttribute('aria-invalid', 'true')
    expect((radio.getAttribute('aria-describedby') ?? '').split(' ')).toContain(message.id)
    expect(radio).toHaveAccessibleDescription('Pick a cadence')
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations as a group of options', async () => {
    const { container, getAllByRole } = renderThemed(
      <>
        <Radio label="Weekly" name="cadence" defaultChecked />
        <Radio label="Monthly" name="cadence" />
        <Radio label="Never" name="cadence" disabled />
      </>,
    )

    expect(getAllByRole('radio')).toHaveLength(3)
    await expect(container).toHaveNoAxeViolations()
  })

  it('is reachable by Tab with no positive tabIndex', async () => {
    const { container, getByRole, user } = renderThemed(<Radio label="Weekly" name="cadence" />)

    await user.tab()
    expect(getByRole('radio', { name: 'Weekly' })).toHaveFocus()
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
  })
})
