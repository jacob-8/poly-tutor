import { test as setup, expect, request } from '@playwright/test'
import { STORAGE_STATE } from '../playwright.config'
const INBUCKET_URL = 'http://localhost:54324'

// See https://playwright.dev/docs/test-global-setup-teardown
// With OTP help from https://www.bekapod.dev/articles/supabase-magic-login-testing-with-playwright/

setup('login', async ({ page }) => {
  const email = 'playwright@mock.com'
  const [username] = email.split('@')
  const { token: oldToken } = await getLoginMessage(username)
  await page.goto('/')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.getByPlaceholder('Email address').fill(email)
  await page.getByRole('button', { name: 'Send 6-Digit Code' }).click()
  const { token } = await waitForNewToken(oldToken, username)
  await page.getByPlaceholder(`Enter 6-digit code (${email})`).fill(token)
  await expect(page.getByText(`Signed in with ${email}`)).toBeVisible()

  await page.context().storageState({ path: STORAGE_STATE })
})

async function getLoginMessage(username: string) {
  const requestContext = await request.newContext()
  const messages = await requestContext
    .get(`${INBUCKET_URL}/api/v1/mailbox/${username}`)
    .then((res) => res.json())
    .then((items) =>
      [...items].sort((a, b) => {
        if (a.date < b.date)
          return 1

        if (a.date > b.date)
          return -1

        return 0
      })
    )

  // As we've sorted the messages by date, the first message in
  // the `messages` array will be the latest one
  const latestMessageId = messages[0]?.id

  if (latestMessageId) {
    const message = await requestContext
      .get(
        `${INBUCKET_URL}/api/v1/mailbox/${username}/${latestMessageId}`
      )
      .then((res) => res.json())

    const [, token] = message.body.text.match(/enter the code: ([0-9]+)/)

    return { token }
  }

  return {
    token: '',
  }
}

function waitForNewToken(oldToken: string, username: string) {
  let triesLeft = 5
  return new Promise<Awaited<ReturnType<typeof getLoginMessage>>>(
    (resolve, reject) => {
      const interval = setInterval(async () => {
        const check = await getLoginMessage(username)
        if (check.token !== oldToken) {
          resolve(check)
          clearInterval(interval)
        } else if (triesLeft <= 1) {
          reject()
          clearInterval(interval)
        }
        triesLeft--
      }, 100)
    }
  )
}
