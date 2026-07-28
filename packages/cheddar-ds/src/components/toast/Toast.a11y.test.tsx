import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { Toast } from './Toast'

describe('Toast accessibility', () => {
  it('announces its default message politely through a status region', async () => {
    const { container, getByRole } = renderThemed(<Toast />)

    const status = getByRole('status')
    expect(status).toHaveTextContent('Action completed successfully')
    expect(status).toHaveAttribute('aria-live', 'polite')
    await expect(container).toHaveNoAxeViolations()
  })

  it('announces a custom message without violations', async () => {
    const { container, getByRole } = renderThemed(<Toast message="Goal saved" />)

    expect(getByRole('status')).toHaveTextContent('Goal saved')
    await expect(container).toHaveNoAxeViolations()
  })
})
