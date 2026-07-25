import type { Ref } from 'react'
import { useEffect, useRef } from 'react'
import { Logo } from '../brand/Brand'
import { classNames } from '../utils/classNames'
import { useControllableState } from '../utils/useControllableState'

export type SliderProps = {
  label?: string
  min?: number
  max?: number
  value?: number
  defaultValue?: number
  step?: number
  onValueChange?: (value: number) => void
  /** Fires once when the value reaches `completeAt`. */
  onComplete?: () => void
  /**
   * Value that counts as complete.
   * @default max
   */
  completeAt?: number
  /**
   * Defer `onComplete` to pointer/key release rather than firing mid-gesture.
   * @default true
   */
  completeOnRelease?: boolean
  /** Snap to `max` once complete. */
  snapOnComplete?: boolean
  /** Overrides the default `$x.xx` formatting. */
  formatValue?: (value: number) => string
  /** @default true */
  showValue?: boolean
  disabled?: boolean
  className?: string
  ref?: Ref<HTMLElement>
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
  onComplete,
  completeAt,
  completeOnRelease = true,
  snapOnComplete = false,
  formatValue,
  showValue = true,
  disabled = false,
  className,
  ref,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLSpanElement>(null)
  const completedRef = useRef(false)
  const keyGestureRef = useRef(false)
  const safeMax = Math.max(max, min + 1)
  const safeStep = step > 0 ? step : 1
  const { currentValue, setValue } = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const safeValue = clamp(roundToStep(currentValue, min, safeStep), min, safeMax)
  const percentage = ((safeValue - min) / (safeMax - min)) * 100
  const valueText = formatValue ? formatValue(safeValue) : `$${safeValue.toFixed(2)}`
  const threshold = clamp(completeAt ?? safeMax, min, safeMax)
  const latestValueRef = useRef(safeValue)

  useEffect(() => {
    latestValueRef.current = safeValue
    if (safeValue < threshold) {
      completedRef.current = false
    }
  }, [safeValue, threshold])

  const fireComplete = (candidate: number) => {
    if (disabled || completedRef.current || candidate < threshold) {
      return
    }
    completedRef.current = true
    if (snapOnComplete && candidate !== safeMax) {
      latestValueRef.current = safeMax
      setValue(safeMax)
    }
    onComplete?.()
  }

  const commitValue = (next: number) => {
    if (disabled) {
      return
    }
    if (next < threshold) {
      completedRef.current = false
    }
    latestValueRef.current = next
    setValue(next)
    if (!completeOnRelease) {
      fireComplete(next)
    }
  }

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
    commitValue(snappedValue)
  }

  return (
    <section
      ref={ref}
      className={classNames('slider-field', disabled && 'slider-field-disabled', className)}
      aria-label={label}
    >
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
          aria-disabled={disabled || undefined}
          onPointerDown={(event) => {
            if (disabled) {
              return
            }
            event.preventDefault()
            event.currentTarget.setPointerCapture(event.pointerId)
            updateValueFromX(event.clientX)
          }}
          onPointerMove={(event) => {
            if (disabled || !event.currentTarget.hasPointerCapture(event.pointerId)) {
              return
            }
            updateValueFromX(event.clientX)
          }}
          onPointerUp={(event) => {
            const wasDragging = event.currentTarget.hasPointerCapture(event.pointerId)
            if (wasDragging) {
              event.currentTarget.releasePointerCapture(event.pointerId)
            }
            if (wasDragging && completeOnRelease) {
              fireComplete(latestValueRef.current)
            }
          }}
          onKeyDown={(event) => {
            if (disabled) {
              return
            }
            if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
              event.preventDefault()
              commitValue(clamp(safeValue - safeStep, min, safeMax))
            } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
              event.preventDefault()
              commitValue(clamp(safeValue + safeStep, min, safeMax))
            } else if (event.key === 'Home') {
              event.preventDefault()
              commitValue(min)
            } else if (event.key === 'End') {
              event.preventDefault()
              commitValue(safeMax)
            } else {
              return
            }
            keyGestureRef.current = true
          }}
          onKeyUp={() => {
            if (!keyGestureRef.current) {
              return
            }
            keyGestureRef.current = false
            if (completeOnRelease) {
              fireComplete(latestValueRef.current)
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
        {showValue ? <strong>{valueText}</strong> : null}
        <span>{safeMax}</span>
      </div>
    </section>
  )
}
