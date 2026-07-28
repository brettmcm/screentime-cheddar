import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { Search } from './Search'

function ControlledSearch({ onValueChange }: { onValueChange: (value: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <Search
      value={value}
      onValueChange={(next) => {
        setValue(next)
        onValueChange(next)
      }}
    />
  )
}

describe('Search', () => {
  describe('labelling', () => {
    it('names the input Search by default', () => {
      renderThemed(<Search />)

      expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument()
    })

    it('renames the input with label', () => {
      renderThemed(<Search label="Find a goal" />)

      expect(screen.getByLabelText('Find a goal')).toBeInTheDocument()
    })

    it('lets an explicit aria-label win over label', () => {
      renderThemed(<Search label="Find a goal" aria-label="Search goals" />)

      expect(screen.getByLabelText('Search goals')).toBeInTheDocument()
    })

    it('shows the default placeholder', () => {
      renderThemed(<Search />)

      expect(screen.getByRole('searchbox')).toHaveAttribute('placeholder', 'Search anything')
    })

    it('describes the input with its description', () => {
      renderThemed(<Search description="Goals, accounts and articles" />)

      expect(screen.getByRole('searchbox')).toHaveAccessibleDescription(
        'Goals, accounts and articles',
      )
    })
  })

  describe('typing', () => {
    it('reports every keystroke through onValueChange', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<Search onValueChange={onValueChange} />)

      await user.type(screen.getByRole('searchbox'), 'car')

      expect(onValueChange).toHaveBeenCalledTimes(3)
      expect(onValueChange).toHaveBeenLastCalledWith('car')
    })

    it('also calls the native onChange', async () => {
      const onChange = vi.fn()
      const { user } = renderThemed(<Search onChange={onChange} />)

      await user.type(screen.getByRole('searchbox'), 'c')

      expect(onChange).toHaveBeenCalledOnce()
    })

    it('keeps an uncontrolled value between keystrokes', async () => {
      const { user } = renderThemed(<Search defaultValue="ca" />)

      const input = screen.getByRole('searchbox')
      await user.type(input, 'r')

      expect(input).toHaveValue('car')
    })

    it('never moves a controlled value the owner does not change', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<Search value="fixed" onValueChange={onValueChange} />)

      await user.type(screen.getByRole('searchbox'), 'a')

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('fixeda')
      expect(screen.getByRole('searchbox')).toHaveValue('fixed')
    })

    it('follows a controlled value the owner does change', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<ControlledSearch onValueChange={onValueChange} />)

      const input = screen.getByRole('searchbox')
      await user.type(input, 'car')

      expect(input).toHaveValue('car')
      expect(onValueChange).toHaveBeenLastCalledWith('car')
    })

    it('clears back to empty', async () => {
      const { user } = renderThemed(<Search defaultValue="car" />)

      const input = screen.getByRole('searchbox')
      await user.clear(input)

      expect(input).toHaveValue('')
    })
  })

  describe('native attributes', () => {
    it('renders as a search input by default', () => {
      renderThemed(<Search />)

      expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search')
    })

    it('honours a type override', () => {
      renderThemed(<Search type="text" />)

      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
    })

    it('forwards the attributes a form needs to the input', () => {
      renderThemed(<Search name="q" autoComplete="off" required placeholder="Find anything" />)

      const input = screen.getByRole('searchbox')
      expect(input).toHaveAttribute('name', 'q')
      expect(input).toHaveAttribute('autocomplete', 'off')
      expect(input).toBeRequired()
      expect(input).toHaveAttribute('placeholder', 'Find anything')
    })

    it('disables the input and ignores typing', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<Search disabled onValueChange={onValueChange} />)

      const input = screen.getByRole('searchbox')
      expect(input).toBeDisabled()

      await user.type(input, 'car')
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('honours an id override', () => {
      renderThemed(<Search id="site-search" />)

      expect(screen.getByRole('searchbox')).toHaveAttribute('id', 'site-search')
    })
  })

  describe('validation', () => {
    it('is valid by default', () => {
      renderThemed(<Search />)

      expect(screen.getByRole('searchbox')).not.toHaveAttribute('aria-invalid')
    })

    it.each([
      ['error', { error: true }],
      ['invalid', { invalid: true }],
    ])('marks the input invalid when %s is set', (_name, props) => {
      renderThemed(<Search {...props} />)

      expect(screen.getByRole('searchbox')).toHaveAttribute('aria-invalid', 'true')
    })

    it('uses a string error as both the invalid flag and the message', () => {
      renderThemed(<Search error="No matches" />)

      const input = screen.getByRole('searchbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAccessibleDescription('No matches')
    })

    it('describes the input with both the description and the error', () => {
      renderThemed(<Search description="Goals and accounts" errorMessage="No matches" />)

      expect(screen.getByRole('searchbox')).toHaveAccessibleDescription(
        'Goals and accounts No matches',
      )
    })
  })

  it('forwards a ref to the input element', () => {
    const ref = createRef<HTMLInputElement>()
    renderThemed(<Search ref={ref} />)

    expect(ref.current).toBe(screen.getByRole('searchbox'))
  })
})
