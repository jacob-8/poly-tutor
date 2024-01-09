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
  await page.getByText(first_sentence.text).click()
  await expect(page.getByText(first_sentence.translation['zh-TW'])).toBeVisible()
})

test('show duration is shown', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${seeded_youtubes.zh_transcribed_summarized.youtube.id}`)
  await expect(page.getByText('10:14')).toBeVisible()
})

test('Chinese words are split', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${seeded_youtubes.zh_transcribed_summarized.youtube.id}`)
  await expect(page.getByText('在貴州的第一天')).not.toBeVisible()
  await expect(page.getByText('在 貴州 的 第 一 天 ， 我們 就 遇到 了 一 位 非常 熱情 的 當 地 人 。')).toBeVisible()
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
