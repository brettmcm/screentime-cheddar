import { Icon } from '../icon/Icon'
import { useControllableState } from '../utils/useControllableState'
import { useFieldId } from '../utils/useFieldId'

const defaultDropdownOptions = ['Value', 'Checking', 'Savings', 'Travel fund']

export type InputFieldProps = {
  label: string
  value?: string
  defaultValue?: string
  description?: string
  dropdown?: boolean
  options?: string[]
  showLabel?: boolean
  onValueChange?: (value: string) => void
}

export function InputField({
  label,
  value,
  defaultValue = '',
  description,
  dropdown = false,
  options = defaultDropdownOptions,
  showLabel = true,
  onValueChange,
}: InputFieldProps) {
  const id = useFieldId('input')
  const { currentValue, setValue } = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const valueClass = currentValue ? 'input-value' : 'input-placeholder'
  const selectOptions = options.includes(currentValue) ? options : [currentValue, ...options]

  return (
    <label className="input-field" htmlFor={id}>
      {showLabel ? <span className="input-label">{label}</span> : null}
      <span className="input-shell">
        {dropdown ? (
          <select
            id={id}
            aria-label={label}
            value={currentValue}
            className={valueClass}
            onChange={(event) => {
              setValue(event.target.value)
            }}
          >
            {selectOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            aria-label={label}
            value={currentValue}
            className={valueClass}
            onChange={(event) => {
              setValue(event.target.value)
            }}
          />
        )}
        {dropdown ? <Icon name="caret-down" width={16} className="input-icon" /> : null}
      </span>
      {description ? <span className="input-description">{description}</span> : null}
    </label>
  )
}
