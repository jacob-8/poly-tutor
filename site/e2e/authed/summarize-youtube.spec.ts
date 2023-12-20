import { test, expect } from '@playwright/test'
import { seeded_youtubes } from '$lib/mocks/seed/youtubes'

test('user can generate a summary for an entire clip', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${seeded_youtubes.zh_transcribed.youtube.id}`)
  // await page.route('/api/chat', async (route) => {
  //   const { text } = await route.request().postDataJSON()
  //   const translatedText = text.split('\n').map(t => 'Mocked translation: ' + t).join('\n')
  //   route.fulfill({
  //     status: 200,
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ line_separated_translations: translatedText })
  //   })
  // })
  // await page.getByRole('button', { name: 'Summarize' }).click()
  await expect(page.getByText('This is a fake summary')).toBeVisible()
})
