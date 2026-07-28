import { describe, expect, it } from 'vitest'
import { Button } from '../button/Button'
import { renderThemed } from '../../test/render'
import { ThemeScope } from './ThemeScope'

describe('ThemeScope accessibility', () => {
  it('adds theming attributes without adding semantics of its own', async () => {
    const { container } = renderThemed(
      <ThemeScope brand="blue" scheme="dark">
        <Button label="Add money" />
      </ThemeScope>,
    )

    const scope = container.querySelector('[data-brand="blue"]')
    expect(scope?.tagName).toBe('DIV')
    expect(scope).not.toHaveAttribute('role')
    expect(scope).toHaveAttribute('data-theme', 'dark')
    await expect(container).toHaveNoAxeViolations()
  })

  it('keeps the landmark semantics of the element it is asked to render', async () => {
    const { container, getByRole } = renderThemed(
      <ThemeScope as="main" appearance="brand">
        <Button label="Add money" />
      </ThemeScope>,
    )

    expect(getByRole('main')).toHaveAttribute('data-appearance', 'brand')
    await expect(container).toHaveNoAxeViolations()
  })

  it('nests without breaking the tree', async () => {
    const { container, getByRole } = renderThemed(
      <ThemeScope brand="green" appearance="brand">
        <ThemeScope scheme="light">
          <Button label="Add money" />
        </ThemeScope>
      </ThemeScope>,
    )

    expect(getByRole('button', { name: 'Add money' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })
})
