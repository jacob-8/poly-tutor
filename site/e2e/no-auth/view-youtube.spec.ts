import { test, expect } from '@playwright/test'
import { youtube_ids } from '../../src/lib/mocks/shows'

const youtube_prefix = 'https://www.youtube.com/watch?v='

test('unauthed user opens video with captions in db and sees them', async ({ page }) => {
  await page.goto('/en/zh-TW/shows')
  await page.waitForLoadState('networkidle')
  await page.getByPlaceholder(youtube_prefix).fill(youtube_prefix + youtube_ids.has_captions_in_db)
  await expect(page.getByText('zài 在 贵zhōu 州dī 的dì 第yī 一tiān')).toBeVisible()
})

test.skip('Chinese words are split', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${youtube_ids.has_captions_in_db}`)
  await expect(page.getByText('贵州')).toBeVisible()
})

// Test: anonymous visitor opens existing video and can view someone elses transcripts and translations and summary

// Test: shows clip duration

// Test: non-user trying to translate gets a 'no session' error from Supabase currently - this needs caught and formed into an easy to login situation
