import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, InputHTMLAttributes, Ref } from 'react'
import { classNames } from '../utils/classNames'
import { useFieldId } from '../utils/useFieldId'

type NativeRadioAttributes = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'checked' | 'defaultChecked' | 'size' | 'type' | 'children'
>

export type RadioProps = {
  label: string
  description?: string
  checked?: boolean
  defaultChecked?: boolean
  name?: string
  onCheckedChange?: (checked: boolean) => void
  /** `true` marks the field invalid; a string is also used as the message. */
  error?: boolean | string
  errorMessage?: string
  invalid?: boolean
  ref?: Ref<HTMLInputElement>
} & NativeRadioAttributes

export function Radio({
  label,
  description,
  checked,
  defaultChecked = false,
  name,
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
}: RadioProps) {
  const id = useFieldId('radio', idOverride)
  const isControlled = checked !== undefined
  const inputRef = useRef<HTMLInputElement>(null)
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked)
  const isChecked = isControlled ? checked : uncontrolledChecked

  /**
   * Uncontrolled radios sharing a `name` are exclusive by way of the browser, not
   * React. Rendering `checked` from per-radio state fights that: selecting a sibling
   * re-renders this one as still checked, which re-checks it in the DOM and drops the
   * new selection. So when uncontrolled we hand the input to the DOM via
   * `defaultChecked` and mirror whatever it decides.
   *
   * `change` bubbles for radios, so one listener on the owning form (or document,
   * for a group outside a form) sees sibling selections too.
   */
  const lastChecked = useRef(defaultChecked)

  useEffect(() => {
    const input = inputRef.current
    if (isControlled || !input) {
      return
    }
    const root: HTMLFormElement | Document = input.form ?? input.ownerDocument
    const sync = () => {
      if (lastChecked.current === input.checked) {
        return
      }
      lastChecked.current = input.checked
      setUncontrolledChecked(input.checked)
      onCheckedChange?.(input.checked)
    }
    root.addEventListener('change', sync)
    return () => root.removeEventListener('change', sync)
  }, [isControlled, onCheckedChange])

  const attachInput = (node: HTMLInputElement | null) => {
    inputRef.current = node
    if (typeof ref === 'function') {
      return ref(node)
    }
    if (ref) {
      ref.current = node
    }
  }

  const messageText = typeof error === 'string' && error ? error : errorMessage
  const hasError = Boolean(invalid) || error === true || Boolean(messageText)
  const labelId = `${id}-label`
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`
  const describedBy =
    classNames(description && descriptionId, messageText && errorId, ariaDescribedBy) || undefined

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Uncontrolled state and `onCheckedChange` are driven by the `change` listener
    // above, which sees sibling selections as well as this one.
    if (isControlled) {
      onCheckedChange?.(event.target.checked)
    }
    onChange?.(event)
  }

  return (
    <label
      className={classNames('check-field', hasError && 'check-field-error', className)}
      htmlFor={id}
    >
      <span className="check-row">
        <span className={classNames('check-circle', isChecked ? 'check-on' : 'check-off')} aria-hidden="true">
          {isChecked ? <span className="radio-dot" /> : null}
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
        ref={attachInput}
        type="radio"
        name={name}
        disabled={disabled}
        {...(isControlled ? { checked } : { defaultChecked })}
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
