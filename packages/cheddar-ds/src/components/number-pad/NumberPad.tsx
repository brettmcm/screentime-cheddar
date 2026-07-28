import type { HTMLAttributes, KeyboardEvent } from 'react'
import { classNames } from '../utils/classNames'
import { useControllableState } from '../utils/useControllableState'
import { Icon } from '../icon/Icon'

const BACKSPACE = 'Backspace'
const DECIMAL = '.'

const DIGIT_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

type InputRules = {
  allowDecimal: boolean
  decimalPlaces: number
  maxLength: number | undefined
}

/** Returns the value `key` produces, or `current` unchanged when the rules reject it. */
function applyKey(current: string, key: string, { allowDecimal, decimalPlaces, maxLength }: InputRules) {
  if (key === BACKSPACE) return current.slice(0, -1)

  const withinMaxLength = (next: string) =>
    maxLength === undefined || next.length <= maxLength ? next : current

  if (key === DECIMAL) {
    if (!allowDecimal || current.includes(DECIMAL)) return current
    // A value may not start with the separator.
    return withinMaxLength(current === '' ? '0.' : `${current}.`)
  }

  const [, decimals] = current.split(DECIMAL)
  if (decimals !== undefined && decimals.length >= decimalPlaces) return current

  // A leading zero is only meaningful in front of the separator.
  const base = current === '0' ? '' : current
  return withinMaxLength(base + key)
}

export type NumberPadProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /**
   * Fires on every key press, including presses the input rules then reject. Digits and
   * `'.'` come through as typed; the backspace key reports `'Backspace'`.
   */
  onKeyPress?: (key: string) => void
  allowDecimal?: boolean
  decimalPlaces?: number
  maxLength?: number
  disabled?: boolean
  backspaceLabel?: string
  decimalLabel?: string
  className?: string
  label?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'onKeyPress' | 'defaultValue'>

export function NumberPad({
  value,
  defaultValue,
  onValueChange,
  onKeyPress,
  allowDecimal = true,
  decimalPlaces = 2,
  maxLength,
  disabled = false,
  backspaceLabel = 'Delete',
  decimalLabel = 'Decimal point',
  className,
  label = 'Number pad',
  ...rest
}: NumberPadProps) {
  const { currentValue, setValue } = useControllableState({
    value,
    defaultValue: defaultValue ?? '',
    onChange: onValueChange,
  })

  const press = (key: string) => {
    if (disabled) return
    const next = applyKey(currentValue, key, { allowDecimal, decimalPlaces, maxLength })
    onKeyPress?.(key)
    if (next !== currentValue) setValue(next)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    const { key } = event

    if (key === BACKSPACE) {
      event.preventDefault()
      press(BACKSPACE)
      return
    }
    if (key === DECIMAL && allowDecimal) {
      event.preventDefault()
      press(DECIMAL)
      return
    }
    if (key.length === 1 && key >= '0' && key <= '9') {
      event.preventDefault()
      press(key)
    }
  }

  const renderDigit = (digit: string) => (
    <button
      key={digit}
      type="button"
      className="number-pad-key"
      disabled={disabled}
      onClick={() => press(digit)}
    >
      {digit}
    </button>
  )

  return (
    <div
      {...rest}
      className={classNames('number-pad', className)}
      role="group"
      aria-label={label}
      onKeyDown={handleKeyDown}
    >
      {DIGIT_KEYS.map(renderDigit)}
      <button
        type="button"
        className="number-pad-key number-pad-key-decimal"
        disabled={disabled || !allowDecimal}
        aria-label={decimalLabel}
        onClick={() => press(DECIMAL)}
      >
        {DECIMAL}
      </button>
      {renderDigit('0')}
      <button
        type="button"
        className="number-pad-key number-pad-key-backspace"
        disabled={disabled}
        aria-label={backspaceLabel}
        onClick={() => press(BACKSPACE)}
      >
        <Icon name="caret-left" width={24} height={24} />
        <span className="sr-only">{backspaceLabel}</span>
      </button>
    </div>
  )
}
