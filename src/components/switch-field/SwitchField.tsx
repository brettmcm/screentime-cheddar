import type { ChangeEvent, InputHTMLAttributes, Ref } from 'react'
import { classNames } from '../utils/classNames'
import { useControllableState } from '../utils/useControllableState'
import { useFieldId } from '../utils/useFieldId'

type NativeSwitchAttributes = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'checked' | 'defaultChecked' | 'size' | 'type' | 'children'
>

export type SwitchFieldProps = {
  label: string
  description?: string
  checked?: boolean
  defaultChecked?: boolean
  showLabel?: boolean
  onCheckedChange?: (checked: boolean) => void
  /** `true` marks the field invalid; a string is also used as the message. */
  error?: boolean | string
  errorMessage?: string
  invalid?: boolean
  ref?: Ref<HTMLInputElement>
} & NativeSwitchAttributes

export function SwitchField({
  label,
  description,
  checked,
  defaultChecked = false,
  showLabel = true,
  onCheckedChange,
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
}: SwitchFieldProps) {
  const id = useFieldId('switch', idOverride)
  const { currentValue: isChecked, setValue: setChecked } = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  })

  const messageText = typeof error === 'string' && error ? error : errorMessage
  const hasError = Boolean(invalid) || error === true || Boolean(messageText)
  const labelId = `${id}-label`
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`
  const describedBy =
    classNames(description && descriptionId, messageText && errorId, ariaDescribedBy) || undefined
  const useLabelledBy = showLabel && !ariaLabel

  return (
    <label
      className={classNames('switch-field', hasError && 'switch-field-error', className)}
      htmlFor={id}
    >
      <div className="switch-text">
        {showLabel ? (
          <span className="switch-label" id={labelId}>
            {label}
          </span>
        ) : null}
        {description ? (
          <span className="switch-description" id={descriptionId}>
            {description}
          </span>
        ) : null}
        {messageText ? (
          <span className="switch-description input-error-message" id={errorId}>
            {messageText}
          </span>
        ) : null}
      </div>
      <span className={classNames('switch-track', isChecked ? 'switch-on' : 'switch-off')} aria-hidden="true">
        <span className="switch-thumb" />
      </span>
      <input
        {...rest}
        id={id}
        ref={ref}
        type="checkbox"
        role="switch"
        disabled={disabled}
        checked={isChecked}
        aria-labelledby={ariaLabelledBy ?? (useLabelledBy ? labelId : undefined)}
        aria-label={ariaLabel ?? (showLabel ? undefined : label)}
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        className="sr-only"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setChecked(event.target.checked)
          onChange?.(event)
        }}
      />
    </label>
  )
}
