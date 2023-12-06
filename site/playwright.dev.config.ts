import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  snapshotDir: 'src',
  snapshotPathTemplate: '{snapshotDir}/{arg}-{projectName}-{platform}{ext}',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
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
