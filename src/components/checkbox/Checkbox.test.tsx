import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { Checkbox } from './Checkbox'

function ControlledCheckbox({ onCheckedChange }: { onCheckedChange: (checked: boolean) => void }) {
  const [checked, setChecked] = useState(false)
  return (
    <Checkbox
      label="Round up purchases"
      checked={checked}
      onCheckedChange={(next) => {
        setChecked(next)
        onCheckedChange(next)
      }}
    />
  )
}

describe('Checkbox', () => {
  it('associates the label with the checkbox', () => {
    renderThemed(<Checkbox label="Round up purchases" />)

    expect(screen.getByLabelText('Round up purchases')).toBe(screen.getByRole('checkbox'))
  })

  it('starts unchecked by default', () => {
    renderThemed(<Checkbox label="Round up purchases" />)

    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('starts checked when defaultChecked is set', () => {
    renderThemed(<Checkbox label="Round up purchases" defaultChecked />)

    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  describe('toggling', () => {
    it('reports the new state through onCheckedChange', async () => {
      const onCheckedChange = vi.fn()
      const { user } = renderThemed(
        <Checkbox label="Round up purchases" onCheckedChange={onCheckedChange} />,
      )

      await user.click(screen.getByRole('checkbox'))

      expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true)
    })

    it('also calls the native onChange', async () => {
      const onChange = vi.fn()
      const { user } = renderThemed(<Checkbox label="Round up purchases" onChange={onChange} />)

      await user.click(screen.getByRole('checkbox'))

      expect(onChange).toHaveBeenCalledOnce()
    })

    it('toggles back off on a second click when uncontrolled', async () => {
      const onCheckedChange = vi.fn()
      const { user } = renderThemed(
        <Checkbox label="Round up purchases" onCheckedChange={onCheckedChange} />,
      )

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)
      await user.click(checkbox)

      expect(onCheckedChange).toHaveBeenNthCalledWith(2, false)
      expect(checkbox).not.toBeChecked()
    })

    it('toggles from the label text too', async () => {
      const { user } = renderThemed(<Checkbox label="Round up purchases" />)

      await user.click(screen.getByText('Round up purchases'))

      expect(screen.getByRole('checkbox')).toBeChecked()
    })

    it('toggles with the space key', async () => {
      const { user } = renderThemed(<Checkbox label="Round up purchases" />)

      await user.tab()
      await user.keyboard(' ')

      expect(screen.getByRole('checkbox')).toBeChecked()
    })

    it('never moves a controlled checkbox the owner does not change', async () => {
      const onCheckedChange = vi.fn()
      const { user } = renderThemed(
        <Checkbox label="Round up purchases" checked={false} onCheckedChange={onCheckedChange} />,
      )

      await user.click(screen.getByRole('checkbox'))

      expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true)
      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })

    it('follows a controlled checkbox the owner does change', async () => {
      const onCheckedChange = vi.fn()
      const { user } = renderThemed(<ControlledCheckbox onCheckedChange={onCheckedChange} />)

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(checkbox).toBeChecked()
      expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true)
    })
  })

  describe('native attributes', () => {
    it('forwards the attributes a form needs to the input', () => {
      renderThemed(<Checkbox label="Terms" name="terms" value="accepted" required />)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('type', 'checkbox')
      expect(checkbox).toHaveAttribute('name', 'terms')
      expect(checkbox).toHaveAttribute('value', 'accepted')
      expect(checkbox).toBeRequired()
    })

    it('disables the checkbox and ignores clicks', async () => {
      const onCheckedChange = vi.fn()
      const { user } = renderThemed(
        <Checkbox label="Round up purchases" disabled onCheckedChange={onCheckedChange} />,
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()

      await user.click(checkbox)
      expect(onCheckedChange).not.toHaveBeenCalled()
    })

    it('honours an id override', () => {
      renderThemed(<Checkbox label="Round up purchases" id="round-up" />)

      expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'round-up')
    })
  })

  describe('description and validation', () => {
    it('describes the checkbox with its description', () => {
      renderThemed(<Checkbox label="Round up purchases" description="To the nearest dollar" />)

      expect(screen.getByRole('checkbox')).toHaveAccessibleDescription('To the nearest dollar')
    })

    it('is valid by default', () => {
      renderThemed(<Checkbox label="Terms" />)

      expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid')
    })

    it.each([
      ['error', { error: true }],
      ['invalid', { invalid: true }],
    ])('marks the checkbox invalid when %s is set', (_name, props) => {
      renderThemed(<Checkbox label="Terms" {...props} />)

      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('uses a string error as both the invalid flag and the message', () => {
      renderThemed(<Checkbox label="Terms" error="You must accept the terms" />)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-invalid', 'true')
      expect(checkbox).toHaveAccessibleDescription('You must accept the terms')
    })
  })

  it('forwards a ref to the input element', () => {
    const ref = createRef<HTMLInputElement>()
    renderThemed(<Checkbox label="Terms" ref={ref} />)

    expect(ref.current).toBe(screen.getByRole('checkbox'))
  })
})
