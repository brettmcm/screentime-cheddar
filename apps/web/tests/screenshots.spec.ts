import { expect, test } from '@playwright/test'
import { chooseRadio, screens, settle, sheets } from './routes'

for (const route of [...screens, ...sheets]) {
  test(`${route.name} matches its baseline`, async ({ page }) => {
    await route.open(page)
    await settle(page)
    await expect(page).toHaveScreenshot(`${route.name}.png`, { fullPage: false })
  })
}

test('every brand renders the Home screen', async ({ page }) => {
  for (const brand of ['blue', 'green', 'purple'] as const) {
    await page.goto('/')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('button', { name: 'Profile' }).click()
    await page.getByRole('button', { name: 'Theme settings' }).click()
    await chooseRadio(page, brandLabel(brand))
    await expect(page.getByRole('radio', { name: brandLabel(brand) })).toBeChecked()
    await page.getByRole('button', { name: 'Back' }).click()
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('button', { name: 'Home' }).click()
    await settle(page)
    await expect(page).toHaveScreenshot(`home-${brand}.png`)
  }
})

function brandLabel(brand: 'blue' | 'green' | 'purple') {
  return brand.charAt(0).toUpperCase() + brand.slice(1)
}
