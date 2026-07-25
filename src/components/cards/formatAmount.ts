/**
 * Money helpers shared by the card components.
 *
 * Cards accept money as `string | number`. A number is formatted with
 * `Intl.NumberFormat` (USD by default, or the caller's `formatAmount`); a
 * string is rendered verbatim so consumers can pass pre-formatted or
 * non-currency copy.
 */

export type Money = string | number

export type AmountFormatter = (value: number) => string

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatAmount(value: Money, format?: AmountFormatter): string {
  if (typeof value === 'string') {
    return value
  }

  if (!Number.isFinite(value)) {
    return ''
  }

  return format ? format(value) : usd.format(value)
}

/**
 * The numeric value behind a money prop, or `undefined` when the caller
 * passed opaque display text. Used to derive progress, remainders and totals
 * only when every input is a number.
 */
export function amountValue(value: Money | undefined): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

/**
 * Split a formatted amount into its major part and its trailing minor unit,
 * so the cents can be rendered smaller and raised.
 */
export function splitAmount(formatted: string): { major: string; minor?: string } {
  const match = /^(.*\d)([.,]\d{2})(\D*)$/.exec(formatted)

  if (!match) {
    return { major: formatted }
  }

  return { major: match[1], minor: `${match[2]}${match[3]}` }
}

export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(100, Math.max(0, value))
}
