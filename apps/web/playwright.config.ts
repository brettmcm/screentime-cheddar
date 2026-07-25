import { defineConfig, devices } from '@playwright/test'

/** Every screen is reviewed against the Figma App Flow at this exact size. */
export const VIEWPORT = { width: 430, height: 932 }

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  expect: {
    // 0.2% of this viewport is ~3000 pixels, enough to hide a whole icon or a
    // toast message going blank. This is loose enough for font rasterisation only.
    toHaveScreenshot: { maxDiffPixelRatio: 0.0002, threshold: 0.2 },
  },
  use: {
    baseURL: 'http://localhost:4173',
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: VIEWPORT } }],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
