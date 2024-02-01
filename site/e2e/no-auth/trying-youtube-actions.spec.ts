import { test, expect } from '@playwright/test'
import { seeded_youtubes } from '$lib/mocks/seed/youtubes'
import { login } from '../login'

// Test: new user for the very first time, when signing up from a youtube will have their auth saved first then after a small delay the youtube will be added to their videos once the db has their auth id to connect things to, otherwise their will be an error upon trying to add
test('signing up from youtube succesfully adds youtube after auth is saved to db', async ({ page }) => {
  await page.goto(`/en/zh-TW/shows/${seeded_youtubes.zh_transcribed_summarized.youtube.id}`)
  await login(page, 'newbie@mock.com')
  await page.getByRole('link', { name: 'Back Button' }).click()
  await expect(page
    .getByTestId('my-videos')
    .filter({ has: page.getByText(seeded_youtubes.zh_transcribed_summarized.youtube.title.map(sentence => sentence.text).join(' ').slice(0, 10)) }))
    .toBeVisible()
}) // this is to avoid a race-timing bug that is hard to find but nows it's not showing up

// Test: non-user trying to translate gets a 'no session' error from Supabase currently - this needs caught and formed into an easy to login situation
