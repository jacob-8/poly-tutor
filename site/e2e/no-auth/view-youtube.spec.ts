import { test, expect } from '@playwright/test'
import { seeded_youtubes } from '$lib/mocks/seed/youtubes'

// TODO: Current
test('visitor opens video with captions, transcripts, translations, and summary in db and sees them', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${seeded_youtubes.zh_transcribed_summarized.youtube.id}`)
  await expect(page.getByText('zài 在 贵zhōu 州dī 的dì 第yī 一tiān')).toBeVisible()
})

test.skip('Chinese words are split', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${seeded_youtubes.zh_transcribed_summarized.youtube.id}`)
  await expect(page.getByText('贵州')).toBeVisible()
})


// Test: shows clip duration

// Test: non-user trying to translate gets a 'no session' error from Supabase currently - this needs caught and formed into an easy to login situation
