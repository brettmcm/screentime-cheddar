import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { EmptyState } from './EmptyState'

describe('EmptyState accessibility', () => {
  it('announces the default error copy through a status region', async () => {
    const { container, getByRole } = renderThemed(<EmptyState />)

    const status = getByRole('status')
    expect(status).toHaveTextContent('Something went wrong')
    expect(status).toHaveTextContent('Refresh or try again')
    await expect(container).toHaveNoAxeViolations()
  })

  it('announces custom copy without violations', async () => {
    const { container, getByRole } = renderThemed(
      <EmptyState title="No goals yet" description="Create one to get started" />,
    )

    expect(getByRole('status')).toHaveTextContent('No goals yet')
    await expect(container).toHaveNoAxeViolations()
  })
})
