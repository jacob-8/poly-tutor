import { test as setup } from '@playwright/test'
import { STORAGE_STATE } from '../playwright.config'
import { login } from './login'

// See https://playwright.dev/docs/test-global-setup-teardown
// With OTP help from https://www.bekapod.dev/articles/supabase-magic-login-testing-with-playwright/

setup('login', async ({ page }) => {
  await page.goto('/')
  await login(page, 'playwright@mock.com')
  await page.context().storageState({ path: STORAGE_STATE })
})

