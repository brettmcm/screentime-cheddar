import type {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
  RefObject,
} from 'react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { classNames } from '../utils/classNames'
import { useFieldId } from '../utils/useFieldId'
import { IconButton } from '../icon-button/IconButton'

type SheetPosition = 'bottom' | 'center'
type SheetSize = 'auto' | 'full'

export type SheetProps = {
  open: boolean
  onClose?: () => void
  title?: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  showClose?: boolean
  closeLabel?: string
  dismissOnScrim?: boolean
  dismissOnEscape?: boolean
  position?: SheetPosition
  size?: SheetSize
  initialFocusRef?: RefObject<HTMLElement | null>
  className?: string
  id?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children' | 'id'>

const TABBABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  'summary',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

// `getClientRects()` would be the cheaper visibility test, but it reports nothing in
// environments without layout, so walk the box tree instead: `visibility` inherits, while
// `display: none` has to be looked for on every ancestor.
function isHidden(element: HTMLElement) {
  if (element.hasAttribute('hidden') || element.getAttribute('aria-hidden') === 'true') return true
  if (getComputedStyle(element).visibility === 'hidden') return true
  for (let node: HTMLElement | null = element; node; node = node.parentElement) {
    if (getComputedStyle(node).display === 'none') return true
  }
  return false
}

function getTabbable(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)).filter(
    (element) => element.tabIndex !== -1 && !element.hasAttribute('disabled') && !isHidden(element),
  )
}

export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  showClose = true,
  closeLabel = 'Close',
  dismissOnScrim = true,
  dismissOnEscape = true,
  position = 'bottom',
  size = 'auto',
  initialFocusRef,
  className,
  id,
  'aria-label': ariaLabel,
  ...rest
}: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  // A drag that starts on the sheet and finishes on the scrim must not dismiss, so the
  // scrim only counts as clicked when both the pointer-down and the click landed on it.
  const pointerDownOnScrim = useRef(false)

  const sheetId = useFieldId('cds-sheet', id)
  const titleId = `${sheetId}-title`
  const descriptionId = `${sheetId}-description`

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const sheet = sheetRef.current
    if (sheet) {
      const target = initialFocusRef?.current ?? getTabbable(sheet)[0] ?? sheet
      target.focus()
    }
    return () => {
      previouslyFocused?.focus?.()
    }
  }, [open, initialFocusRef])

  useEffect(() => {
    if (!open || typeof document === 'undefined') return
    const { body } = document
    const previousOverflow = body.style.overflow
    body.style.overflow = 'hidden'
    return () => {
      body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open || typeof document === 'undefined') return null

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      if (!dismissOnEscape) return
      event.stopPropagation()
      onClose?.()
      return
    }

    if (event.key !== 'Tab') return
    const sheet = sheetRef.current
    if (!sheet) return

    const tabbable = getTabbable(sheet)
    if (tabbable.length === 0) {
      event.preventDefault()
      sheet.focus()
      return
    }

    const first = tabbable[0]
    const last = tabbable[tabbable.length - 1]
    const active = document.activeElement

    if (event.shiftKey && (active === first || active === sheet)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const handleScrimPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerDownOnScrim.current = event.target === event.currentTarget
  }

  const handleScrimClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!dismissOnScrim) return
    if (event.target !== event.currentTarget) return
    if (!pointerDownOnScrim.current) return
    pointerDownOnScrim.current = false
    onClose?.()
  }

  const hasHeader = Boolean(title) || showClose

  const sheet = (
    <div
      className={classNames('sheet-scrim', `sheet-scrim-${position}`)}
      role="presentation"
      onPointerDown={handleScrimPointerDown}
      onClick={handleScrimClick}
      onKeyDown={handleKeyDown}
    >
      <div
        {...rest}
        ref={sheetRef}
        id={sheetId}
        className={classNames('sheet', `sheet-${position}`, size === 'full' && 'sheet-full', className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : (ariaLabel ?? 'Dialog')}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        {hasHeader ? (
          <div className="sheet-header">
            {title ? (
              <h2 className="sheet-title" id={titleId}>
                {title}
              </h2>
            ) : null}
            {showClose ? (
              <IconButton
                className="sheet-close"
                icon="x"
                variant="ghost"
                size="small"
                label={closeLabel}
                onClick={() => onClose?.()}
              />
            ) : null}
          </div>
        ) : null}
        {description ? (
          <p className="sheet-description" id={descriptionId}>
            {description}
          </p>
        ) : null}
        {children ? <div className="sheet-body">{children}</div> : null}
        {footer ? <div className="sheet-footer">{footer}</div> : null}
      </div>
    </div>
  )

  return createPortal(sheet, document.body)
}
