import type { ChangeEvent, Ref, TextareaHTMLAttributes } from 'react'
import { classNames } from '../utils/classNames'
import { useControllableState } from '../utils/useControllableState'
import { useFieldId } from '../utils/useFieldId'

type NativeTextareaAttributes = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'defaultValue' | 'children'
>

export type TextareaProps = {
  label: string
  value?: string
  defaultValue?: string
  description?: string
  showLabel?: boolean
  onValueChange?: (value: string) => void
  /** `true` marks the field invalid; a string is also used as the message. */
  error?: boolean | string
  errorMessage?: string
  invalid?: boolean
  ref?: Ref<HTMLTextAreaElement>
} & NativeTextareaAttributes

export function Textarea({
  label,
  value,
  defaultValue = '',
  description,
  showLabel = true,
  onValueChange,
  error,
  errorMessage,
  invalid,
  onChange,
  className,
  id: idOverride,
  disabled,
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ref,
  ...rest
}: TextareaProps) {
  const id = useFieldId('textarea', idOverride)
  const { currentValue, setValue } = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })

  const messageText = typeof error === 'string' && error ? error : errorMessage
  const hasError = Boolean(invalid) || error === true || Boolean(messageText)
  const labelId = `${id}-label`
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`
  const describedBy =
    classNames(description && descriptionId, messageText && errorId, ariaDescribedBy) || undefined

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value)
    onChange?.(event)
  }

  return (
    <label className={classNames('textarea-field', className)} htmlFor={id}>
      {showLabel ? (
        <span className="input-label" id={labelId}>
          {label}
        </span>
      ) : null}
      <textarea
        {...rest}
        id={id}
        ref={ref}
        disabled={disabled}
        value={currentValue}
        className={classNames('textarea-input', hasError && 'textarea-input-error')}
        aria-labelledby={ariaLabelledBy ?? (showLabel && !ariaLabel ? labelId : undefined)}
        aria-label={ariaLabel ?? (showLabel ? undefined : label)}
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        onChange={handleChange}
      />
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
