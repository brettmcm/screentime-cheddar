import { Icon } from '../icon/Icon'
import { classNames } from '../utils/classNames'
import { useControllableState } from '../utils/useControllableState'
import { useFieldId } from '../utils/useFieldId'

export type CheckboxProps = {
  label: string
  description?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function Checkbox({
  label,
  description,
  checked,
  defaultChecked = false,
  onCheckedChange,
}: CheckboxProps) {
  const id = useFieldId('checkbox')
  const { currentValue: isChecked, setValue: setChecked } = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  })

  return (
    <label className="check-field" htmlFor={id}>
      <span className="check-row">
        <span className={classNames('check-box', isChecked ? 'check-on' : 'check-off')} aria-hidden="true">
          {isChecked ? <Icon name="check" width={14} height={14} /> : null}
        </span>
        <span className="check-label">{label}</span>
      </span>
      {description ? <span className="check-description">{description}</span> : null}
      <input
        id={id}
        type="checkbox"
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
