import { test, expect } from '@playwright/test'
import { seeded_youtubes } from '$lib/mocks/seed/youtubes'

test('visitor opens video with transcripts, summary, and translation in db and sees them', async ({ page }) => {
  const video = seeded_youtubes.en_transcribed_translated_summarized
  await page.goto(`/zh-TW/en/shows/${video.youtube.id}`)
  // Transcript
  const [first_sentence] = video.transcripts[0].transcript.sentences
  await expect(page.getByText(first_sentence.text)).toBeVisible()
  // Summary
  await expect(page.getByText(video.summaries[0].summary.sentences[0].text)).toBeVisible()
  // Translations
  await page.getByText(first_sentence.text).hover()
  await expect(page.getByText(first_sentence.translation['zh-TW'])).toBeVisible()
})

test.skip('Chinese words are split', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${seeded_youtubes.zh_transcribed_summarized.youtube.id}`)
  await expect(page.getByText('贵州')).toBeVisible()
})


// Test: shows clip duration

// Test: non-user trying to translate gets a 'no session' error from Supabase currently - this needs caught and formed into an easy to login situation
