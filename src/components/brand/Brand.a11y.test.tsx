import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { Logo, Wordmark } from './Brand'

describe('Brand accessibility', () => {
  it('exposes the logo as a named image with its artwork hidden', async () => {
    const { container, getByRole } = renderThemed(<Logo />)

    expect(getByRole('img', { name: 'Cheddar logo' })).toBeInTheDocument()
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    await expect(container).toHaveNoAxeViolations()
  })

  it('exposes the wordmark as a named image with its artwork hidden', async () => {
    const { container, getByRole } = renderThemed(<Wordmark />)

    expect(getByRole('img', { name: 'Cheddar wordmark' })).toBeInTheDocument()
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    await expect(container).toHaveNoAxeViolations()
  })
})
