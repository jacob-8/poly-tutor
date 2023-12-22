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

test('show duration is shown', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${seeded_youtubes.zh_transcribed_summarized.youtube.id}`)
  await expect(page.getByText('10:14')).toBeVisible()
})

test.skip('Chinese words are split', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${seeded_youtubes.zh_transcribed_summarized.youtube.id}`)
  await expect(page.getByText('在贵州的第一天')).not.toBeVisible()
  await expect(page.getByText('贵州')).toBeVisible()
})

test.skip('Translations and definitions show in sync with currently playing sentence', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${seeded_youtubes.zh_transcribed_summarized.youtube.id}`)
  await expect(page.getByText('贵州')).toBeVisible()
})

// After cleaning captions into sentences and translating:

// Split into 5 minute sections

// !Split words (if not already)
// Add helps to words that need it based on my vocab

// Show most common unknown words (don't include ones just needing reading help)

// Benchmark to see if need to process smaller chunks and then stream them in.

// Start playing 1 sentence at a time (c-e-c)

// Show unknown words again without helps to mark the known ones or study them
