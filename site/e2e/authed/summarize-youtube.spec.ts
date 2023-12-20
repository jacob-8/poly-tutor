import { test, expect } from '@playwright/test'
import { seeded_youtubes } from '$lib/mocks/seed/youtubes'

test('user can generate a summary for an entire clip', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${seeded_youtubes.zh_transcribed.youtube.id}`)
  await page.getByRole('button', { name: 'Summarize' }).click()
  await expect(page.getByText('企鹅(qǐ\'é)。你喜欢企鹅吗？为什么？')).toBeVisible()
})
