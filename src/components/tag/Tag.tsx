import { Icon } from '../icon/Icon'
import { useControllableState } from '../utils/useControllableState'

type TagColor = 'green' | 'blue' | 'magenta' | 'purple'

export type TagProps = {
  label: string
  color?: TagColor
  dismissible?: boolean
  visible?: boolean
  defaultVisible?: boolean
  onDismiss?: () => void
  onVisibleChange?: (visible: boolean) => void
}

export function Tag({
  label,
  color = 'green',
  dismissible = true,
  visible,
  defaultVisible = true,
  onDismiss,
  onVisibleChange,
}: TagProps) {
  const { currentValue: isVisible, setValue: setVisible } = useControllableState({
    value: visible,
    defaultValue: defaultVisible,
    onChange: onVisibleChange,
  })

  if (!isVisible) {
    return null
  }

  return (
    <span className={`tag tag-${color}`}>
      <span className="tag-label">{label}</span>
      {dismissible ? (
        <button
          type="button"
          className="tag-dismiss"
          aria-label={`Remove ${label}`}
          onClick={() => {
            setVisible(false)
            onDismiss?.()
          }}
        >
          <Icon name="x" width={12} height={12} aria-hidden="true" />
        </button>
      ) : null}
    </span>
  )
}
