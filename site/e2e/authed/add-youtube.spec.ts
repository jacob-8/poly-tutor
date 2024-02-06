import { test, expect } from '@playwright/test'
import { seeded_youtubes, unseeded_youtubes } from '$lib/mocks/seed/youtubes'

const youtube_prefix = 'https://www.youtube.com/watch?v='

// My scenario is that a new user comes to the site. I want him to have an easy experience to add a YouTube URL to the site and get watching. But I also want him to be able to see other videos in his language so he can get a feel for how it works. Once he goes into a video, it's added to his videos automatically. He can remove it by pressing the delete button.

// Test: user navigates from home page to shows page and finds his youtubes empty, but other youtubes down below that pre-exist in the db in the same language - currently 3 are seeded in Chinese, 1 in English, so show only 3
test('new user sees existing videos in his language but not other languages', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'YouTube' }).click()
  await expect(page.getByText('自驾游贵州')).toBeVisible()
  await expect(page.getByText('一位老人騎驢帶回200棵蘋果樹苗')).toBeVisible()
  await expect(page.getByText('在黄土高坡上')).toBeVisible()
  await expect(page.getByText('Harvard')).not.toBeVisible()
})

test('user that changes to learning English will only see English videos', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Select Language').click()
  await page.getByRole('button', { name: '使用繁體學習英文' }).click()
  await page.getByRole('link', { name: 'YouTube' }).click()
  await expect(page.getByText('Harvard')).toBeVisible()
  await expect(page.getByText('自驾游贵州')).not.toBeVisible()
})

// Test: user clicks on an existing video not in his videos, then user goes back to home and sees that existing video is now in his videos
test('user can open an existing video not yet his, then go back to shows and find video is now his video', async ({ page }) => {
  await page.goto('/en/zh-TW/shows')
  await page.waitForLoadState('networkidle')
  await page.getByText('自驾游贵州').click()
  await page.getByRole('link', { name: 'Back Button' }).click()
  await expect(page
    .getByTestId('my-videos')
    .filter({ has: page.getByText('自驾游贵州') }))
    .toBeVisible()
  await expect(page
    .getByTestId('other-videos')
    .filter({ hasNot: page.getByText('自驾游贵州') }))
    .toBeVisible()
})

test('user can remove video from his videos', async ({ page }) => {
  await page.goto('/en/zh-TW/shows')
  await page.waitForLoadState('networkidle')
  await page.getByText('自驾游贵州').click()
  await page.getByRole('link', { name: 'Back Button' }).click()
  await expect(page
    .getByTestId('my-videos')
    .filter({ has: page.getByText('自驾游贵州') }))
    .toBeVisible()
  await page.getByText('自驾游贵州').click()
  await page.getByTitle('Remove Video').click()
  await expect(page
    .getByTestId('my-videos')
    .filter({ hasNot: page.getByText('自驾游贵州') }))
    .toBeVisible()
  await expect(page
    .getByTestId('other-videos')
    .filter({ has: page.getByText('自驾游贵州') }))
    .toBeVisible()
})

// Test: user pastes in youtube url for a youtube already in the db with captions and he sees the captions load in from the db
test('user pastes in youtube url for a youtube already in the db with captions and he sees the captions load in from the db', async ({ page }) => {
  await page.goto('/en/zh-TW/shows')
  await page.getByPlaceholder(youtube_prefix).fill(youtube_prefix + seeded_youtubes.zh_transcribed_summarized.youtube.id)
  await expect(page.getByText('zài 在 (located) at, (to be) in, to exist, in tguìzhōu 貴州 Guizhou province (')).toBeVisible()
})

// Test: user pastes in youtube url for a youtube not in the db but which YouTube already has captions for. The captions come down and user sees them load in a moment later.
test('captions load in from YouTube when a new video is added that YouTube has captions for', async ({ page }) => {
  await page.goto('/en/zh-TW/shows')
  await page.getByPlaceholder(youtube_prefix).fill(youtube_prefix + unseeded_youtubes.zh_captions_on_youtube__llama.id)
  await expect(page.getByText('字幕')).toBeVisible()
})
