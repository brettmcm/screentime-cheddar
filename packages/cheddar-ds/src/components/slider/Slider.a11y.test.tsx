import { describe, expect, it } from 'vitest'
import { renderThemed } from '../../test/render'
import { Slider } from './Slider'

describe('Slider accessibility', () => {
  it('exposes a named slider carrying its full value range', async () => {
    const { container, getByRole } = renderThemed(<Slider />)

    const slider = getByRole('slider', { name: 'Monthly savings goal' })
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '1000')
    expect(slider).toHaveAttribute('aria-valuenow', '420')
    expect(slider).toHaveAttribute('aria-valuetext', '$420.00')
    await expect(container).toHaveNoAxeViolations()
  })

  it('uses a custom label as the accessible name', async () => {
    const { container, getByRole } = renderThemed(<Slider label="Weekly deposit" />)

    expect(getByRole('slider', { name: 'Weekly deposit' })).toBeInTheDocument()
    await expect(container).toHaveNoAxeViolations()
  })

  it('spells the value out with the caller formatter', async () => {
    const { container, getByRole } = renderThemed(
      <Slider value={5} min={0} max={10} formatValue={(value) => `${value} of 10 weeks`} />,
    )

    expect(getByRole('slider')).toHaveAttribute('aria-valuetext', '5 of 10 weeks')
    await expect(container).toHaveNoAxeViolations()
  })

  it('marks itself disabled rather than silently ignoring input', async () => {
    const { container, getByRole } = renderThemed(<Slider disabled />)

    expect(getByRole('slider')).toHaveAttribute('aria-disabled', 'true')
    await expect(container).toHaveNoAxeViolations()
  })

  it('stays free of violations when the numeric read-out is hidden', async () => {
    const { container } = renderThemed(<Slider showValue={false} />)

    await expect(container).toHaveNoAxeViolations()
  })

  it('is reachable by Tab and carries no positive tabIndex', async () => {
    const { container, getByRole, user } = renderThemed(<Slider />)

    await user.tab()
    expect(getByRole('slider')).toHaveFocus()
    expect(
      [...container.querySelectorAll<HTMLElement>('[tabindex]')].filter((el) => el.tabIndex > 0),
    ).toHaveLength(0)
  })

  it('adjusts its value with the arrow, Home and End keys', async () => {
    const { getByRole, user } = renderThemed(<Slider defaultValue={500} step={10} />)

    const slider = getByRole('slider')
    await user.tab()

    await user.keyboard('{ArrowRight}')
    expect(slider).toHaveAttribute('aria-valuenow', '510')

    await user.keyboard('{ArrowLeft}')
    expect(slider).toHaveAttribute('aria-valuenow', '500')

    await user.keyboard('{Home}')
    expect(slider).toHaveAttribute('aria-valuenow', '0')

    await user.keyboard('{End}')
    expect(slider).toHaveAttribute('aria-valuenow', '1000')
  })
})
