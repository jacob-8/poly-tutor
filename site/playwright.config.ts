import { defineConfig, devices } from '@playwright/test'

export const STORAGE_STATE = 'e2e/.playwright-login-storage-state.json'

export default defineConfig({
  testDir: 'e2e',
  snapshotDir: 'e2e/snapshots',
  snapshotPathTemplate: '{snapshotDir}/{arg}-{projectName}-{platform}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'reset', // don't run this in CI when adding these tests to CI
      testMatch: /reset-db\.setup\.ts/,
    },
    {
      name: 'login',
      testMatch: /login\.setup\.ts/,
      dependencies: ['reset'],
    },
    {
      name: 'authed chromium',
      testMatch: 'e2e/authed/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['login'],
    },
    {
      name: 'no-auth chromium',
      testMatch: 'e2e/no-auth/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['reset'],
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    port: 5173,
    reuseExistingServer: true,
  },
})
