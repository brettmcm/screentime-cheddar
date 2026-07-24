import { expect, test } from '@playwright/test'
import { gotoGallery, section, sectionIds } from './gallery'

test('every section renders, with no console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })
  page.on('pageerror', (error) => {
    errors.push(error.message)
  })

  await gotoGallery(page)

  for (const id of sectionIds) {
    await expect(section(page, id), `section ${id} is missing`).toBeVisible()
  }

  expect(errors).toEqual([])
})

test('the URL pins the theming axes', async ({ page }) => {
  await gotoGallery(page, { brand: 'green', scheme: 'dark', appearance: 'brand' })

  await expect(page.locator('html')).toHaveAttribute('data-brand', 'green')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  // `appearance` is scoped to each section's specimen canvas, not the root.
  await expect(section(page, 'cards').locator('.ds-specimen').first()).toHaveAttribute(
    'data-appearance',
    'brand',
  )
})
