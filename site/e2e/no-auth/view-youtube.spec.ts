import { test, expect } from '@playwright/test'
import { seeded_youtubes } from '$lib/mocks/seed/youtubes'

test('visitor opens video with transcripts, summary, and translation in db and sees them', async ({ page }) => {
  const video = seeded_youtubes.en_transcribed_translated_summarized
  await page.goto(`/zh-TW/en/shows/${video.youtube.id}`)
  await page.waitForLoadState('networkidle')

  // Transcript
  const [first_sentence] = video.transcripts[0].sentences
  const [first_word] = first_sentence.text.split(' ')
  await expect(page.getByText(first_word)).toBeVisible()
  // Summary
  await expect(page.getByText('tutorial')).toBeVisible()
  // Translations
  await page.getByText(first_word).click()
  await expect(page.getByText(first_sentence.translation['zh-TW'])).toBeVisible()
})

test('Chinese words are split', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${seeded_youtubes.zh_transcribed_summarized.youtube.id}`)
  await expect(page.getByText('在貴州的第一天')).not.toBeVisible()
  await expect(page.locator('#caption_0').getByText('貴州')).toBeVisible()
})

test.skip('Translations and definitions show in sync with currently playing sentence', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${seeded_youtubes.zh_transcribed_summarized.youtube.id}`)
  await expect(page.getByText('贵州')).toBeVisible()
})

// TEST: Show most common unknown words (don't include ones just needing reading help) - done

// Split into 5 minute sections

// Start playing 1 sentence at a time (c-e-c)

// Show unknown words again without helps to mark the known ones or study them

// clean captions into sentences
