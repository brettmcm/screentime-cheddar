import { describe, expect, it, vi } from 'vitest'
import { amountValue, clampPercent, formatAmount, splitAmount } from './formatAmount'

describe('formatAmount', () => {
  it.each([
    [0, '$0.00'],
    [1, '$1.00'],
    [42.5, '$42.50'],
    [1234.56, '$1,234.56'],
    [1000000, '$1,000,000.00'],
  ])('formats %d as USD', (value, expected) => {
    expect(formatAmount(value)).toBe(expected)
  })

  it.each([
    [1.005, '$1.01'],
    [1.004, '$1.00'],
    [0.999, '$1.00'],
    [1.0049999, '$1.00'],
  ])('rounds %d to the nearest cent', (value, expected) => {
    expect(formatAmount(value)).toBe(expected)
  })

  it.each([
    [-5, '-$5.00'],
    [-1234.56, '-$1,234.56'],
  ])('formats the negative amount %d', (value, expected) => {
    expect(formatAmount(value)).toBe(expected)
  })

  it('renders a string amount verbatim', () => {
    expect(formatAmount('Coming soon')).toBe('Coming soon')
  })

  it('leaves a pre-formatted string untouched', () => {
    expect(formatAmount('£12.30')).toBe('£12.30')
  })

  it('returns an empty string for a non-finite amount', () => {
    expect(formatAmount(Number.NaN)).toBe('')
    expect(formatAmount(Number.POSITIVE_INFINITY)).toBe('')
  })

  it('uses a custom formatter for numbers', () => {
    const format = vi.fn((value: number) => `${value} credits`)

    expect(formatAmount(12, format)).toBe('12 credits')
    expect(format).toHaveBeenCalledExactlyOnceWith(12)
  })

  it('does not reach for the custom formatter with a string amount', () => {
    const format = vi.fn((value: number) => `${value} credits`)

    expect(formatAmount('Coming soon', format)).toBe('Coming soon')
    expect(format).not.toHaveBeenCalled()
  })
})

describe('amountValue', () => {
  it.each([
    [12, 12],
    [0, 0],
    [-4.5, -4.5],
  ])('passes the finite number %d through', (value, expected) => {
    expect(amountValue(value)).toBe(expected)
  })

  it.each([['$12.00'], [undefined], [Number.NaN], [Number.POSITIVE_INFINITY]])(
    'reports no numeric value for %s',
    (value) => {
      expect(amountValue(value)).toBeUndefined()
    },
  )
})

describe('splitAmount', () => {
  it.each([
    ['$1,234.56', '$1,234', '.56'],
    ['$0.00', '$0', '.00'],
    ['-$5.00', '-$5', '.00'],
    ['12,30 €', '12', ',30 €'],
  ])('splits %s into its major and minor parts', (formatted, major, minor) => {
    expect(splitAmount(formatted)).toEqual({ major, minor })
  })

  it.each([['Coming soon'], ['$1,234'], ['$1.2']])(
    'leaves %s whole when there is no minor unit',
    (formatted) => {
      expect(splitAmount(formatted)).toEqual({ major: formatted })
    },
  )
})

describe('clampPercent', () => {
  it.each([
    [0, 0],
    [50, 50],
    [100, 100],
    [-10, 0],
    [140, 100],
  ])('clamps %d to %d', (value, expected) => {
    expect(clampPercent(value)).toBe(expected)
  })

  it('treats a non-finite percentage as zero', () => {
    expect(clampPercent(Number.NaN)).toBe(0)
  })
})
