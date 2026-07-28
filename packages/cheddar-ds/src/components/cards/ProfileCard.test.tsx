import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { ProfileCard } from './ProfileCard'

describe('ProfileCard', () => {
  it('renders the name and handle', () => {
    renderThemed(<ProfileCard name="Ana Lopez" handle="@ana" />)

    expect(screen.getByText('Ana Lopez')).toBeInTheDocument()
    expect(screen.getByText('@ana')).toBeInTheDocument()
  })

  it('omits the handle when it is not given', () => {
    const { container } = renderThemed(<ProfileCard name="Ana Lopez" />)

    expect(container.querySelector('.profile-card-handle')).toBeNull()
  })

  describe('avatar', () => {
    it('derives the initials from the name', () => {
      const { container } = renderThemed(<ProfileCard name="Ana Lopez" />)

      expect(container.querySelector('.avatar-initials')).toHaveTextContent('AL')
    })

    it('renders the avatar photo when one is given', () => {
      renderThemed(
        <ProfileCard name="Ana Lopez" avatarSrc="https://example.test/ana.png" avatarAlt="Ana" />,
      )

      expect(screen.getByRole('img', { name: 'Ana' })).toHaveAttribute(
        'src',
        'https://example.test/ana.png',
      )
    })

    it('lets explicit initials win', () => {
      const { container } = renderThemed(<ProfileCard name="Ana Lopez" initials="AA" />)

      expect(container.querySelector('.avatar-initials')).toHaveTextContent('AA')
    })

    it.each(['40', '32', '24'] as const)('sizes the avatar at %s', (size) => {
      const { container } = renderThemed(<ProfileCard name="Ana Lopez" avatarSize={size} />)

      expect(container.querySelector('.avatar')).toHaveClass(`avatar-${size}`)
    })
  })

  describe('actions', () => {
    it('renders no action row without actions', () => {
      renderThemed(<ProfileCard name="Ana Lopez" />)

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('renders one button per action', () => {
      renderThemed(
        <ProfileCard name="Ana Lopez" actions={[{ label: 'Edit' }, { label: 'Share' }]} />,
      )

      expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
        'Edit',
        'Share',
      ])
    })

    it('calls the action onClick', async () => {
      const onClick = vi.fn()
      const { user } = renderThemed(
        <ProfileCard name="Ana Lopez" actions={[{ label: 'Edit', icon: 'edit', onClick }]} />,
      )

      await user.click(screen.getByRole('button', { name: 'Edit' }))

      expect(onClick).toHaveBeenCalledOnce()
    })
  })

  it('renders its children', () => {
    renderThemed(
      <ProfileCard name="Ana Lopez">
        <span>Member since 2024</span>
      </ProfileCard>,
    )

    expect(screen.getByText('Member since 2024')).toBeInTheDocument()
  })
})
