import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle') // Wait for page to be hydrated
})

test('has logged in email', async ({ page }) => {
  const email = 'bob_smith@gmail.com'
  await page.getByRole('button', { name: 'b' }).click()
  await expect(page.getByText(email)).toBeVisible()
})
