import { expect, test } from '@playwright/test'

test.describe('i18n reroutes /', () => {
  test('to /en by default', async ({ page, baseURL }) => {
    await page.goto('/')
    expect(page.url()).toBe(`${baseURL}/en`)
    await expect(page.getByRole('link', { name: 'Tutor' })).toBeVisible()
  })

  test('to /zh-TW if previously set (using cookie) by user', async ({ page, baseURL, context }) => {
    await context.addCookies([{ name: 'locale', value: 'zh-TW', url: baseURL }])
    await page.goto('/')
    expect(page.url()).toBe(`${baseURL}/zh-TW`)
    await expect(page.getByRole('link', { name: '小老師' })).toBeVisible()
  })

  test(' to /zh-CN if accept-language is set to zh-Hans', async ({ page, baseURL, context }) => {
    await context.route('/', (route, request) => {
      route.continue({
        headers: {
          ...request.headers(),
          'Accept-Language': 'zh-Hans,zh;q=0.9,en;q=0.8',
        }
      })
    })
    await page.goto('/')
    expect(page.url()).toBe(`${baseURL}/zh-CN`)
    await expect(page.getByRole('link', { name: '小老师' })).toBeVisible()
  })
})

