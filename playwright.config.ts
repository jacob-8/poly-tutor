import { defineConfig, devices } from '@playwright/test'

const localDev = defineConfig({
  webServer: {
    command: 'pnpm run build && pnpm run preview', // in case doing service worker testing
    port: 4173
  },
})

export default defineConfig({
  testDir: 'e2e',
  snapshotDir: 'src',
  snapshotPathTemplate: '{snapshotDir}/{arg}-{projectName}-{platform}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  ...(!process.env.PLAYWRIGHT_BASE_URL && localDev),
})

