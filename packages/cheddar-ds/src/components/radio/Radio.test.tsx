import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { Radio } from './Radio'

function RadioGroup({ onChoose }: { onChoose: (value: string) => void }) {
  const [choice, setChoice] = useState('weekly')
  return (
    <fieldset>
      <legend>Deposit rhythm</legend>
      {['weekly', 'monthly'].map((value) => (
        <Radio
          key={value}
          label={value}
          name="rhythm"
          value={value}
          checked={choice === value}
          onCheckedChange={(checked) => {
            if (checked) {
              setChoice(value)
              onChoose(value)
            }
          }}
        />
      ))}
    </fieldset>
  )
}

describe('Radio', () => {
  it('associates the label with the radio', () => {
    renderThemed(<Radio label="Weekly" />)

    expect(screen.getByLabelText('Weekly')).toBe(screen.getByRole('radio'))
  })

  it('starts unselected by default', () => {
    renderThemed(<Radio label="Weekly" />)

    expect(screen.getByRole('radio')).not.toBeChecked()
  })

  it('starts selected when defaultChecked is set', () => {
    renderThemed(<Radio label="Weekly" defaultChecked />)

    expect(screen.getByRole('radio')).toBeChecked()
  })

  describe('selecting', () => {
    it('reports the new state through onCheckedChange', async () => {
      const onCheckedChange = vi.fn()
      const { user } = renderThemed(<Radio label="Weekly" onCheckedChange={onCheckedChange} />)

      await user.click(screen.getByRole('radio'))

      expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true)
    })

    it('also calls the native onChange', async () => {
      const onChange = vi.fn()
      const { user } = renderThemed(<Radio label="Weekly" onChange={onChange} />)

      await user.click(screen.getByRole('radio'))

      expect(onChange).toHaveBeenCalledOnce()
    })

    it('stays selected when clicked again', async () => {
      const { user } = renderThemed(<Radio label="Weekly" />)

      const radio = screen.getByRole('radio')
      await user.click(radio)
      await user.click(radio)

      expect(radio).toBeChecked()
    })

    it('selects from the label text too', async () => {
      const { user } = renderThemed(<Radio label="Weekly" />)

      await user.click(screen.getByText('Weekly'))

      expect(screen.getByRole('radio')).toBeChecked()
    })

    it('never selects a controlled radio the owner does not change', async () => {
      const onCheckedChange = vi.fn()
      const { user } = renderThemed(
        <Radio label="Weekly" checked={false} onCheckedChange={onCheckedChange} />,
      )

      await user.click(screen.getByRole('radio'))

      expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true)
      expect(screen.getByRole('radio')).not.toBeChecked()
    })

    it('moves the selection within an uncontrolled group', async () => {
      const { user } = renderThemed(
        <>
          <Radio label="Weekly" name="rhythm" defaultChecked />
          <Radio label="Monthly" name="rhythm" />
        </>,
      )

      await user.click(screen.getByRole('radio', { name: 'Monthly' }))

      expect(screen.getByRole('radio', { name: 'Monthly' })).toBeChecked()
      expect(screen.getByRole('radio', { name: 'Weekly' })).not.toBeChecked()
    })

    it('shows the selection moving on the deselected radio, not just the input', async () => {
      const { user } = renderThemed(
        <>
          <Radio label="Weekly" name="rhythm" defaultChecked />
          <Radio label="Monthly" name="rhythm" />
        </>,
      )
      const weekly = screen.getByText('Weekly').closest('.check-field')
      expect(weekly?.querySelector('.check-circle')).toHaveClass('check-on')

      await user.click(screen.getByRole('radio', { name: 'Monthly' }))

      // The custom control is painted from state, so a stale sibling would keep
      // showing a filled dot even once the input underneath was unchecked.
      expect(weekly?.querySelector('.check-circle')).toHaveClass('check-off')
      expect(weekly?.querySelector('.radio-dot')).toBeNull()
    })

    it('tells a deselected radio it lost the selection', async () => {
      const onWeekly = vi.fn()
      const { user } = renderThemed(
        <>
          <Radio label="Weekly" name="rhythm" defaultChecked onCheckedChange={onWeekly} />
          <Radio label="Monthly" name="rhythm" />
        </>,
      )

      await user.click(screen.getByRole('radio', { name: 'Monthly' }))

      expect(onWeekly).toHaveBeenCalledExactlyOnceWith(false)
    })

    it('keeps uncontrolled groups independent when they use different names', async () => {
      const { user } = renderThemed(
        <>
          <Radio label="Weekly" name="rhythm" defaultChecked />
          <Radio label="Email" name="channel" defaultChecked />
        </>,
      )

      await user.click(screen.getByRole('radio', { name: 'Email' }))

      expect(screen.getByRole('radio', { name: 'Weekly' })).toBeChecked()
      expect(screen.getByRole('radio', { name: 'Email' })).toBeChecked()
    })

    it('moves the selection within a controlled group', async () => {
      const onChoose = vi.fn()
      const { user } = renderThemed(<RadioGroup onChoose={onChoose} />)

      await user.click(screen.getByRole('radio', { name: 'monthly' }))

      expect(onChoose).toHaveBeenCalledExactlyOnceWith('monthly')
      expect(screen.getByRole('radio', { name: 'monthly' })).toBeChecked()
      expect(screen.getByRole('radio', { name: 'weekly' })).not.toBeChecked()
    })
  })

  describe('native attributes', () => {
    it('forwards the attributes a form needs to the input', () => {
      renderThemed(<Radio label="Weekly" name="rhythm" value="weekly" required />)

      const radio = screen.getByRole('radio')
      expect(radio).toHaveAttribute('type', 'radio')
      expect(radio).toHaveAttribute('name', 'rhythm')
      expect(radio).toHaveAttribute('value', 'weekly')
      expect(radio).toBeRequired()
    })

    it('disables the radio and ignores clicks', async () => {
      const onCheckedChange = vi.fn()
      const { user } = renderThemed(
        <Radio label="Weekly" disabled onCheckedChange={onCheckedChange} />,
      )

      const radio = screen.getByRole('radio')
      expect(radio).toBeDisabled()

      await user.click(radio)
      expect(onCheckedChange).not.toHaveBeenCalled()
    })

    it('honours an id override', () => {
      renderThemed(<Radio label="Weekly" id="weekly" />)

      expect(screen.getByRole('radio')).toHaveAttribute('id', 'weekly')
    })
  })

  describe('description and validation', () => {
    it('describes the radio with its description', () => {
      renderThemed(<Radio label="Weekly" description="Every Monday" />)

      expect(screen.getByRole('radio')).toHaveAccessibleDescription('Every Monday')
    })

    it('is valid by default', () => {
      renderThemed(<Radio label="Weekly" />)

      expect(screen.getByRole('radio')).not.toHaveAttribute('aria-invalid')
    })

    it.each([
      ['error', { error: true }],
      ['invalid', { invalid: true }],
    ])('marks the radio invalid when %s is set', (_name, props) => {
      renderThemed(<Radio label="Weekly" {...props} />)

      expect(screen.getByRole('radio')).toHaveAttribute('aria-invalid', 'true')
    })

    it('uses a string error as both the invalid flag and the message', () => {
      renderThemed(<Radio label="Weekly" error="Choose a rhythm" />)

      const radio = screen.getByRole('radio')
      expect(radio).toHaveAttribute('aria-invalid', 'true')
      expect(radio).toHaveAccessibleDescription('Choose a rhythm')
    })
  })

  it('forwards a ref to the input element', () => {
    const ref = createRef<HTMLInputElement>()
    renderThemed(<Radio label="Weekly" ref={ref} />)

    expect(ref.current).toBe(screen.getByRole('radio'))
  })
})
