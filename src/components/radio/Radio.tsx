import { classNames } from '../utils/classNames'
import { useControllableState } from '../utils/useControllableState'
import { useFieldId } from '../utils/useFieldId'

export type RadioProps = {
  label: string
  description?: string
  checked?: boolean
  defaultChecked?: boolean
  name?: string
  onCheckedChange?: (checked: boolean) => void
}

export function Radio({
  label,
  description,
  checked,
  defaultChecked = false,
  name,
  onCheckedChange,
}: RadioProps) {
  const id = useFieldId('radio')
  const { currentValue: isChecked, setValue: setChecked } = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  })

  return (
    <label className="check-field" htmlFor={id}>
      <span className="check-row">
        <span className={classNames('check-circle', isChecked ? 'check-on' : 'check-off')} aria-hidden="true">
          {isChecked ? <span className="radio-dot" /> : null}
        </span>
        <span className="check-label">{label}</span>
      </span>
      {description ? <span className="check-description">{description}</span> : null}
      <input
        id={id}
        type="radio"
        name={name}
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
