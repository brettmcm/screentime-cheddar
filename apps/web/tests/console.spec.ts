import { expect, test } from '@playwright/test'
import { screens, settle, sheets } from './routes'

for (const route of [...screens, ...sheets]) {
  test(`${route.name} logs nothing to the console`, async ({ page }) => {
    const problems: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') {
        problems.push(`${message.type()}: ${message.text()}`)
      }
    })
    page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`))
    // A demo image that 404s still renders as a broken tile, so catch it here.
    page.on('response', (response) => {
      if (response.status() >= 400) problems.push(`${response.status()}: ${response.url()}`)
    })

    await route.open(page)
    await settle(page)

    expect(problems).toEqual([])
  })
}
