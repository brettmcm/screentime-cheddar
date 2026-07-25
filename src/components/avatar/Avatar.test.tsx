import { describe, expect, it } from 'vitest'
import { act, screen } from '@testing-library/react'
import avatar24 from '../../assets/avatars/avatar-24.png'
import avatar32 from '../../assets/avatars/avatar-32.png'
import avatar40 from '../../assets/avatars/avatar-40.png'
import { renderThemed } from '../../test/render'
import { Avatar } from './Avatar'

const PHOTO = 'https://example.test/ana.png'

function avatarImage(container: HTMLElement) {
  const image = container.querySelector('img')
  if (!image) {
    throw new Error('expected the avatar to render an image')
  }
  return image
}

describe('Avatar', () => {
  describe('photo', () => {
    it('renders the src with alt as its accessible name', () => {
      renderThemed(<Avatar src={PHOTO} alt="Ana Lopez" />)

      const image = screen.getByRole('img', { name: 'Ana Lopez' })
      expect(image).toHaveAttribute('src', PHOTO)
    })

    it('falls back to name for the accessible name when alt is absent', () => {
      renderThemed(<Avatar src={PHOTO} name="Ana Lopez" />)

      expect(screen.getByRole('img', { name: 'Ana Lopez' })).toBeInTheDocument()
    })

    it('hides the photo from assistive tech when it is unnamed', () => {
      const { container } = renderThemed(<Avatar src={PHOTO} />)

      expect(avatarImage(container)).toHaveAttribute('aria-hidden', 'true')
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('falls back to the initials when the photo fails to load', async () => {
      const { container } = renderThemed(<Avatar src={PHOTO} name="Ana Lopez" />)

      const image = avatarImage(container)
      await act(async () => {
        image.dispatchEvent(new Event('error'))
      })

      expect(container.querySelector('img')).toBeNull()
      expect(await screen.findByText('AL')).toBeInTheDocument()
    })
  })

  describe('initials', () => {
    it.each([
      ['Ana Lopez', 'AL'],
      ['ana lopez', 'AL'],
      ['Cher', 'C'],
      ['Ana Maria Lopez', 'AM'],
      ['  Ana   Lopez  ', 'AL'],
    ])('derives the initials of %s as %s', (name, expected) => {
      renderThemed(<Avatar name={name} />)

      expect(screen.getByText(expected)).toBeInTheDocument()
    })

    it('exposes the initials as a named image', () => {
      renderThemed(<Avatar name="Ana Lopez" />)

      expect(screen.getByRole('img', { name: 'Ana Lopez' })).toHaveTextContent('AL')
    })

    it('lets explicit initials override the ones derived from name', () => {
      renderThemed(<Avatar name="Ana Lopez" initials="Q" />)

      expect(screen.getByText('Q')).toBeInTheDocument()
      expect(screen.queryByText('AL')).not.toBeInTheDocument()
    })

    it('prefers the photo over the initials when both are available', () => {
      const { container } = renderThemed(<Avatar src={PHOTO} name="Ana Lopez" />)

      expect(avatarImage(container)).toHaveAttribute('src', PHOTO)
      expect(screen.queryByText('AL')).not.toBeInTheDocument()
    })
  })

  describe('bundled artwork', () => {
    it('falls back to the bundled artwork when there is no photo and no name', () => {
      const { container } = renderThemed(<Avatar />)

      expect(avatarImage(container)).toHaveAttribute('src', avatar40)
    })

    it.each([
      ['40', avatar40],
      ['32', avatar32],
      ['24', avatar24],
    ] as const)('uses the %s artwork at that size', (size, artwork) => {
      const { container } = renderThemed(<Avatar size={size} />)

      expect(avatarImage(container)).toHaveAttribute('src', artwork)
    })

    it('names the bundled artwork when a name is supplied without initials', () => {
      renderThemed(<Avatar name=" " alt="Anonymous saver" />)

      expect(screen.getByRole('img', { name: 'Anonymous saver' })).toBeInTheDocument()
    })
  })

  describe('sizes', () => {
    it.each([
      ['40', 40],
      ['32', 32],
      ['24', 24],
      [40, 40],
      [32, 32],
      [24, 24],
    ] as const)('sizes the avatar for %s', (size, px) => {
      const { container } = renderThemed(<Avatar size={size} name="Ana Lopez" />)

      const root = container.querySelector('.avatar')
      expect(root).toHaveClass(`avatar-${px}`)
      expect(root).toHaveStyle({ width: `${px}px`, height: `${px}px` })
    })

    it.each([40, 32, 24] as const)('sizes the image at %i as well', (px) => {
      const { container } = renderThemed(<Avatar size={px} src={PHOTO} alt="Ana" />)

      const image = avatarImage(container)
      expect(image).toHaveAttribute('width', String(px))
      expect(image).toHaveAttribute('height', String(px))
    })

    it('lets a caller override the box size through style', () => {
      const { container } = renderThemed(<Avatar name="Ana Lopez" style={{ width: 64 }} />)

      expect(container.querySelector('.avatar')).toHaveStyle({ width: '64px', height: '40px' })
    })
  })

  describe('native attributes', () => {
    it('forwards extra attributes to the root element', () => {
      renderThemed(<Avatar name="Ana Lopez" data-testid="ana" title="Ana Lopez" id="ana-avatar" />)

      const root = screen.getByTestId('ana')
      expect(root).toHaveAttribute('title', 'Ana Lopez')
      expect(root).toHaveAttribute('id', 'ana-avatar')
    })

    it('keeps its own class alongside a caller class', () => {
      const { container } = renderThemed(<Avatar name="Ana Lopez" className="profile-avatar" />)

      expect(container.querySelector('.avatar')).toHaveClass('avatar', 'avatar-40', 'profile-avatar')
    })
  })
})
