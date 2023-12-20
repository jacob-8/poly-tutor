import { test, expect } from '@playwright/test'
import { seeded_youtubes } from '$lib/mocks/seed/youtubes'

test.skip('user can generate translations for another users transcript', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${seeded_youtubes.zh_transcribed.youtube.id}`)
  await page.waitForLoadState('networkidle')
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
  await page.getByText('This is a fake transcript').hover()
  await expect(page.getByText('Mocked translation: This is a fake transcript')).toBeVisible()
})
