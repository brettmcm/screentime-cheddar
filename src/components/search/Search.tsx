import type { ChangeEvent, InputHTMLAttributes, Ref } from 'react'
import { Icon } from '../icon/Icon'
import { classNames } from '../utils/classNames'
import { useControllableState } from '../utils/useControllableState'
import { useFieldId } from '../utils/useFieldId'

type NativeSearchAttributes = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'size' | 'children'
>

export type SearchProps = {
  value?: string
  defaultValue?: string
  placeholder?: string
  /** Accessible name for the input. */
  label?: string
  description?: string
  onValueChange?: (value: string) => void
  /** `true` marks the field invalid; a string is also used as the message. */
  error?: boolean | string
  errorMessage?: string
  invalid?: boolean
  ref?: Ref<HTMLInputElement>
} & NativeSearchAttributes

export function Search({
  value,
  defaultValue = '',
  placeholder = 'Search anything',
  label = 'Search',
  description,
  onValueChange,
  error,
  errorMessage,
  invalid,
  onChange,
  className,
  id: idOverride,
  type = 'search',
  disabled,
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  ref,
  ...rest
}: SearchProps) {
  const id = useFieldId('search', idOverride)
  const { currentValue, setValue } = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })

  const messageText = typeof error === 'string' && error ? error : errorMessage
  const hasError = Boolean(invalid) || error === true || Boolean(messageText)
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`
  const describedBy =
    classNames(description && descriptionId, messageText && errorId, ariaDescribedBy) || undefined

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
    onChange?.(event)
  }

  const field = (
    <div
      className={classNames(
        'search-field',
        hasError && 'search-field-error',
        disabled && 'search-field-disabled',
        className,
      )}
      role="search"
    >
      <Icon
        name="search"
        width={16}
        height={16}
        className="search-icon"
        aria-hidden="true"
      />
      <input
        {...rest}
        id={id}
        ref={ref}
        type={type}
        disabled={disabled}
        value={currentValue}
        placeholder={placeholder}
        aria-label={ariaLabel ?? label}
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        className={classNames('search-input', !currentValue && 'search-placeholder')}
        onChange={handleChange}
      />
    </div>
  )

  if (!description && !messageText) {
    return field
  }

  return (
    <div className="search-field-group">
      {field}
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
    </div>
  )
}
