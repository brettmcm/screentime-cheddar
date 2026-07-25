import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { NumberPad } from './NumberPad'

/** DOM order of the twelve keys: 1-9, the separator, 0, then backspace. */
const KEY_NAMES = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'Decimal point',
  '0',
  'Delete',
]

describe('NumberPad accessibility', () => {
  it('exposes a labelled group of twelve named keys', async () => {
    const { container, getByRole, getAllByRole } = renderThemed(<NumberPad />)

    expect(getByRole('group', { name: 'Number pad' })).toBeInTheDocument()
    expect(getAllByRole('button').map((key) => key.textContent?.trim())).toHaveLength(12)
    for (const name of KEY_NAMES) {
      expect(getByRole('button', { name })).toBeInTheDocument()
    }
    await expect(container).toHaveNoAxeViolations()
  })

  it('uses a custom group label and custom key labels', async () => {
    const { container, getByRole } = renderThemed(
      <NumberPad label="Amount keypad" decimalLabel="Point" backspaceLabel="Backspace" />,
    )

    expect(getByRole('group', { name: 'Amount keypad' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Point' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Backspace' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('disables the separator when decimals are not allowed', async () => {
    const { container, getByRole } = renderThemed(<NumberPad allowDecimal={false} />)

    expect(getByRole('button', { name: 'Decimal point' })).toBeDisabled()
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations when the whole pad is disabled', async () => {
    const { container, getAllByRole } = renderThemed(<NumberPad disabled />)

    for (const key of getAllByRole('button')) {
      expect(key).toBeDisabled()
    }
    await expect(container).toHaveNoAxeViolations()
  })

  it('reaches every key by Tab in reading order with no positive tabIndex', async () => {
    const { container, getByRole, user } = renderThemed(<NumberPad />)

    for (const name of KEY_NAMES) {
      await user.tab()
      expect(getByRole('button', { name })).toHaveFocus()
    }

    expect(
      [...container.querySelectorAll<HTMLElement>('[tabindex]')].filter((el) => el.tabIndex > 0),
    ).toHaveLength(0)
  })

  it('accepts typed digits while a key inside the group has focus', async () => {
    const values: string[] = []
    const { user } = renderThemed(<NumberPad onValueChange={(value) => values.push(value)} />)

    await user.tab()
    await user.keyboard('42')

    expect(values).toEqual(['4', '42'])
  })
})
