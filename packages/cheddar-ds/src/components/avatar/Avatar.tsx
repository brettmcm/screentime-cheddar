import type { HTMLAttributes, Ref } from 'react'
import { useState } from 'react'
import avatar24 from '../../assets/avatars/avatar-24.png'
import avatar32 from '../../assets/avatars/avatar-32.png'
import avatar40 from '../../assets/avatars/avatar-40.png'
import { classNames } from '../utils/classNames'

type AvatarSize = '40' | '32' | '24' | 40 | 32 | 24

export type AvatarProps = {
  size?: AvatarSize
  /** Photo to render. Falls back to initials, then the bundled artwork. */
  src?: string
  alt?: string
  /** Used to derive initials and, when `alt` is absent, the accessible name. */
  name?: string
  /** Overrides the initials derived from `name`. */
  initials?: string
  ref?: Ref<HTMLSpanElement>
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>

const avatars: Record<'40' | '32' | '24', { px: number; src: string }> = {
  '40': { px: 40, src: avatar40 },
  '32': { px: 32, src: avatar32 },
  '24': { px: 24, src: avatar24 },
}

function deriveInitials(name: string | undefined) {
  if (!name) {
    return ''
  }
  const words = name.trim().split(/\s+/).filter(Boolean)
  return words
    .slice(0, 2)
    .map((word) => Array.from(word)[0] ?? '')
    .join('')
    .toUpperCase()
}

export function Avatar({
  size = '40',
  src,
  alt,
  name,
  initials,
  className,
  style,
  ref,
  ...rest
}: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const sizeKey = String(size) as '40' | '32' | '24'
  const { px, src: fallbackSrc } = avatars[sizeKey] ?? avatars['40']
  const accessibleName = alt ?? name
  const resolvedInitials = initials ?? deriveInitials(name)
  const showImage = src !== undefined && failedSrc !== src

  return (
    <span
      ref={ref}
      className={classNames('avatar', `avatar-${sizeKey}`, className)}
      style={{ width: px, height: px, ...style }}
      {...rest}
    >
      {showImage ? (
        <img
          src={src}
          alt={accessibleName ?? ''}
          aria-hidden={accessibleName ? undefined : true}
          width={px}
          height={px}
          onError={() => {
            setFailedSrc(src ?? null)
          }}
        />
      ) : resolvedInitials ? (
        <span
          className="avatar-initials"
          role={accessibleName ? 'img' : undefined}
          aria-label={accessibleName}
          aria-hidden={accessibleName ? undefined : true}
        >
          {resolvedInitials}
        </span>
      ) : (
        <img
          src={fallbackSrc}
          alt={accessibleName ?? ''}
          aria-hidden={accessibleName ? undefined : true}
          width={px}
          height={px}
        />
      )}
    </span>
  )
}
