import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { InputField } from './InputField'

function ControlledInput({ onValueChange }: { onValueChange: (value: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <InputField
      label="Nickname"
      value={value}
      onValueChange={(next) => {
        setValue(next)
        onValueChange(next)
      }}
    />
  )
}

describe('InputField', () => {
  describe('labelling', () => {
    it('associates the visible label with the input', () => {
      renderThemed(<InputField label="Nickname" />)

      expect(screen.getByLabelText('Nickname')).toBe(screen.getByRole('textbox'))
    })

    it('keeps the label accessible while hiding it with showLabel={false}', () => {
      renderThemed(<InputField label="Nickname" showLabel={false} />)

      expect(screen.getByLabelText('Nickname')).toBeInTheDocument()
      expect(screen.queryByText('Nickname')).not.toBeInTheDocument()
    })

    it('lets an explicit aria-label win over the visible label', () => {
      renderThemed(<InputField label="Nickname" aria-label="Account nickname" />)

      expect(screen.getByLabelText('Account nickname')).toBeInTheDocument()
    })

    it('describes the input with its description', () => {
      renderThemed(<InputField label="Nickname" description="Shown to your friends" />)

      expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Shown to your friends')
    })
  })

  describe('typing', () => {
    it('reports every keystroke through onValueChange', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<InputField label="Nickname" onValueChange={onValueChange} />)

      await user.type(screen.getByLabelText('Nickname'), 'Ana')

      expect(onValueChange).toHaveBeenCalledTimes(3)
      expect(onValueChange).toHaveBeenLastCalledWith('Ana')
    })

    it('also calls the native onChange with the event', async () => {
      const onChange = vi.fn()
      const { user } = renderThemed(<InputField label="Nickname" onChange={onChange} />)

      await user.type(screen.getByLabelText('Nickname'), 'A')

      expect(onChange).toHaveBeenCalledOnce()
      expect(onChange.mock.calls[0][0].target).toBe(screen.getByLabelText('Nickname'))
    })

    it('keeps an uncontrolled value between keystrokes', async () => {
      const { user } = renderThemed(<InputField label="Nickname" defaultValue="An" />)

      const input = screen.getByLabelText('Nickname')
      await user.type(input, 'a')

      expect(input).toHaveValue('Ana')
    })

    it('never moves a controlled value the owner does not change', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(
        <InputField label="Nickname" value="fixed" onValueChange={onValueChange} />,
      )

      await user.type(screen.getByLabelText('Nickname'), 'a')

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('fixeda')
      expect(screen.getByLabelText('Nickname')).toHaveValue('fixed')
    })

    it('follows a controlled value the owner does change', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<ControlledInput onValueChange={onValueChange} />)

      const input = screen.getByLabelText('Nickname')
      await user.type(input, 'Ana')

      expect(input).toHaveValue('Ana')
      expect(onValueChange).toHaveBeenLastCalledWith('Ana')
    })
  })

  describe('native attributes', () => {
    it('forwards the attributes a form needs to the input', () => {
      renderThemed(
        <InputField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          maxLength={64}
        />,
      )

      const input = screen.getByLabelText('Email')
      expect(input).toHaveAttribute('name', 'email')
      expect(input).toHaveAttribute('type', 'email')
      expect(input).toHaveAttribute('autocomplete', 'email')
      expect(input).toHaveAttribute('placeholder', 'you@example.com')
      expect(input).toBeRequired()
      expect(input).toHaveAttribute('maxlength', '64')
    })

    it('disables the input and ignores typing', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(
        <InputField label="Nickname" disabled onValueChange={onValueChange} />,
      )

      const input = screen.getByLabelText('Nickname')
      expect(input).toBeDisabled()

      await user.type(input, 'Ana')
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('marks the input read only without disabling it', () => {
      renderThemed(<InputField label="Nickname" readOnly />)

      const input = screen.getByLabelText('Nickname')
      expect(input).toHaveAttribute('readonly')
      expect(input).toBeEnabled()
    })

    it('honours an id override', () => {
      renderThemed(<InputField label="Nickname" id="nickname" />)

      expect(screen.getByLabelText('Nickname')).toHaveAttribute('id', 'nickname')
    })
  })

  describe('validation', () => {
    it('is valid by default', () => {
      renderThemed(<InputField label="Nickname" />)

      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
    })

    it('marks the input invalid when error is true', () => {
      renderThemed(<InputField label="Nickname" error />)

      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('marks the input invalid when invalid is set', () => {
      renderThemed(<InputField label="Nickname" invalid />)

      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('uses a string error as both the invalid flag and the message', () => {
      renderThemed(<InputField label="Nickname" error="Pick another one" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAccessibleDescription('Pick another one')
    })

    it('renders errorMessage as the associated message', () => {
      renderThemed(<InputField label="Nickname" errorMessage="Pick another one" />)

      expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Pick another one')
    })

    it('describes the input with both the description and the error', () => {
      renderThemed(
        <InputField label="Nickname" description="Shown to your friends" error="Too short" />,
      )

      expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Shown to your friends Too short')
    })

    it('keeps a caller-supplied aria-describedby', () => {
      renderThemed(
        <>
          <span id="external">External hint</span>
          <InputField label="Nickname" aria-describedby="external" />
        </>,
      )

      expect(screen.getByRole('textbox')).toHaveAccessibleDescription('External hint')
    })
  })

  describe('dropdown mode', () => {
    it('renders a select with the supplied options', () => {
      renderThemed(<InputField label="Account" dropdown options={['Checking', 'Savings']} defaultValue="Checking" />)

      const select = screen.getByLabelText('Account')
      expect(select.tagName).toBe('SELECT')
      expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
        'Checking',
        'Savings',
      ])
    })

    it('reports the chosen option', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(
        <InputField
          label="Account"
          dropdown
          options={['Checking', 'Savings']}
          defaultValue="Checking"
          onValueChange={onValueChange}
        />,
      )

      await user.selectOptions(screen.getByLabelText('Account'), 'Savings')

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('Savings')
      expect(screen.getByLabelText('Account')).toHaveValue('Savings')
    })

    it('keeps a value that is not one of the options selectable', () => {
      renderThemed(
        <InputField label="Account" dropdown options={['Checking']} defaultValue="Travel fund" />,
      )

      expect(screen.getByLabelText('Account')).toHaveValue('Travel fund')
    })
  })

  it('forwards a ref to the input element', () => {
    const ref = createRef<HTMLInputElement>()
    renderThemed(<InputField label="Nickname" ref={ref} />)

    expect(ref.current).toBe(screen.getByRole('textbox'))
  })
})
