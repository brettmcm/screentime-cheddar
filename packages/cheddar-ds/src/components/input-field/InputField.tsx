import type {
  ChangeEvent,
  InputHTMLAttributes,
  Ref,
  SelectHTMLAttributes,
} from 'react'
import { Icon } from '../icon/Icon'
import { classNames } from '../utils/classNames'
import { useControllableState } from '../utils/useControllableState'
import { useFieldId } from '../utils/useFieldId'

const defaultDropdownOptions = ['Value', 'Checking', 'Savings', 'Travel fund']

type NativeFieldAttributes = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'size' | 'children'
>

export type InputFieldProps = {
  label: string
  value?: string
  defaultValue?: string
  description?: string
  /** Renders a native `<select>` instead of an `<input>`. */
  dropdown?: boolean
  options?: string[]
  showLabel?: boolean
  onValueChange?: (value: string) => void
  /** `true` marks the field invalid; a string is also used as the message. */
  error?: boolean | string
  errorMessage?: string
  invalid?: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  ref?: Ref<HTMLInputElement>
} & NativeFieldAttributes

export function InputField({
  label,
  value,
  defaultValue = '',
  description,
  dropdown = false,
  options = defaultDropdownOptions,
  showLabel = true,
  onValueChange,
  error,
  errorMessage,
  invalid,
  onChange,
  className,
  id: idOverride,
  disabled,
  readOnly,
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ref,
  ...rest
}: InputFieldProps) {
  const id = useFieldId('input', idOverride)
  const { currentValue, setValue } = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const valueClass = currentValue ? 'input-value' : 'input-placeholder'
  const selectOptions = options.includes(currentValue) ? options : [currentValue, ...options]

  const messageText = typeof error === 'string' && error ? error : errorMessage
  const hasError = Boolean(invalid) || error === true || Boolean(messageText)
  const labelId = `${id}-label`
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`
  const describedBy =
    classNames(description && descriptionId, messageText && errorId, ariaDescribedBy) || undefined

  const controlProps = {
    id,
    value: currentValue,
    disabled,
    'aria-labelledby': ariaLabelledBy ?? (showLabel && !ariaLabel ? labelId : undefined),
    'aria-label': ariaLabel ?? (showLabel ? undefined : label),
    'aria-describedby': describedBy,
    'aria-invalid': hasError || undefined,
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValue(event.target.value)
    onChange?.(event)
  }

  return (
    <label className={classNames('input-field', className)} htmlFor={id}>
      {showLabel ? (
        <span className="input-label" id={labelId}>
          {label}
        </span>
      ) : null}
      <span
        className={classNames(
          'input-shell',
          hasError && 'input-shell-error',
          disabled && 'input-shell-disabled',
        )}
      >
        {dropdown ? (
          <select
            {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
            {...controlProps}
            ref={ref as Ref<HTMLSelectElement> | undefined}
            className={valueClass}
            onChange={handleChange}
          >
            {selectOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...rest}
            {...controlProps}
            ref={ref}
            readOnly={readOnly}
            className={valueClass}
            onChange={handleChange}
          />
        )}
        {dropdown ? <Icon name="caret-down" width={16} className="input-icon" /> : null}
      </span>
      {description ? (
        <span className="input-description" id={descriptionId}>
          {description}
        </span>
      ) : null}
      {messageText ? (
        <span className="input-error-message" id={errorId}>
          {messageText}
        </span>
      ) : null}
    </label>
  )
}
