import type { ChangeEvent, InputHTMLAttributes, Ref } from 'react'
import { Icon } from '../icon/Icon'
import { classNames } from '../utils/classNames'
import { useControllableState } from '../utils/useControllableState'
import { useFieldId } from '../utils/useFieldId'

type NativeCheckboxAttributes = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'checked' | 'defaultChecked' | 'size' | 'type' | 'children'
>

export type CheckboxProps = {
  label: string
  description?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  /** `true` marks the field invalid; a string is also used as the message. */
  error?: boolean | string
  errorMessage?: string
  invalid?: boolean
  ref?: Ref<HTMLInputElement>
} & NativeCheckboxAttributes

export function Checkbox({
  label,
  description,
  checked,
  defaultChecked = false,
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
}: CheckboxProps) {
  const id = useFieldId('checkbox', idOverride)
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    onChange?.(event)
  }

  return (
    <label
      className={classNames('check-field', hasError && 'check-field-error', className)}
      htmlFor={id}
    >
      <span className="check-row">
        <span className={classNames('check-box', isChecked ? 'check-on' : 'check-off')} aria-hidden="true">
          {isChecked ? <Icon name="check" width={14} height={14} /> : null}
        </span>
        <span className="check-label" id={labelId}>
          {label}
        </span>
      </span>
      {description ? (
        <span className="check-description" id={descriptionId}>
          {description}
        </span>
      ) : null}
      {messageText ? (
        <span className="check-description input-error-message" id={errorId}>
          {messageText}
        </span>
      ) : null}
      <input
        {...rest}
        id={id}
        ref={ref}
        type="checkbox"
        disabled={disabled}
        checked={isChecked}
        aria-labelledby={ariaLabelledBy ?? (ariaLabel ? undefined : labelId)}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        className="sr-only"
        onChange={handleChange}
      />
    </label>
  )
}
