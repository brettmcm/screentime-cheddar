import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { Textarea } from './Textarea'

function ControlledTextarea({ onValueChange }: { onValueChange: (value: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <Textarea
      label="Note"
      value={value}
      onValueChange={(next) => {
        setValue(next)
        onValueChange(next)
      }}
    />
  )
}

describe('Textarea', () => {
  describe('labelling', () => {
    it('associates the visible label with the textarea', () => {
      renderThemed(<Textarea label="Note" />)

      expect(screen.getByLabelText('Note')).toBe(screen.getByRole('textbox'))
    })

    it('keeps the label accessible while hiding it with showLabel={false}', () => {
      renderThemed(<Textarea label="Note" showLabel={false} />)

      expect(screen.getByLabelText('Note')).toBeInTheDocument()
      expect(screen.queryByText('Note')).not.toBeInTheDocument()
    })

    it('describes the textarea with its description', () => {
      renderThemed(<Textarea label="Note" description="Up to 200 characters" />)

      expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Up to 200 characters')
    })
  })

  describe('typing', () => {
    it('reports every keystroke through onValueChange', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<Textarea label="Note" onValueChange={onValueChange} />)

      await user.type(screen.getByLabelText('Note'), 'Hi')

      expect(onValueChange).toHaveBeenCalledTimes(2)
      expect(onValueChange).toHaveBeenLastCalledWith('Hi')
    })

    it('also calls the native onChange', async () => {
      const onChange = vi.fn()
      const { user } = renderThemed(<Textarea label="Note" onChange={onChange} />)

      await user.type(screen.getByLabelText('Note'), 'H')

      expect(onChange).toHaveBeenCalledOnce()
    })

    it('keeps an uncontrolled value between keystrokes', async () => {
      const { user } = renderThemed(<Textarea label="Note" defaultValue="Sav" />)

      const textarea = screen.getByLabelText('Note')
      await user.type(textarea, 'e')

      expect(textarea).toHaveValue('Save')
    })

    it('accepts newlines', async () => {
      const { user } = renderThemed(<Textarea label="Note" />)

      const textarea = screen.getByLabelText('Note')
      await user.type(textarea, 'one{Enter}two')

      expect(textarea).toHaveValue('one\ntwo')
    })

    it('never moves a controlled value the owner does not change', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(
        <Textarea label="Note" value="fixed" onValueChange={onValueChange} />,
      )

      await user.type(screen.getByLabelText('Note'), 'a')

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('fixeda')
      expect(screen.getByLabelText('Note')).toHaveValue('fixed')
    })

    it('follows a controlled value the owner does change', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<ControlledTextarea onValueChange={onValueChange} />)

      const textarea = screen.getByLabelText('Note')
      await user.type(textarea, 'Hi')

      expect(textarea).toHaveValue('Hi')
      expect(onValueChange).toHaveBeenLastCalledWith('Hi')
    })
  })

  describe('native attributes', () => {
    it('forwards the attributes a form needs to the textarea', () => {
      renderThemed(
        <Textarea label="Note" name="note" placeholder="Add a note" required rows={6} maxLength={200} />,
      )

      const textarea = screen.getByLabelText('Note')
      expect(textarea).toHaveAttribute('name', 'note')
      expect(textarea).toHaveAttribute('placeholder', 'Add a note')
      expect(textarea).toBeRequired()
      expect(textarea).toHaveAttribute('rows', '6')
      expect(textarea).toHaveAttribute('maxlength', '200')
    })

    it('disables the textarea and ignores typing', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<Textarea label="Note" disabled onValueChange={onValueChange} />)

      const textarea = screen.getByLabelText('Note')
      expect(textarea).toBeDisabled()

      await user.type(textarea, 'Hi')
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('honours an id override', () => {
      renderThemed(<Textarea label="Note" id="note" />)

      expect(screen.getByLabelText('Note')).toHaveAttribute('id', 'note')
    })
  })

  describe('validation', () => {
    it('is valid by default', () => {
      renderThemed(<Textarea label="Note" />)

      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
    })

    it.each([
      ['error', { error: true }],
      ['invalid', { invalid: true }],
    ])('marks the textarea invalid when %s is set', (_name, props) => {
      renderThemed(<Textarea label="Note" {...props} />)

      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('uses a string error as both the invalid flag and the message', () => {
      renderThemed(<Textarea label="Note" error="Too long" />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-invalid', 'true')
      expect(textarea).toHaveAccessibleDescription('Too long')
    })

    it('describes the textarea with both the description and the error', () => {
      renderThemed(<Textarea label="Note" description="Optional" errorMessage="Too long" />)

      expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Optional Too long')
    })
  })

  it('forwards a ref to the textarea element', () => {
    const ref = createRef<HTMLTextAreaElement>()
    renderThemed(<Textarea label="Note" ref={ref} />)

    expect(ref.current).toBe(screen.getByRole('textbox'))
  })
})
