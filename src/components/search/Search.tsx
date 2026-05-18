import { Icon } from '../icon/Icon'
import { classNames } from '../utils/classNames'
import { useControllableState } from '../utils/useControllableState'
import { useFieldId } from '../utils/useFieldId'

export type SearchProps = {
  value?: string
  defaultValue?: string
  placeholder?: string
  label?: string
  onValueChange?: (value: string) => void
}

export function Search({
  value,
  defaultValue = '',
  placeholder = 'Search anything',
  label = 'Search',
  onValueChange,
}: SearchProps) {
  const id = useFieldId('search')
  const { currentValue, setValue } = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })

  return (
    <div className="search-field" role="search">
      <Icon
        name="search"
        width={16}
        height={16}
        className="search-icon"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={currentValue}
        placeholder={placeholder}
        aria-label={label}
        className={classNames('search-input', !currentValue && 'search-placeholder')}
        onChange={(event) => {
          setValue(event.target.value)
        }}
      />
    </div>
  )
}
