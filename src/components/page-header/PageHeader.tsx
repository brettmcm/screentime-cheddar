import { Icon } from '../icon/Icon'
import { classNames } from '../utils/classNames'

type HeaderVariant = 'left' | 'center'

export type PageHeaderProps = {
  title: string
  variant?: HeaderVariant
}

export function PageHeader({ title, variant = 'left' }: PageHeaderProps) {
  const center = variant === 'center'
  return (
    <header className={classNames('page-header', center ? 'page-header-center' : 'page-header-left')}>
      {center ? (
        <span className="header-spacer" aria-hidden="true" />
      ) : (
        <button type="button" className="page-header-back" aria-label="Back">
          <Icon name="caret-left" width={24} height={24} />
        </button>
      )}
      <h3>{title}</h3>
      {center ? <span className="header-spacer" aria-hidden="true" /> : null}
    </header>
  )
}
