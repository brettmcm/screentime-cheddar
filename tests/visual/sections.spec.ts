import { expect, test } from '@playwright/test'
import { gotoGallery, section, sectionIds } from './gallery'

/**
 * One baseline per gallery section, at the default theme.
 *
 * These are locator screenshots rather than full-page ones on purpose: a
 * change to the Button section should invalidate one baseline, not all 25.
 */
test.describe('gallery sections', () => {
  for (const id of sectionIds) {
    test(`section: ${id}`, async ({ page }) => {
      await gotoGallery(page)

      const target = section(page, id)
      await expect(target).toBeVisible()
      await expect(target).toHaveScreenshot(`section-${id}.png`)
    })
  }
})
