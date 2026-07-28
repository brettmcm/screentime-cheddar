import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { Avatar } from './Avatar'

describe('Avatar accessibility', () => {
  it('hides the bundled fallback artwork from assistive tech when unnamed', async () => {
    const { container, queryByRole } = renderThemed(<Avatar />)

    expect(queryByRole('img')).not.toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('names a photo from alt', async () => {
    const { container, getByRole } = renderThemed(
      <Avatar src="/avatar.png" alt="Sam Rivera's profile photo" />,
    )

    expect(getByRole('img', { name: "Sam Rivera's profile photo" })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('falls back to name as the accessible name of a photo', async () => {
    const { container, getByRole } = renderThemed(<Avatar src="/avatar.png" name="Sam Rivera" />)

    expect(getByRole('img', { name: 'Sam Rivera' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes initials as a named image', async () => {
    const { container, getByRole } = renderThemed(<Avatar name="Sam Rivera" />)

    const image = getByRole('img', { name: 'Sam Rivera' })
    expect(image).toHaveTextContent('SR')
    await expect(container).toHaveNoAxeViolations()
  })

  it('hides decorative initials that carry no name', async () => {
    const { container, queryByRole } = renderThemed(<Avatar initials="SR" />)

    expect(queryByRole('img')).not.toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it.each(['40', '32', '24'] as const)('stays free of violations at size %s', async (size) => {
    const { container } = renderThemed(<Avatar size={size} name="Sam Rivera" src="/avatar.png" />)

    await expect(container).toHaveNoAxeViolations()
  })
})
