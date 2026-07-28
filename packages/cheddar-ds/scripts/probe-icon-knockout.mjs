/**
 * A two-tone icon knocks its counter shape out in the colour of whatever is painted
 * behind it. This walks every two-tone glyph in the gallery, resolves the nearest
 * opaque background above it, and reports the ones whose knockout does not match —
 * those are the containers still missing `--cds-icon-knockout`.
 */
import { chromium } from 'playwright'

const BASE = process.env.PROBE_URL ?? 'http://localhost:5173'
const THEMES = [
  ['light', 'surface'],
  ['dark', 'surface'],
  ['light', 'brand'],
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 2000 } })
await page.goto(BASE, { waitUntil: 'networkidle' })

const findings = new Map()

for (const [theme, appearance] of THEMES) {
  await page.evaluate(
    ([t, a]) => {
      const root = document.documentElement
      root.setAttribute('data-theme', t)
      root.setAttribute('data-appearance', a)
      document.querySelectorAll('[data-appearance]').forEach((n) => {
        if (n !== root) n.setAttribute('data-appearance', a)
      })
    },
    [theme, appearance]
  )

  const rows = await page.evaluate(() => {
    const opaque = (colour) => {
      if (!colour || colour === 'transparent') return false
      const parts = colour.match(/[\d.]+/g)
      return !(parts && parts.length > 3 && Number(parts[3]) === 0)
    }

    /** The colour actually painted behind `node`. */
    function backdrop(node) {
      for (let el = node.parentElement; el; el = el.parentElement) {
        const bg = getComputedStyle(el).backgroundColor
        if (opaque(bg)) return { colour: bg, from: el.className || el.tagName }
      }
      return { colour: 'rgb(255, 255, 255)', from: 'page' }
    }

    const out = []
    // Only the mono tone knocks out; the brand tone paints its second colour on
    // purpose. In mono the glyph is currentColor, so any other fill is the counter.
    for (const svg of document.querySelectorAll('svg[data-tone="mono"]')) {
      const glyph = getComputedStyle(svg).color
      const fills = [...svg.querySelectorAll('path')].map((p) => getComputedStyle(p).fill)
      const counter = fills.find((f) => f !== glyph && f !== 'none')
      if (!counter) continue
      const host = svg.closest('[class]')
      const behind = backdrop(svg)
      out.push({
        host: host?.className ?? 'unknown',
        counter,
        behind: behind.colour,
        behindFrom: String(behind.from),
        ok: counter === behind.colour,
      })
    }
    return out
  })

  for (const row of rows) {
    if (row.ok) continue
    const key = `${row.host}||${row.counter}||${row.behind}`
    if (!findings.has(key)) findings.set(key, { ...row, modes: [] })
    findings.get(key).modes.push(`${theme}/${appearance}`)
  }
}

await browser.close()

if (findings.size === 0) {
  console.log('every two-tone icon knocks out in its own backdrop colour')
  process.exit(0)
}

console.log(
  `${findings.size} mismatched two-tone icon${findings.size === 1 ? '' : 's'}:\n`
)
for (const f of findings.values()) {
  console.log(`  host      ${f.host}`)
  console.log(`  knockout  ${f.counter}`)
  console.log(`  backdrop  ${f.behind}   (painted by ${f.behindFrom})`)
  console.log(`  modes     ${f.modes.join(', ')}\n`)
}
process.exit(1)
