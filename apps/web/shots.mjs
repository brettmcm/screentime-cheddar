import { chromium } from 'playwright'

// Usage: node shots.mjs <outDir> <name[:bottom]|clicks…>
// Each argument is `name` plus optional `|`-separated button labels to click first,
// and an optional `:bottom` suffix to scroll the screen column to its end.
const [, , outDir, ...steps] = process.argv

const browser = await chromium.launch()

for (const step of steps) {
  const page = await browser.newPage({
    viewport: { width: 402, height: 874 },
    deviceScaleFactor: 3,
  })
  await page.goto('http://localhost:5173/')
  await page.waitForTimeout(1000)

  const [head, ...actions] = step.split('|')
  const [name, scroll] = head.split(':')
  for (const action of actions) {
    if (!action) continue
    await page.getByRole('button', { name: action, exact: true }).first().click()
    await page.waitForTimeout(500)
  }
  if (scroll === 'bottom') {
    // Twice, with the images settled in between: the illustrations decode late, and a column
    // that grows after the scroll leaves the shot short of the end.
    await page.evaluate(() =>
      Promise.all(Array.from(document.images, (image) => image.decode().catch(() => {}))),
    )
    for (let attempt = 0; attempt < 2; attempt += 1) {
      await page.evaluate(() => {
        const el = document.querySelector('.screen-scroll')
        if (el) el.scrollTop = el.scrollHeight
      })
      await page.waitForTimeout(400)
    }
  }
  await page.screenshot({ path: `${outDir}/web-${name}${scroll ? `-${scroll}` : ''}.png` })
  await page.close()
}

await browser.close()
