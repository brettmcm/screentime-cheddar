import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { Tag } from './Tag'

describe('Tag accessibility', () => {
  it('names the dismiss control after the tag it removes', async () => {
    const { container, getByRole } = renderThemed(<Tag label="Travel" />)

    expect(getByRole('button', { name: 'Remove Travel' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('has no violations and no controls when it is not dismissible', async () => {
    const { container, queryByRole } = renderThemed(<Tag label="Travel" dismissible={false} />)

    expect(queryByRole('button')).not.toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it.each(['green', 'blue', 'magenta', 'purple'] as const)(
    'stays free of violations in the %s colour',
    async (color) => {
      const { container } = renderThemed(<Tag label="Travel" color={color} />)

      await expect(container).toHaveNoAxeViolations()
    },
  )

  it('reaches the dismiss control by Tab with no positive tabIndex', async () => {
    const { container, getByRole, user } = renderThemed(<Tag label="Travel" />)

    await user.tab()
    expect(getByRole('button', { name: 'Remove Travel' })).toHaveFocus()
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
  })
})
