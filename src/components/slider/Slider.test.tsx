import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderThemed } from '../../test/render'
import { Slider } from './Slider'

/**
 * jsdom lays nothing out, so the track has to be told how wide it is and the
 * pointer-capture calls the drag handler makes have to actually record state
 * before pointer maths can be exercised.
 */
function measureTrack(track: HTMLElement, { left = 0, width = 400 } = {}) {
  const rect: DOMRect = {
    x: left,
    y: 0,
    left,
    top: 0,
    right: left + width,
    bottom: 40,
    width,
    height: 40,
    toJSON: () => ({}),
  }
  track.getBoundingClientRect = () => rect

  const captured = new Set<number>()
  track.setPointerCapture = (pointerId: number) => {
    captured.add(pointerId)
  }
  track.releasePointerCapture = (pointerId: number) => {
    captured.delete(pointerId)
  }
  track.hasPointerCapture = (pointerId: number) => captured.has(pointerId)
}

function ControlledSlider({ onValueChange }: { onValueChange?: (value: number) => void }) {
  const [value, setValue] = useState(100)
  return (
    <Slider
      min={0}
      max={1000}
      step={100}
      value={value}
      onValueChange={(next) => {
        setValue(next)
        onValueChange?.(next)
      }}
    />
  )
}

describe('Slider', () => {
  describe('accessibility contract', () => {
    it('exposes a slider with its range and current value', () => {
      renderThemed(<Slider min={0} max={500} defaultValue={125} />)

      const slider = screen.getByRole('slider', { name: 'Monthly savings goal' })
      expect(slider).toHaveAttribute('aria-valuemin', '0')
      expect(slider).toHaveAttribute('aria-valuemax', '500')
      expect(slider).toHaveAttribute('aria-valuenow', '125')
      expect(slider).toHaveAttribute('aria-valuetext', '$125.00')
    })

    it('names the slider with the label prop', () => {
      renderThemed(<Slider label="Weekly budget" />)

      expect(screen.getByRole('slider', { name: 'Weekly budget' })).toBeInTheDocument()
    })

    it('clamps the reported maximum to at least one step above the minimum', () => {
      renderThemed(<Slider min={10} max={10} defaultValue={10} />)

      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemax', '11')
    })
  })

  describe('keyboard interaction', () => {
    it.each([
      ['{ArrowRight}', 430],
      ['{ArrowUp}', 430],
      ['{ArrowLeft}', 410],
      ['{ArrowDown}', 410],
      ['{Home}', 0],
      ['{End}', 1000],
    ])('reports %s as a change to %i', async (key, expected) => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(
        <Slider defaultValue={420} step={10} onValueChange={onValueChange} />,
      )

      screen.getByRole('slider').focus()
      await user.keyboard(key)

      expect(onValueChange).toHaveBeenLastCalledWith(expected)
    })

    it('updates the reported value when uncontrolled', async () => {
      const { user } = renderThemed(<Slider defaultValue={420} step={5} />)

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{ArrowRight}{ArrowRight}')

      expect(slider).toHaveAttribute('aria-valuenow', '430')
    })

    it('does not move past the maximum', async () => {
      const { user } = renderThemed(<Slider min={0} max={10} defaultValue={10} step={1} />)

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{ArrowRight}')

      expect(slider).toHaveAttribute('aria-valuenow', '10')
    })

    it('does not move below the minimum', async () => {
      const { user } = renderThemed(<Slider min={5} max={10} defaultValue={5} step={1} />)

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{ArrowLeft}')

      expect(slider).toHaveAttribute('aria-valuenow', '5')
    })

    it('ignores keys it does not handle', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<Slider defaultValue={420} onValueChange={onValueChange} />)

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('a')

      expect(onValueChange).not.toHaveBeenCalled()
    })
  })

  describe('controlled and uncontrolled value', () => {
    it('holds an uncontrolled value across interactions', async () => {
      const { user } = renderThemed(<Slider min={0} max={100} defaultValue={20} step={10} />)

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{ArrowRight}{ArrowRight}{ArrowLeft}')

      expect(slider).toHaveAttribute('aria-valuenow', '30')
    })

    it('never moves a controlled value the owner does not change', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(
        <Slider min={0} max={100} value={40} step={10} onValueChange={onValueChange} />,
      )

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{ArrowRight}{ArrowRight}')

      expect(onValueChange).toHaveBeenNthCalledWith(1, 50)
      expect(onValueChange).toHaveBeenNthCalledWith(2, 50)
      expect(slider).toHaveAttribute('aria-valuenow', '40')
    })

    it('follows a controlled value the owner does change', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(<ControlledSlider onValueChange={onValueChange} />)

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{ArrowRight}{ArrowRight}')

      expect(onValueChange).toHaveBeenLastCalledWith(300)
      expect(slider).toHaveAttribute('aria-valuenow', '300')
    })
  })

  describe('completion', () => {
    it('fires onComplete once the value reaches the maximum', async () => {
      const onComplete = vi.fn()
      const { user } = renderThemed(
        <Slider min={0} max={10} defaultValue={9} step={1} onComplete={onComplete} />,
      )

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{ArrowRight}')

      expect(onComplete).toHaveBeenCalledOnce()
    })

    it('does not fire onComplete before the value reaches the maximum', async () => {
      const onComplete = vi.fn()
      const { user } = renderThemed(
        <Slider min={0} max={10} defaultValue={5} step={1} onComplete={onComplete} />,
      )

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{ArrowRight}')

      expect(onComplete).not.toHaveBeenCalled()
    })

    it('fires onComplete exactly once while the value stays complete', async () => {
      const onComplete = vi.fn()
      const { user } = renderThemed(
        <Slider min={0} max={10} defaultValue={9} step={1} onComplete={onComplete} />,
      )

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{ArrowRight}{ArrowRight}{End}')

      expect(onComplete).toHaveBeenCalledOnce()
    })

    it('arms onComplete again after the value drops back below the threshold', async () => {
      const onComplete = vi.fn()
      const { user } = renderThemed(
        <Slider min={0} max={10} defaultValue={9} step={1} onComplete={onComplete} />,
      )

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{ArrowRight}{ArrowLeft}{ArrowRight}')

      expect(onComplete).toHaveBeenCalledTimes(2)
    })

    it('honours a completeAt below the maximum', async () => {
      const onComplete = vi.fn()
      const { user } = renderThemed(
        <Slider min={0} max={10} defaultValue={6} step={1} completeAt={7} onComplete={onComplete} />,
      )

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{ArrowRight}')

      expect(onComplete).toHaveBeenCalledOnce()
    })

    it('defers onComplete to key release by default', async () => {
      const onComplete = vi.fn()
      const { user } = renderThemed(
        <Slider min={0} max={10} defaultValue={9} step={1} onComplete={onComplete} />,
      )

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{ArrowRight>}')
      expect(onComplete).not.toHaveBeenCalled()

      await user.keyboard('{/ArrowRight}')
      expect(onComplete).toHaveBeenCalledOnce()
    })

    it('fires onComplete mid-gesture when completeOnRelease is false', async () => {
      const onComplete = vi.fn()
      const { user } = renderThemed(
        <Slider
          min={0}
          max={10}
          defaultValue={9}
          step={1}
          completeOnRelease={false}
          onComplete={onComplete}
        />,
      )

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{ArrowRight>}')

      expect(onComplete).toHaveBeenCalledOnce()
    })

    it('snaps to the maximum on completion when snapOnComplete is set', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(
        <Slider
          min={0}
          max={10}
          defaultValue={6}
          step={1}
          completeAt={7}
          snapOnComplete
          onValueChange={onValueChange}
        />,
      )

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{ArrowRight}')

      expect(slider).toHaveAttribute('aria-valuenow', '10')
      expect(onValueChange).toHaveBeenLastCalledWith(10)
    })

    it('leaves the value where it landed when snapOnComplete is not set', async () => {
      const { user } = renderThemed(
        <Slider min={0} max={10} defaultValue={6} step={1} completeAt={7} />,
      )

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{ArrowRight}')

      expect(slider).toHaveAttribute('aria-valuenow', '7')
    })
  })

  describe('pointer interaction', () => {
    it('jumps to the value under the pointer on press', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(
        <Slider min={0} max={1000} step={1} onValueChange={onValueChange} />,
      )

      const slider = screen.getByRole('slider')
      measureTrack(slider)

      await user.pointer({
        target: slider,
        coords: { clientX: 100, clientY: 20 },
        keys: '[MouseLeft]',
      })

      expect(onValueChange).toHaveBeenCalledWith(250)
      expect(slider).toHaveAttribute('aria-valuenow', '250')
    })

    it('tracks the pointer while the button is held', async () => {
      const { user } = renderThemed(<Slider min={0} max={1000} step={1} />)

      const slider = screen.getByRole('slider')
      measureTrack(slider)

      await user.pointer([
        { target: slider, coords: { clientX: 40, clientY: 20 }, keys: '[MouseLeft>]' },
        { target: slider, coords: { clientX: 320, clientY: 20 } },
        { keys: '[/MouseLeft]', target: slider },
      ])

      expect(slider).toHaveAttribute('aria-valuenow', '800')
    })

    it('ignores pointer movement once the button is released', async () => {
      const { user } = renderThemed(<Slider min={0} max={1000} step={1} />)

      const slider = screen.getByRole('slider')
      measureTrack(slider)

      await user.pointer([
        { target: slider, coords: { clientX: 40, clientY: 20 }, keys: '[MouseLeft]' },
        { target: slider, coords: { clientX: 320, clientY: 20 } },
      ])

      expect(slider).toHaveAttribute('aria-valuenow', '100')
    })

    it('defers onComplete to pointer release', async () => {
      const onComplete = vi.fn()
      const { user } = renderThemed(<Slider min={0} max={1000} step={1} onComplete={onComplete} />)

      const slider = screen.getByRole('slider')
      measureTrack(slider)

      await user.pointer({
        target: slider,
        coords: { clientX: 400, clientY: 20 },
        keys: '[MouseLeft>]',
      })
      expect(onComplete).not.toHaveBeenCalled()

      await user.pointer({ keys: '[/MouseLeft]', target: slider })
      expect(onComplete).toHaveBeenCalledOnce()
    })

    it('clamps a pointer press beyond the track to the range', async () => {
      const { user } = renderThemed(<Slider min={0} max={1000} step={1} />)

      const slider = screen.getByRole('slider')
      measureTrack(slider)

      await user.pointer({
        target: slider,
        coords: { clientX: 900, clientY: 20 },
        keys: '[MouseLeft]',
      })

      expect(slider).toHaveAttribute('aria-valuenow', '1000')
    })
  })

  describe('disabled', () => {
    it('marks the slider as disabled to assistive technology', () => {
      renderThemed(<Slider disabled />)

      expect(screen.getByRole('slider')).toHaveAttribute('aria-disabled', 'true')
    })

    it('ignores the keyboard', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(
        <Slider defaultValue={420} disabled onValueChange={onValueChange} />,
      )

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{ArrowRight}{End}')

      expect(onValueChange).not.toHaveBeenCalled()
      expect(slider).toHaveAttribute('aria-valuenow', '420')
    })

    it('ignores the pointer', async () => {
      const onValueChange = vi.fn()
      const { user } = renderThemed(
        <Slider min={0} max={1000} defaultValue={420} disabled onValueChange={onValueChange} />,
      )

      const slider = screen.getByRole('slider')
      measureTrack(slider)

      await user.pointer({
        target: slider,
        coords: { clientX: 200, clientY: 20 },
        keys: '[MouseLeft]',
      })

      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('never fires onComplete', async () => {
      const onComplete = vi.fn()
      const { user } = renderThemed(
        <Slider min={0} max={10} defaultValue={10} step={1} disabled onComplete={onComplete} />,
      )

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{End}')

      expect(onComplete).not.toHaveBeenCalled()
    })
  })

  describe('value display', () => {
    it('formats the value as dollars and cents by default', () => {
      renderThemed(<Slider defaultValue={420} />)

      expect(screen.getByText('$420.00')).toBeInTheDocument()
    })

    it('uses formatValue for both the visible text and aria-valuetext', () => {
      renderThemed(<Slider defaultValue={420} formatValue={(value) => `${value} points`} />)

      expect(screen.getByText('420 points')).toBeInTheDocument()
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '420 points')
    })

    it('hides the value readout when showValue is false', () => {
      renderThemed(<Slider defaultValue={420} showValue={false} />)

      expect(screen.queryByText('$420.00')).not.toBeInTheDocument()
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '$420.00')
    })

    it('keeps the readout in step with the value as it changes', async () => {
      const { user } = renderThemed(<Slider defaultValue={420} step={10} />)

      const slider = screen.getByRole('slider')
      slider.focus()
      await user.keyboard('{ArrowRight}')

      expect(await screen.findByText('$430.00')).toBeInTheDocument()
    })
  })
})
