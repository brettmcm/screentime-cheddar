import avatar24 from '../../assets/avatars/avatar-24.png'
import avatar32 from '../../assets/avatars/avatar-32.png'
import avatar40 from '../../assets/avatars/avatar-40.png'

type AvatarSize = '40' | '32' | '24'

export type AvatarProps = {
  size?: AvatarSize
}

const avatars: Record<AvatarSize, { px: number; src: string }> = {
  '40': { px: 40, src: avatar40 },
  '32': { px: 32, src: avatar32 },
  '24': { px: 24, src: avatar24 },
}

export function Avatar({ size = '40' }: AvatarProps) {
  const { px, src } = avatars[size]
  return (
    <span className={`avatar avatar-${size}`} style={{ width: px, height: px }}>
      <img src={src} alt="" aria-hidden="true" width={px} height={px} />
    </span>
  )
}
