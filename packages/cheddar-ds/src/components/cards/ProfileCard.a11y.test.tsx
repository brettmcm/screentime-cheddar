import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { ProfileCard } from './ProfileCard'

describe('ProfileCard accessibility', () => {
  it('renders the name and handle without violations', async () => {
    const { container, getByText } = renderThemed(<ProfileCard name="Sam Rivera" handle="@samr" />)

    expect(getByText('Sam Rivera')).toBeInTheDocument()
    expect(getByText('@samr')).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('names the avatar image from the profile name', async () => {
    const { container, getByRole } = renderThemed(
      <ProfileCard name="Sam Rivera" avatarSrc="/avatar.png" />,
    )

    expect(getByRole('img', { name: 'Sam Rivera' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('prefers an explicit avatar alt over the profile name', async () => {
    const { container, getByRole } = renderThemed(
      <ProfileCard name="Sam Rivera" avatarSrc="/avatar.png" avatarAlt="Sam at the beach" />,
    )

    expect(getByRole('img', { name: 'Sam at the beach' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('reaches every action button by Tab with no positive tabIndex', async () => {
    const { container, getByRole, user } = renderThemed(
      <ProfileCard
        name="Sam Rivera"
        handle="@samr"
        actions={[
          { label: 'Edit profile', icon: 'edit', onClick: () => {} },
          { label: 'Settings', icon: 'settings', onClick: () => {} },
        ]}
      />,
    )

    await user.tab()
    expect(getByRole('button', { name: 'Edit profile' })).toHaveFocus()

    await user.tab()
    expect(getByRole('button', { name: 'Settings' })).toHaveFocus()

    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
    await expect(container).toHaveNoAxeViolations()
  })
})
