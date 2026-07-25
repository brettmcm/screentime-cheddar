import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { enterApp, screens, settle, sheets } from './routes'

for (const route of [...screens, ...sheets]) {
  test(`${route.name} has no accessibility violations`, async ({ page }) => {
    await route.open(page)
    await settle(page)

    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    // Report the offending node, not just the rule, so a failure is actionable.
    const failures = violations.flatMap((violation) =>
      violation.nodes.map((node) => `${violation.id} ${node.target.join(' ')} — ${node.failureSummary}`),
    )
    expect(failures).toEqual([])
  })
}

test.describe('keyboard', () => {
  test('reaches every nav destination with Tab', async ({ page }) => {
    await enterApp(page)
    const nav = page.getByRole('navigation', { name: 'Primary' })

    const reachable: string[] = []
    for (let press = 0; press < 60; press += 1) {
      await page.keyboard.press('Tab')
      const label = await page.evaluate(() => {
        const active = document.activeElement
        if (!active?.closest('nav[aria-label="Primary"]')) return null
        return active.getAttribute('aria-label')
      })
      if (label && !reachable.includes(label)) reachable.push(label)
      if (reachable.length === 5) break
    }

    // v1.1.0's roving tabIndex left four of the five out of the tab order.
    expect(reachable.sort()).toEqual(['Add goal', 'Home', 'Learn', 'Profile', 'Wallet'])
    await expect(nav).toBeVisible()
  })

  test('moves between nav items with the arrow keys', async ({ page }) => {
    await enterApp(page)
    await page.getByRole('button', { name: 'Home', exact: true }).focus()

    await page.keyboard.press('ArrowRight')

    await expect(page.getByRole('button', { name: 'Wallet' })).toBeFocused()
  })

  test('activates a goal with Enter', async ({ page }) => {
    await enterApp(page)
    await page.getByRole('button', { name: /^Headphones,/ }).focus()

    await page.keyboard.press('Enter')

    await expect(page.getByRole('heading', { name: 'Headphones' })).toBeVisible()
  })

  test('traps focus in a sheet and restores it on close', async ({ page }) => {
    await enterApp(page)
    const trigger = page.getByRole('button', { name: 'Deposit' })
    await trigger.click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Tab all the way round; focus must never leave the sheet.
    for (let press = 0; press < 30; press += 1) {
      await page.keyboard.press('Tab')
      const inside = await page.evaluate(() => Boolean(document.activeElement?.closest('.sheet')))
      expect(inside).toBe(true)
    }

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('closes a sheet with Escape', async ({ page }) => {
    await enterApp(page)
    await page.getByRole('button', { name: 'Transfer' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.keyboard.press('Escape')

    await expect(page.getByRole('dialog')).toBeHidden()
  })
})

test('the toast message is legible against its own pill', async ({ page }) => {
  await enterApp(page)
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('button', { name: 'Profile' }).click()
  await page.getByRole('button', { name: 'Notifications' }).click()

  const toast = page.locator('.toast')
  await expect(toast).toBeVisible()
  const { color, background } = await toast.evaluate((node) => {
    const style = getComputedStyle(node)
    return { color: style.color, background: style.backgroundColor }
  })
  expect(color).not.toBe(background)
})
