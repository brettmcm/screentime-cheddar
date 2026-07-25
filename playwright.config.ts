import { defineConfig, devices } from '@playwright/test'

// Screenshot coverage runs against the gallery (`npm run dev`) in a real engine.
// jsdom cannot resolve color-mix() or the [data-appearance] cascade, so visual
// regressions in the token layer are only catchable here.
export default defineConfig({
  testDir: './tests/visual',
  outputDir: './tests/visual/.output',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  expect: {
    toHaveScreenshot: {
      // `threshold` is the knob for cross-machine font rasterisation: it forgives a
      // per-pixel colour distance, which is exactly what anti-aliasing produces.
      // `maxDiffPixelRatio` forgives *arbitrarily* different pixels up to a share of
      // the image, so the 0.02 it used to hold let a focus ring change from blue to
      // magenta pass unnoticed — 1.6% of a small specimen. Keep the ratio tight and
      // let `threshold` absorb the noise it was actually aimed at.
      threshold: 0.2,
      maxDiffPixelRatio: 0.002,
      animations: 'disabled',
    },
  },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
  ],
  webServer: {
    // --host is explicit because Vite otherwise binds `localhost`, which resolves
    // to ::1 on macOS while the readiness probe below is IPv4 — the server comes
    // up fine and Playwright still times out waiting for it.
    command: 'npm run dev -- --port 4173 --strictPort --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
