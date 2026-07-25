import type { HTMLAttributes, ReactNode } from 'react'
import { Icon } from '../icon/Icon'
import { classNames } from '../utils/classNames'

export type SectionHeaderProps = {
  title: string
  as?: 'h2' | 'h3' | 'h4'
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
  trailing?: ReactNode
  id?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'title'>

/**
 * The section heading used above every list on the Cheddar screens: a
 * heading on the left and an optional "View all ›" affordance on the right.
 *
 * Pass `id` to wire the heading to the region it labels
 * (`aria-labelledby`). The action renders only when `actionLabel` is set,
 * as an `<a>` when `actionHref` is given and a `<button>` otherwise.
 */
export function SectionHeader({
  title,
  as: Heading = 'h2',
  actionLabel,
  onAction,
  actionHref,
  trailing,
  id,
  className,
  ...rest
}: SectionHeaderProps) {
  const action = actionLabel ? (
    <>
      <span>{actionLabel}</span>
      <Icon name="caret-right" width={8} height={14} aria-hidden="true" />
    </>
  ) : null

  return (
    <div className={classNames('section-header', className)} {...rest}>
      <Heading id={id} className="section-header-title">
        {title}
      </Heading>
      {trailing || action ? (
        <div className="section-header-trailing">
          {trailing}
          {action ? (
            actionHref ? (
              <a className="section-header-action" href={actionHref} onClick={onAction}>
                {action}
              </a>
            ) : (
              <button type="button" className="section-header-action" onClick={onAction}>
                {action}
              </button>
            )
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
