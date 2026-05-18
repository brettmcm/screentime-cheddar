import { classNames } from '../utils/classNames'
import { useControllableState } from '../utils/useControllableState'
import { useFieldId } from '../utils/useFieldId'

export type SwitchFieldProps = {
  label: string
  description?: string
  checked?: boolean
  defaultChecked?: boolean
  showLabel?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function SwitchField({
  label,
  description,
  checked,
  defaultChecked = false,
  showLabel = true,
  onCheckedChange,
}: SwitchFieldProps) {
  const id = useFieldId('switch')
  const { currentValue: isChecked, setValue: setChecked } = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  })

  return (
    <label className="switch-field" htmlFor={id}>
      <div className="switch-text">
        {showLabel ? <span className="switch-label">{label}</span> : null}
        {description ? <span className="switch-description">{description}</span> : null}
      </div>
      <span className={classNames('switch-track', isChecked ? 'switch-on' : 'switch-off')} aria-hidden="true">
        <span className="switch-thumb" />
      </span>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={isChecked}
        aria-label={label}
        className="sr-only"
        onChange={(event) => {
          setChecked(event.target.checked)
        }}
      />
    </label>
  )
}
