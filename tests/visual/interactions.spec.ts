import { expect, test } from '@playwright/test'
import { gotoGallery, section, settle } from './gallery'

/**
 * States that only exist after an interaction, so no static section baseline
 * would ever cover them.
 */

test('focused button shows the focus ring', async ({ page }) => {
  await gotoGallery(page)

  // The ring is a box-shadow that paints outside the control's own box, so the
  // screenshot has to be of the enclosing specimen rather than the button.
  const specimen = page
    .locator('article.ds-variant-card')
    .filter({ has: page.locator('#focus-button') })

  await specimen.scrollIntoViewIfNeeded()
  await page.locator('#focus-button').focus()

  await expect(page.locator('#focus-button')).toBeFocused()
  await expect(specimen).toHaveScreenshot('interaction-focus-button.png')
})

test('focused input shows the focus ring', async ({ page }) => {
  await gotoGallery(page)

  const specimen = page
    .locator('article.ds-variant-card')
    .filter({ has: page.locator('#focus-input') })

  await specimen.scrollIntoViewIfNeeded()
  await page.locator('#focus-input').focus()

  await expect(page.locator('#focus-input')).toBeFocused()
  await expect(specimen).toHaveScreenshot('interaction-focus-input.png')
})

test('sheet renders open', async ({ page }) => {
  await gotoGallery(page)

  await page.locator('#open-sheet').click()

  // Sheet portals to document.body, so it is outside its gallery section.
  const sheet = page.locator('.sheet')
  await expect(sheet).toBeVisible()
  await settle(page)

  await expect(sheet).toHaveScreenshot('interaction-sheet-open.png')
})

test('nav reflects the selected item', async ({ page }) => {
  await gotoGallery(page)

  const nav = section(page, 'nav')
  await nav.getByRole('button', { name: 'Wallet' }).first().click()

  await expect(nav.getByRole('status')).toHaveText(/Selected item: wallet/)
  await expect(nav).toHaveScreenshot('interaction-nav-selected.png')
})

test('number pad drives the amount', async ({ page }) => {
  await gotoGallery(page)

  const numberPad = section(page, 'number-pad')
  await numberPad.getByRole('button', { name: 'Delete' }).first().click()
  await numberPad.getByRole('button', { name: '7', exact: true }).first().click()

  await expect(numberPad.getByRole('status')).toHaveText(/Last key pressed: 7/)
  await expect(numberPad).toHaveScreenshot('interaction-number-pad.png')
})
