/**
 * Measures the handful of values this round of Figma parity work targeted, in a
 * real browser, so the numbers can be diffed against the design rather than
 * inferred from the stylesheet. Run against a dev server: node scripts/probe-figma-parity.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.PROBE_URL ?? 'http://localhost:5173'

const results = []
function check(label, actual, expected) {
  const ok = String(actual) === String(expected)
  results.push({ label, actual, expected, ok })
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)

// --- header chevron: 24x24 tap area, ~6.6x14.4 glyph -----------------------
const chevron = await page.evaluate(() => {
  const btn = document.querySelector('.page-header-back')
  const svg = btn?.querySelector('svg')
  if (!btn || !svg) return null
  const b = btn.getBoundingClientRect()
  const s = svg.getBoundingClientRect()
  // The path bbox is the ink; the svg box carries half a stroke on each side.
  const ink = svg.querySelector('path').getBBox()
  const scale = s.width / svg.viewBox.baseVal.width
  return {
    tap: [Math.round(b.width), Math.round(b.height)],
    svg: [+s.width.toFixed(2), +s.height.toFixed(2)],
    ink: [+(ink.width * scale).toFixed(1), +(ink.height * scale).toFixed(1)],
    stroke: +(3 * scale).toFixed(2),
  }
})
check('back button tap area', chevron?.tap.join('x'), '24x24')
check('back chevron ink w', chevron?.ink[0], 6.6)
check('back chevron ink h', chevron?.ink[1], 14.4)
check('back chevron stroke', chevron?.stroke, 3)

// --- total savings card: label, border and icon share one colour ----------
const savings = await page.evaluate(() => {
  const card = document.querySelector('.total-savings-card')
  if (!card) return null
  const btn = card.querySelector('.total-savings-card-action')
  const twoTone = btn?.querySelectorAll('svg path')
  const cs = getComputedStyle(card)
  const bs = getComputedStyle(btn)
  return {
    cardBg: cs.backgroundColor,
    cardFg: cs.color,
    btnBorder: bs.borderTopColor,
    btnFg: bs.color,
    btnWeight: bs.fontWeight,
    iconPrimary: twoTone?.[0] ? getComputedStyle(twoTone[0]).fill : null,
    iconKnockout: twoTone?.[1] ? getComputedStyle(twoTone[1]).fill : null,
    centsSize: getComputedStyle(card.querySelector('.total-savings-card-cents')).fontSize,
  }
})
check('card fg == button label', savings?.cardFg, savings?.btnFg)
check('button border == label', savings?.btnBorder, savings?.btnFg)
check('icon glyph == label', savings?.iconPrimary, savings?.btnFg)
check('icon knockout == card bg', savings?.iconKnockout, savings?.cardBg)
check('button label weight', savings?.btnWeight, '500')
check('cents size', savings?.centsSize, '48px')

// --- display tracking ------------------------------------------------------
const tracking = await page.evaluate(() => {
  const el = document.querySelector('.total-savings-card-amount')
  const cents = document.querySelector('.total-savings-card-cents')
  const px = (n) => +getComputedStyle(n).letterSpacing.replace('px', '')
  return {
    large: [+getComputedStyle(el).fontSize.replace('px', ''), px(el)],
    medium: [+getComputedStyle(cents).fontSize.replace('px', ''), px(cents)],
  }
})
check('display-large tracking @64px', tracking?.large.join(' -> '), '64 -> -2.56')
check('display-medium tracking @48px', tracking?.medium.join(' -> '), '48 -> -1.44')

// --- notification spacing --------------------------------------------------
const notif = await page.evaluate(() => {
  const n = document.querySelector('.notification')
  if (!n) return null
  const header = n.querySelector('.notif-header')
  const link = n.querySelector('.notif-link')
  const dismiss = n.querySelector('.notif-header .icon-btn')
  const cs = getComputedStyle(n)
  return {
    padding: cs.padding,
    radius: cs.borderTopLeftRadius,
    rootGap: cs.gap,
    illo: getComputedStyle(n.querySelector('.notif-illustration')).width,
    headerGap: getComputedStyle(header).gap,
    headerMinHeight: getComputedStyle(header).minHeight,
    bodyGap: getComputedStyle(n.querySelector('.notif-body')).gap,
    linkGap: getComputedStyle(link).gap,
    linkMarginTop: getComputedStyle(link).marginTop,
    dismiss: dismiss ? `${Math.round(dismiss.getBoundingClientRect().width)}` : null,
  }
})
const dismissSize = await page.evaluate(() => {
  const btn = document.querySelector('.notification .icon-btn-neutral-small')
  if (!btn) return null
  const r = btn.getBoundingClientRect()
  const glyph = btn.querySelector('svg').getBoundingClientRect()
  return `${Math.round(r.width)}x${Math.round(r.height)} glyph ${Math.round(glyph.width)}`
})
check('notification padding', notif?.padding, '16px')
check('notification radius', notif?.radius, '24px')
check('notification root gap', notif?.rootGap, '8px')
check('notification illustration', notif?.illo, '80px')
check('notification header gap', notif?.headerGap, '16px')
check('notification header min-h', notif?.headerMinHeight, '24px')
check('notification body gap', notif?.bodyGap, '2px')
check('notification link gap', notif?.linkGap, '8px')
check('notification link margin', notif?.linkMarginTop, '0px')
check('notification dismiss size', dismissSize, '24x24 glyph 16')

// --- the same card pairing, forced to light -------------------------------
const light = await page.evaluate(() => {
  const card = document.querySelector('.total-savings-card')
  const host = card.closest('[data-appearance], [data-theme]') ?? document.documentElement
  const prev = [host.getAttribute('data-appearance'), host.getAttribute('data-theme')]
  host.setAttribute('data-appearance', 'surface')
  host.setAttribute('data-theme', 'light')
  const cs = getComputedStyle(card)
  const out = { bg: cs.backgroundColor, fg: cs.color }
  if (prev[0] === null) host.removeAttribute('data-appearance')
  else host.setAttribute('data-appearance', prev[0])
  if (prev[1] === null) host.removeAttribute('data-theme')
  else host.setAttribute('data-theme', prev[1])
  return out
})
check('light card background', light?.bg, 'rgb(100, 0, 45)')
check('light card foreground', light?.fg, 'rgb(255, 145, 242)')

// --- input field in dark mode ---------------------------------------------
await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'))
const input = await page.evaluate(() => {
  const shell = document.querySelector('.input-shell')
  const field = shell?.querySelector('input')
  if (!shell || !field) return null
  return {
    bg: getComputedStyle(shell).backgroundColor,
    fg: getComputedStyle(field).color,
  }
})
check('dark input background', input?.bg, 'rgb(100, 0, 45)')
check('dark input text', input?.fg, 'rgb(255, 255, 255)')

await browser.close()

const pad = Math.max(...results.map((r) => r.label.length))
for (const r of results) {
  const mark = r.ok ? 'ok  ' : 'FAIL'
  const detail = r.ok ? r.actual : `${r.actual}  (expected ${r.expected})`
  console.log(`${mark} ${r.label.padEnd(pad)}  ${detail}`)
}
const failed = results.filter((r) => !r.ok).length
console.log(`\n${results.length - failed}/${results.length} matched`)
process.exit(failed ? 1 : 0)
