import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  snapshotDir: 'e2e/snapshots',
  snapshotPathTemplate: '{snapshotDir}/{arg}-{projectName}-{platform}{ext}',
  fullyParallel: true,
  reporter: 'html',
  retries: 0, // important to keep at 0 as we are expecting "failures" for changed snapshots and don't want to produce multiple change snapshots for each retry
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    port: 5173,
    reuseExistingServer: true,
  },
})
