import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { Button } from './Button'

describe('Button accessibility', () => {
  it('exposes its label as the accessible name in the default state', async () => {
    const { container, getByRole } = renderThemed(<Button label="Add money" />)

    expect(getByRole('button', { name: 'Add money' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('keeps the label the accessible name when an icon is shown', async () => {
    const { container, getByRole } = renderThemed(
      <Button label="Home" icon="home" variant="secondary" size="medium" />,
    )

    expect(getByRole('button', { name: 'Home' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations at the small secondary size with the default icon', async () => {
    const { container } = renderThemed(<Button label="More" variant="secondary" size="small" showIcon />)

    await expect(container).toHaveNoAxeViolations()
  })

  it('remains named and out of the tab order when disabled', async () => {
    const { container, getByRole, user } = renderThemed(<Button label="Transfer" disabled />)

    const button = getByRole('button', { name: 'Transfer' })
    expect(button).toBeDisabled()

    await user.tab()
    expect(button).not.toHaveFocus()
    await expect(container).toHaveNoAxeViolations()
  })

  it('is reachable by Tab and carries no positive tabIndex', async () => {
    const { container, getByRole, user } = renderThemed(<Button label="Save goal" />)

    await user.tab()
    expect(getByRole('button', { name: 'Save goal' })).toHaveFocus()
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0)
  })
})
