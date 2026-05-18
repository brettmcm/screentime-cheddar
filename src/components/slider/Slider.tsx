import { useRef } from 'react'
import { Logo } from '../brand/Brand'
import { useControllableState } from '../utils/useControllableState'

export type SliderProps = {
  label?: string
  min?: number
  max?: number
  value?: number
  defaultValue?: number
  step?: number
  onValueChange?: (value: number) => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function roundToStep(value: number, min: number, step: number) {
  return Math.round((value - min) / step) * step + min
}

export function Slider({
  label = 'Monthly savings goal',
  min = 0,
  max = 1000,
  value,
  defaultValue = 420,
  step = 1,
  onValueChange,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLSpanElement>(null)
  const safeMax = Math.max(max, min + 1)
  const safeStep = step > 0 ? step : 1
  const { currentValue, setValue } = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const safeValue = clamp(roundToStep(currentValue, min, safeStep), min, safeMax)
  const percentage = ((safeValue - min) / (safeMax - min)) * 100
  const valueText = `$${safeValue.toFixed(2)}`

  const updateValueFromX = (clientX: number) => {
    const track = trackRef.current
    if (!track) {
      return
    }
    const bounds = track.getBoundingClientRect()
    const thumbWidth = thumbRef.current?.offsetWidth ?? 96
    const availableWidth = Math.max(bounds.width - thumbWidth, 1)
    const ratio = clamp((clientX - bounds.left - thumbWidth / 2) / availableWidth, 0, 1)
    const rawValue = min + ratio * (safeMax - min)
    const snappedValue = clamp(roundToStep(rawValue, min, safeStep), min, safeMax)
    setValue(snappedValue)
  }

  return (
    <section className="slider-field" aria-label={label}>
      <span className="slider-label">{label}</span>
      <div className="slider-pill">
        <div
          ref={trackRef}
          className="slider-track"
          role="slider"
          tabIndex={0}
          aria-valuemin={min}
          aria-valuemax={safeMax}
          aria-valuenow={safeValue}
          aria-valuetext={valueText}
          aria-label={label}
          onPointerDown={(event) => {
            event.preventDefault()
            event.currentTarget.setPointerCapture(event.pointerId)
            updateValueFromX(event.clientX)
          }}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
              return
            }
            updateValueFromX(event.clientX)
          }}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId)
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
              event.preventDefault()
              setValue(clamp(safeValue - safeStep, min, safeMax))
            } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
              event.preventDefault()
              setValue(clamp(safeValue + safeStep, min, safeMax))
            } else if (event.key === 'Home') {
              event.preventDefault()
              setValue(min)
            } else if (event.key === 'End') {
              event.preventDefault()
              setValue(safeMax)
            }
          }}
        >
          <span className="slider-fill" />
          <span
            ref={thumbRef}
            className="slider-thumb"
            style={{ left: `${percentage}%`, transform: `translateX(-${percentage}%)` }}
          >
            <span className="slider-thumb-logo" aria-hidden="true">
              <Logo />
            </span>
          </span>
        </div>
      </div>
      <div className="slider-header">
        <span>{min}</span>
        <strong>{valueText}</strong>
        <span>{safeMax}</span>
      </div>
    </section>
  )
}
