import { test, expect } from '@playwright/test'

const youtube_prefix = 'https://www.youtube.com/watch?v='

test('unauthed user opens video with captions in db and sees them', async ({ page }) => {
  await page.goto('/en/zh-TW/shows')
  await page.waitForLoadState('networkidle')
  const has_captions_in_db = '9ruqSX_p_48'
  await page.getByPlaceholder(youtube_prefix).fill(youtube_prefix + has_captions_in_db)
  await expect(page.getByText('zài 在 贵zhōu 州dī 的dì 第yī 一tiān')).toBeVisible()
})
