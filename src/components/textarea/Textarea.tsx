import { useControllableState } from '../utils/useControllableState'
import { useFieldId } from '../utils/useFieldId'

export type TextareaProps = {
  label: string
  value?: string
  defaultValue?: string
  description?: string
  showLabel?: boolean
  onValueChange?: (value: string) => void
}

export function Textarea({
  label,
  value,
  defaultValue = '',
  description,
  showLabel = true,
  onValueChange,
}: TextareaProps) {
  const id = useFieldId('textarea')
  const { currentValue, setValue } = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })

  return (
    <label className="textarea-field" htmlFor={id}>
      {showLabel ? <span className="input-label">{label}</span> : null}
      <textarea
        id={id}
        aria-label={label}
        value={currentValue}
        className="textarea-input"
        onChange={(event) => {
          setValue(event.target.value)
        }}
      />
      {description ? <span className="input-description">{description}</span> : null}
    </label>
  )
}
