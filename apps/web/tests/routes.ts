import type { Page } from '@playwright/test'

/**
 * The app has no URL routing — every screen is reached by driving the UI, so each
 * route is described as the clicks that open it.
 */
export type Route = {
  name: string
  open: (page: Page) => Promise<void>
}

const nav = (page: Page) => page.getByRole('navigation', { name: 'Primary' })

export const enterApp = async (page: Page) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Sign in' }).click()
}

const openTab = (label: string) => async (page: Page) => {
  await enterApp(page)
  await nav(page).getByRole('button', { name: label }).click()
}

export const screens: Route[] = [
  { name: 'landing', open: (page) => page.goto('/').then(() => undefined) },
  { name: 'home', open: enterApp },
  { name: 'savings', open: openTab('Wallet') },
  { name: 'learn', open: openTab('Learn') },
  { name: 'profile', open: openTab('Profile') },
  {
    name: 'learn-article',
    open: async (page) => {
      await openTab('Learn')(page)
      await page.getByRole('button', { name: 'Savings 101' }).click()
    },
  },
  {
    name: 'add-goal-details',
    open: async (page) => {
      await enterApp(page)
      await nav(page).getByRole('button', { name: 'Add goal' }).click()
    },
  },
  {
    name: 'add-goal-amount',
    open: async (page) => {
      await enterApp(page)
      await nav(page).getByRole('button', { name: 'Add goal' }).click()
      await page.getByLabel('Goal name').fill('Guitar')
      await page.getByRole('button', { name: 'Next: Set amount' }).click()
    },
  },
  {
    name: 'goal-detail',
    open: async (page) => {
      await enterApp(page)
      await page.getByRole('button', { name: /^Headphones,/ }).click()
    },
  },
  {
    name: 'goal-reached',
    open: async (page) => {
      await enterApp(page)
      await page.getByRole('button', { name: /^Sneakers,/ }).click()
      await page.getByRole('button', { name: 'Deposit' }).click()
      await numberPad(page, '20')
      await page.getByRole('button', { name: 'Confirm deposit' }).click()
      await page.getByRole('heading', { name: 'Goal Reached' }).waitFor()
    },
  },
  {
    name: 'theme-settings',
    open: async (page) => {
      await openTab('Profile')(page)
      await page.getByRole('button', { name: 'Theme settings' }).click()
    },
  },
  {
    name: 'theme-settings-light',
    open: async (page) => {
      await openTab('Profile')(page)
      await page.getByRole('button', { name: 'Theme settings' }).click()
      await chooseRadio(page, 'Light')
    },
  },
  {
    // Light mode has to hold up on a real screen, not just in the picker.
    name: 'home-light',
    open: async (page) => {
      await openTab('Profile')(page)
      await page.getByRole('button', { name: 'Theme settings' }).click()
      await chooseRadio(page, 'Light')
      await page.getByRole('button', { name: 'Back' }).click()
      await nav(page).getByRole('button', { name: 'Home' }).click()
    },
  },
]

export const sheets: Route[] = [
  {
    name: 'sheet-deposit',
    open: async (page) => {
      await enterApp(page)
      await page.getByRole('button', { name: 'Deposit' }).click()
      await page.getByRole('dialog').waitFor()
    },
  },
  {
    name: 'sheet-transfer',
    open: async (page) => {
      await enterApp(page)
      await page.getByRole('button', { name: 'Transfer' }).click()
      await page.getByRole('dialog').waitFor()
    },
  },
  {
    // Opened from a goal, so the source is preselected.
    name: 'sheet-transfer-from-goal',
    open: async (page) => {
      await enterApp(page)
      await page.getByRole('button', { name: /^Headphones,/ }).click()
      await page.getByRole('button', { name: 'Transfer' }).click()
      await page.getByRole('dialog').waitFor()
    },
  },
  {
    name: 'sheet-edit-profile',
    open: async (page) => {
      await openTab('Profile')(page)
      await page.getByRole('button', { name: 'Edit' }).click()
      await page.getByRole('dialog').waitFor()
    },
  },
  {
    // Sheets portal outside the themed frame, so light mode has to reach them.
    name: 'sheet-deposit-light',
    open: async (page) => {
      await openTab('Profile')(page)
      await page.getByRole('button', { name: 'Theme settings' }).click()
      await chooseRadio(page, 'Light')
      await page.getByRole('button', { name: 'Back' }).click()
      await nav(page).getByRole('button', { name: 'Home' }).click()
      await page.getByRole('button', { name: 'Deposit' }).click()
      await page.getByRole('dialog').waitFor()
    },
  },
]

/**
 * The DS keeps the real `input` visually hidden under the label it renders, so a
 * click lands on the label the way it would for a person using the app.
 */
export async function chooseRadio(page: Page, label: string) {
  const radio = page.getByRole('radio', { name: label })
  await page.locator('label').filter({ has: radio }).click()
}

export async function numberPad(page: Page, amount: string) {
  const pad = page.getByRole('group', { name: 'Amount' })
  for (const character of amount) {
    const name = character === '.' ? 'Decimal point' : character
    await pad.getByRole('button', { name, exact: true }).click()
  }
}

/** Screenshots must not race the demo imagery, the webfonts, or a live toast. */
export async function settle(page: Page) {
  await page.waitForLoadState('networkidle')
  // A toast self-dismisses on a timer, so capturing one bakes a race into the
  // baseline. Absent toasts are already detached and resolve immediately.
  await page.locator('.toast').waitFor({ state: 'detached' })
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() =>
    Promise.all(
      Array.from(document.images)
        .filter((image) => !image.complete)
        .map(
          (image) =>
            new Promise((resolve) => {
              image.addEventListener('load', resolve, { once: true })
              image.addEventListener('error', resolve, { once: true })
            }),
        ),
    ),
  )
}
