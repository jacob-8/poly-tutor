import { test, expect } from '@playwright/test'
import { youtube_ids } from '../../src/lib/mocks/shows'

const youtube_prefix = 'https://www.youtube.com/watch?v='

// My scenario is that a new user comes to the site. I want him to have an easy experience to add a YouTube URL to the site and get watching. But I also want him to be able to see other videos in his language so he can get a feel for how it works. Once he goes into a video, it's added to his videos automatically. He can remove it by pressing the delete button.

// Test: user navigates from home page to shows page and finds his youtubes empty, but other youtubes down below that pre-exist in the db in the same language - currently 3 are seeded in Chinese, 1 in English, so show only 3
test('new user sees existing videos in his language but not other languages', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.getByRole('link', { name: 'YouTube' }).click()
  await expect(page.getByText('自驾游贵州')).toBeVisible()
  await expect(page.getByText('An Elder Transforms')).toBeVisible()
  await expect(page.getByText('在黄土高坡上')).toBeVisible()
  await expect(page.getByText('Harvard')).not.toBeVisible()
})

test('user that changes to learning English will only see English videos', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
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
  await page.getByText('Remove from my videos').click()
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
  await page.waitForLoadState('networkidle')
  const has_captions_in_db = '9ruqSX_p_48'
  await page.getByPlaceholder(youtube_prefix).fill(youtube_prefix + has_captions_in_db)
  await expect(page.getByText('zài 在 贵zhōu 州dī 的dì 第yī 一tiān')).toBeVisible()
})

// Test: user pastes in youtube url for a youtube not in the db but which YouTube already has captions for. The captions come down and user sees them load in a moment later.
test('captions load in from YouTube when a new video is added that YouTube has captions for', async ({ page }) => {
  await page.goto('/en/zh-TW/shows')
  await page.waitForLoadState('networkidle')
  await page.getByPlaceholder(youtube_prefix).fill(youtube_prefix + youtube_ids.has_captions_on_youtube__llama)
  await expect(page.getByText('hǎ 哈luō 囉gè 各wèi 位guàn 觀zhòng')).toBeVisible()
})

// Test: user pastes in youtube url for a youtube not in the db and which YouTube does not have captions for. He sees a button allowing him to transcribe using his credits+Whisper. He transcribes (using mock response) and sees the captions load in.
test('user can transcribe captions using Whisper when YouTube does not have them and translate them', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${youtube_ids.has_no_captions__ai_camp}`)
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Get Captions' }).click()
  await expect(page.getByText('zhè 這shì 是yī 一gè 個mú 模nǐ 擬d')).toBeVisible()
  // remove the following temporary section once they can generate captions for other users transcripts
  await page.route('/api/translate', async (route) => {
    const { text } = await route.request().postDataJSON()
    const translatedText = text.split('\n').map(t => 'Mocked translation: ' + t).join('\n')
    route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line_separated_translations: translatedText })
    })
  })
  await page.getByRole('button', { name: 'Translate' }).click()
  await new Promise(r => setTimeout(r, 1000)) // because study sentence isn't actually connected to live data
  await page.getByText('zhè 這shì 是yī 一gè 個mú 模nǐ 擬d').hover()
  await expect(page.getByText('Mocked translation')).toBeVisible()
})

test.skip('user can generate translations for another users transcript', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${youtube_ids.has_captions_in_db}`)
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Translate' }).click()
  await expect(page.getByText('Mocked translation: This is a fake transcript')).toBeVisible()
})

// Test: user can generate a summary

// Test: new user for the very first time, when signing up from a youtube will have their auth saved first then after a small delay the youtube will be added to their videos once the db has their auth id to connect things to, otherwise their will be an error upon trying to add
