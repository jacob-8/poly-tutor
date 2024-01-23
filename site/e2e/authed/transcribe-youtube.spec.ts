import { test, expect } from '@playwright/test'
import { unseeded_youtubes } from '$lib/mocks/seed/youtubes'

// Test: user pastes in youtube url for a youtube not in the db and which YouTube does not have captions for. He sees a button allowing him to transcribe using his credits+Whisper. He transcribes (using mock response) and sees the captions load in.
// Test: trying to transcribe w/o Openai key will first ask for key then allow user to transcribe
test('user can transcribe captions using Whisper when YouTube does not have them and translate them', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${unseeded_youtubes.zh_no_captions__ai_camp.id}`)
  await page.getByRole('button', { name: 'Get Captions' }).click()
  await page.getByPlaceholder('sk-').fill('sk-this-is-a-fake-key-obviously')
  await page.getByLabel('Close').click()
  await page.getByRole('button', { name: 'Get Captions' }).click()
  await expect(page.locator('#caption_0').getByText('這')).toBeVisible()
})
