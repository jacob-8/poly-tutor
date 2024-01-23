import { test, expect } from '@playwright/test'
import { fake_ch_transcript, seeded_youtubes } from '$lib/mocks/seed/youtubes'

test('user can generate translations for another users transcript', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${seeded_youtubes.zh_transcribed.youtube.id}`)
  await page.locator('#caption_0').click()
  await expect(page.getByText('Mocked translation: ' + fake_ch_transcript)).not.toBeVisible()
  await page.getByRole('button', { name: 'Translate' }).click()
  await new Promise(r => setTimeout(r, 500))
  await page.locator('#caption_0').click()
  await expect(page.getByText('Mocked translation: ' + fake_ch_transcript)).toBeVisible()
})
