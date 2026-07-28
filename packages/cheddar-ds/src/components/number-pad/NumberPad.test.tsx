import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { NumberPad } from './NumberPad'

function key(name: string) {
  return screen.getByRole('button', { name })
}

async function press(user: ReturnType<typeof renderThemed>['user'], ...names: string[]) {
  for (const name of names) {
    await user.click(key(name))
  }
}

function ControlledPad({ onValueChange }: { onValueChange: (value: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <NumberPad
      value={value}
      onValueChange={(next) => {
        setValue(next)
        onValueChange(next)
      }}
    />
  )
}

describe('NumberPad', () => {
  it('exposes the keys as a named group', () => {
    renderThemed(<NumberPad />)

    expect(screen.getByRole('group', { name: 'Number pad' })).toBeInTheDocument()
  })

  it('renames the group with label', () => {
    renderThemed(<NumberPad label="Amount keypad" />)

    expect(screen.getByRole('group', { name: 'Amount keypad' })).toBeInTheDocument()
  })

  it('renders ten digits plus the decimal and backspace keys', () => {
    renderThemed(<NumberPad />)

    expect(screen.getAllByRole('button')).toHaveLength(12)
    expect(key('Decimal point')).toBeInTheDocument()
    expect(key('Delete')).toBeInTheDocument()
  })

  describe('digit entry', () => {
    it('appends each digit pressed', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<NumberPad onValueChange={onValueChange} />)

      await press(user, '4', '2')

      expect(onValueChange).toHaveBeenNthCalledWith(1, '4')
      expect(onValueChange).toHaveBeenNthCalledWith(2, '42')
    })

    it('replaces a lone leading zero', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<NumberPad onValueChange={onValueChange} />)

      await press(user, '0', '5')

      expect(onValueChange).toHaveBeenLastCalledWith('5')
    })

    it('keeps a zero that sits after the decimal separator', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<NumberPad onValueChange={onValueChange} />)

      await press(user, '0', 'Decimal point', '0')

      expect(onValueChange).toHaveBeenLastCalledWith('0.0')
    })

    it('starts from defaultValue', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<NumberPad defaultValue="12" onValueChange={onValueChange} />)

      await press(user, '3')

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('123')
    })
  })

  describe('decimal entry', () => {
    it('starts a bare separator with a leading zero', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<NumberPad onValueChange={onValueChange} />)

      await press(user, 'Decimal point')

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('0.')
    })

    it('appends the separator to an existing value', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<NumberPad onValueChange={onValueChange} />)

      await press(user, '4', 'Decimal point', '5')

      expect(onValueChange).toHaveBeenLastCalledWith('4.5')
    })

    it('refuses a second separator', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<NumberPad defaultValue="4.5" onValueChange={onValueChange} />)

      await press(user, 'Decimal point')

      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('stops at two decimal places by default', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<NumberPad defaultValue="4.56" onValueChange={onValueChange} />)

      await press(user, '7')

      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('honours a custom decimalPlaces', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(
        <NumberPad defaultValue="4.5" decimalPlaces={1} onValueChange={onValueChange} />,
      )

      await press(user, '6')

      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('disables the separator key when allowDecimal is false', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<NumberPad allowDecimal={false} onValueChange={onValueChange} />)

      expect(key('Decimal point')).toBeDisabled()

      await press(user, '4')
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('4')
    })
  })

  describe('backspace', () => {
    it('removes the last character', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<NumberPad defaultValue="123" onValueChange={onValueChange} />)

      await press(user, 'Delete')

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('12')
    })

    it('does nothing on an empty value', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<NumberPad onValueChange={onValueChange} />)

      await press(user, 'Delete')

      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('renames the key with backspaceLabel', () => {
      renderThemed(<NumberPad backspaceLabel="Backspace" />)

      expect(screen.getByRole('button', { name: 'Backspace' })).toBeInTheDocument()
    })

    it('renames the separator key with decimalLabel', () => {
      renderThemed(<NumberPad decimalLabel="Point" />)

      expect(screen.getByRole('button', { name: 'Point' })).toBeInTheDocument()
    })
  })

  describe('maxLength', () => {
    it('refuses digits past the limit', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(
        <NumberPad defaultValue="123" maxLength={3} onValueChange={onValueChange} />,
      )

      await press(user, '4')

      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('counts the separator against the limit', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(
        <NumberPad defaultValue="123" maxLength={4} onValueChange={onValueChange} />,
      )

      await press(user, 'Decimal point')
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('123.')

      await press(user, '5')
      expect(onValueChange).toHaveBeenCalledOnce()
    })

    it('still allows backspace at the limit', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(
        <NumberPad defaultValue="123" maxLength={3} onValueChange={onValueChange} />,
      )

      await press(user, 'Delete')

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('12')
    })
  })

  describe('onKeyPress', () => {
    it('reports each key as it is pressed', async () => {
      const onKeyPress = vi.fn()
      const { user } = renderThemed(<NumberPad onKeyPress={onKeyPress} />)

      await press(user, '7', 'Decimal point', 'Delete')

      expect(onKeyPress.mock.calls.map(([pressed]) => pressed)).toEqual(['7', '.', 'Backspace'])
    })

    it('reports keys the input rules then reject', async () => {
      const onKeyPress = vi.fn()
      const onValueChange = vi.fn()
      const { user } = renderThemed(
        <NumberPad defaultValue="4.56" onKeyPress={onKeyPress} onValueChange={onValueChange} />,
      )

      await press(user, '7')

      expect(onKeyPress).toHaveBeenCalledExactlyOnceWith('7')
      expect(onValueChange).not.toHaveBeenCalled()
    })
  })

  describe('physical keyboard', () => {
    it('accepts typed digits', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<NumberPad onValueChange={onValueChange} />)

      key('1').focus()
      await user.keyboard('42')

      expect(onValueChange).toHaveBeenLastCalledWith('42')
    })

    it('accepts the typed separator', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<NumberPad defaultValue="4" onValueChange={onValueChange} />)

      key('1').focus()
      await user.keyboard('.5')

      expect(onValueChange).toHaveBeenLastCalledWith('4.5')
    })

    it('accepts the Backspace key', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<NumberPad defaultValue="42" onValueChange={onValueChange} />)

      key('1').focus()
      await user.keyboard('{Backspace}')

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('4')
    })

    it('ignores keys that are not part of the pad', async () => {
      const onKeyPress = vi.fn()
      const { user } = renderThemed(<NumberPad onKeyPress={onKeyPress} />)

      key('1').focus()
      await user.keyboard('a{ArrowLeft}')

      expect(onKeyPress).not.toHaveBeenCalled()
    })

    it('ignores the typed separator when allowDecimal is false', async () => {
      const onKeyPress = vi.fn()
      const { user } = renderThemed(<NumberPad allowDecimal={false} onKeyPress={onKeyPress} />)

      key('1').focus()
      await user.keyboard('.')

      expect(onKeyPress).not.toHaveBeenCalled()
    })
  })

  describe('controlled value', () => {
    it('never moves a controlled value the owner does not change', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<NumberPad value="7" onValueChange={onValueChange} />)

      await press(user, '8', '9')

      expect(onValueChange).toHaveBeenNthCalledWith(1, '78')
      expect(onValueChange).toHaveBeenNthCalledWith(2, '79')
    })

    it('follows a controlled value the owner does change', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<ControlledPad onValueChange={onValueChange} />)

      await press(user, '7', '8')

      expect(onValueChange).toHaveBeenLastCalledWith('78')
    })
  })

  describe('disabled', () => {
    it('disables every key', () => {
      renderThemed(<NumberPad disabled />)

      for (const button of screen.getAllByRole('button')) {
        expect(button).toBeDisabled()
      }
    })

    it('ignores clicks', async () => {
      const onValueChange = vi.fn()
      const onKeyPress = vi.fn()
      const { user } = renderThemed(
        <NumberPad disabled onValueChange={onValueChange} onKeyPress={onKeyPress} />,
      )

      await press(user, '4')

      expect(onValueChange).not.toHaveBeenCalled()
      expect(onKeyPress).not.toHaveBeenCalled()
    })

    it('ignores the physical keyboard', async () => {
      const onKeyPress = vi.fn()
      const { user } = renderThemed(<NumberPad disabled onKeyPress={onKeyPress} />)

      screen.getByRole('group').focus()
      await user.keyboard('4')

      expect(onKeyPress).not.toHaveBeenCalled()
    })
  })

  it('keeps its own class alongside a caller class', () => {
    renderThemed(<NumberPad className="amount-pad" />)

    expect(screen.getByRole('group')).toHaveClass('number-pad', 'amount-pad')
  })
})
