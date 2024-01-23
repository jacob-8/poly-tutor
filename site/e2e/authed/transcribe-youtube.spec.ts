import { test, expect } from '@playwright/test'
import { unseeded_youtubes } from '$lib/mocks/seed/youtubes'

// Test: user pastes in youtube url for a youtube not in the db and which YouTube does not have captions for. He sees a button allowing him to transcribe using his credits+Whisper. He transcribes (using mock response) and sees the captions load in.
test('user can transcribe captions using Whisper when YouTube does not have them and translate them', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${unseeded_youtubes.zh_no_captions__ai_camp.id}`)
  await page.getByRole('button', { name: 'Get Captions' }).click()
  await page.getByPlaceholder('sk-').fill('sk-this-is-a-fake-key-obviously')
  await page.getByLabel('Close').click()
  await page.getByRole('button', { name: 'Get Captions' }).click()
  await expect(page.locator('#caption_0').getByText('這')).toBeVisible()
  // remove the following temporary translate section once they can generate captions for other users transcripts
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
  await page.locator('#caption_0').getByText('這').click()
  await expect(page.getByText('Mocked translation')).toBeVisible()
})

// Test: trying to transcribe w/o Openai key will first ask for key then allow user to transcribe
