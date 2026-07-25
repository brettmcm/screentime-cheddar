import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { SwitchField } from './SwitchField'

function ControlledSwitch({ onCheckedChange }: { onCheckedChange: (checked: boolean) => void }) {
  const [checked, setChecked] = useState(false)
  return (
    <SwitchField
      label="Push notifications"
      checked={checked}
      onCheckedChange={(next) => {
        setChecked(next)
        onCheckedChange(next)
      }}
    />
  )
}

describe('SwitchField', () => {
  it('exposes the control as a switch named by its label', () => {
    renderThemed(<SwitchField label="Push notifications" />)

    expect(screen.getByRole('switch', { name: 'Push notifications' })).toBe(
      screen.getByLabelText('Push notifications'),
    )
  })

  it('keeps the label accessible while hiding it with showLabel={false}', () => {
    renderThemed(<SwitchField label="Push notifications" showLabel={false} />)

    expect(screen.getByRole('switch', { name: 'Push notifications' })).toBeInTheDocument()
    expect(screen.queryByText('Push notifications')).not.toBeInTheDocument()
  })

  it('starts off by default', () => {
    renderThemed(<SwitchField label="Push notifications" />)

    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  it('starts on when defaultChecked is set', () => {
    renderThemed(<SwitchField label="Push notifications" defaultChecked />)

    expect(screen.getByRole('switch')).toBeChecked()
  })

  describe('toggling', () => {
    it('reports the new state through onCheckedChange', async () => {
      const onCheckedChange = vi.fn()
      const { user } = renderThemed(
        <SwitchField label="Push notifications" onCheckedChange={onCheckedChange} />,
      )

      await user.click(screen.getByRole('switch'))

      expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true)
    })

    it('also calls the native onChange', async () => {
      const onChange = vi.fn()
      const { user } = renderThemed(<SwitchField label="Push notifications" onChange={onChange} />)

      await user.click(screen.getByRole('switch'))

      expect(onChange).toHaveBeenCalledOnce()
    })

    it('toggles back off on a second click when uncontrolled', async () => {
      const { user } = renderThemed(<SwitchField label="Push notifications" />)

      const control = screen.getByRole('switch')
      await user.click(control)
      await user.click(control)

      expect(control).not.toBeChecked()
    })

    it('toggles with the space key', async () => {
      const { user } = renderThemed(<SwitchField label="Push notifications" />)

      await user.tab()
      await user.keyboard(' ')

      expect(screen.getByRole('switch')).toBeChecked()
    })

    it('never moves a controlled switch the owner does not change', async () => {
      const onCheckedChange = vi.fn()
      const { user } = renderThemed(
        <SwitchField
          label="Push notifications"
          checked={false}
          onCheckedChange={onCheckedChange}
        />,
      )

      await user.click(screen.getByRole('switch'))

      expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true)
      expect(screen.getByRole('switch')).not.toBeChecked()
    })

    it('follows a controlled switch the owner does change', async () => {
      const onCheckedChange = vi.fn()
      const { user } = renderThemed(<ControlledSwitch onCheckedChange={onCheckedChange} />)

      const control = screen.getByRole('switch')
      await user.click(control)

      expect(control).toBeChecked()
      expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true)
    })
  })

  describe('native attributes', () => {
    it('forwards the attributes a form needs to the input', () => {
      renderThemed(<SwitchField label="Push notifications" name="push" value="on" required />)

      const control = screen.getByRole('switch')
      expect(control).toHaveAttribute('type', 'checkbox')
      expect(control).toHaveAttribute('name', 'push')
      expect(control).toHaveAttribute('value', 'on')
      expect(control).toBeRequired()
    })

    it('disables the switch and ignores clicks', async () => {
      const onCheckedChange = vi.fn()
      const { user } = renderThemed(
        <SwitchField label="Push notifications" disabled onCheckedChange={onCheckedChange} />,
      )

      const control = screen.getByRole('switch')
      expect(control).toBeDisabled()

      await user.click(control)
      expect(onCheckedChange).not.toHaveBeenCalled()
    })

    it('honours an id override', () => {
      renderThemed(<SwitchField label="Push notifications" id="push" />)

      expect(screen.getByRole('switch')).toHaveAttribute('id', 'push')
    })
  })

  describe('description and validation', () => {
    it('describes the switch with its description', () => {
      renderThemed(
        <SwitchField label="Push notifications" description="Weekly savings summary" />,
      )

      expect(screen.getByRole('switch')).toHaveAccessibleDescription('Weekly savings summary')
    })

    it('is valid by default', () => {
      renderThemed(<SwitchField label="Push notifications" />)

      expect(screen.getByRole('switch')).not.toHaveAttribute('aria-invalid')
    })

    it.each([
      ['error', { error: true }],
      ['invalid', { invalid: true }],
    ])('marks the switch invalid when %s is set', (_name, props) => {
      renderThemed(<SwitchField label="Push notifications" {...props} />)

      expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true')
    })

    it('uses a string error as both the invalid flag and the message', () => {
      renderThemed(<SwitchField label="Push notifications" error="Turn this on to continue" />)

      const control = screen.getByRole('switch')
      expect(control).toHaveAttribute('aria-invalid', 'true')
      expect(control).toHaveAccessibleDescription('Turn this on to continue')
    })
  })

  it('forwards a ref to the input element', () => {
    const ref = createRef<HTMLInputElement>()
    renderThemed(<SwitchField label="Push notifications" ref={ref} />)

    expect(ref.current).toBe(screen.getByRole('switch'))
  })
})
