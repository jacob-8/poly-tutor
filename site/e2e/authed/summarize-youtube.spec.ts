import { test, expect } from '@playwright/test'
import { seeded_youtubes } from '$lib/mocks/seed/youtubes'

test.skip('user can generate a summary for an entire clip', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${seeded_youtubes.zh_transcribed.youtube.id}`)
  await page.getByRole('button', { name: 'Summarize' }).click()
  await page.getByPlaceholder('sk-').fill('sk-this-is-a-fake-key-obviously')
  await page.getByLabel('Close').click()
  await page.getByRole('button', { name: 'Summarize' }).click()
  await expect(page.getByText('qǐé 企鵝 penguin').first()).toBeVisible()
})
