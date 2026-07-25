import type { ReactNode, Ref } from 'react'
import { Icon } from '../icon/Icon'
import { classNames } from '../utils/classNames'

type HeaderAlign = 'left' | 'center'
type HeaderLevel = 'h1' | 'h2' | 'h3'

export type PageHeaderProps = {
  title: string
  align?: HeaderAlign
  /** Heading level for `title`. */
  as?: HeaderLevel
  onBack?: () => void
  /**
   * Accessible name for the back control.
   * @default 'Back'
   */
  backLabel?: string
  /**
   * Forces the back control on or off. Defaults to the v1.1.0 behaviour:
   * shown for `left` alignment, hidden for `center` unless `onBack` is set.
   * Without `onBack` the control renders inert (disabled and hidden from
   * assistive tech) so it stays visually identical without being a dead control.
   */
  showBack?: boolean
  leading?: ReactNode
  trailing?: ReactNode
  className?: string
  ref?: Ref<HTMLElement>
}

export function PageHeader({
  title,
  align = 'left',
  as: Heading = 'h1',
  onBack,
  backLabel = 'Back',
  showBack,
  leading,
  trailing,
  className,
  ref,
}: PageHeaderProps) {
  const center = align === 'center'
  const backEnabled = onBack !== undefined
  const renderBack = showBack ?? (backEnabled || !center)

  const backButton = renderBack ? (
    <button
      type="button"
      className="page-header-back"
      aria-label={backEnabled ? backLabel : undefined}
      aria-hidden={backEnabled ? undefined : true}
      disabled={!backEnabled}
      onClick={onBack}
    >
      {/* 24x24 is the tap target; Figma draws the glyph itself at the caret's
          intrinsic size, which keeps its stroke a true 3px. */}
      <Icon name="caret-left" width={9.64} height={17.4} />
    </button>
  ) : null

  const leadingSlot =
    backButton || leading ? (
      <span className="page-header-slot page-header-leading">
        {backButton}
        {leading}
      </span>
    ) : center ? (
      <span className="header-spacer" aria-hidden="true" />
    ) : null

  const trailingSlot = trailing ? (
    <span className="page-header-slot page-header-trailing">{trailing}</span>
  ) : center ? (
    <span className="header-spacer" aria-hidden="true" />
  ) : null

  return (
    <header
      ref={ref}
      className={classNames(
        'page-header',
        center ? 'page-header-center' : 'page-header-left',
        className,
      )}
    >
      {leadingSlot}
      <Heading className="page-header-title">{title}</Heading>
      {trailingSlot}
    </header>
  )
}
