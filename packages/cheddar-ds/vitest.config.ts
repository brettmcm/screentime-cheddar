import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Component tests run in jsdom. Screenshot tests are a separate Playwright
// suite (playwright.config.ts) because they need a real engine to resolve
// color-mix() and the branded appearance layer.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/**/*.a11y.test.{ts,tsx}'],
        },
      },
      {
        extends: true,
        test: {
          name: 'a11y',
          include: ['src/**/*.a11y.test.{ts,tsx}'],
        },
      },
    ],
  },
})
