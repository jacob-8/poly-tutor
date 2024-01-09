import { expect, test } from '@playwright/test'

test.describe('i18n reroutes /', () => {
  test('to /en/zh-TW by default', async ({ page, baseURL }) => {
    await page.goto('/')
    expect(page.url()).toBe(`${baseURL}/en/zh-TW`)
    await expect(page.getByRole('heading', { name: 'Poly Tutor' })).toBeVisible()
  })

  test('to /zh-TW/en if previously set by user (uses cookies)', async ({ page, baseURL, context }) => {
    await context.addCookies([{ name: 'mother-locale', value: 'zh-TW', url: baseURL }])
    await context.addCookies([{ name: 'learning-locale', value: 'en', url: baseURL }])
    await page.goto('/')
    expect(page.url()).toBe(`${baseURL}/zh-TW/en`)
    await expect(page.getByRole('heading', { name: 'Poly 導師' })).toBeVisible()
  })

  test(' to /zh-CN/en if accept-language is set to zh-Hans', async ({ page, baseURL, context }) => {
    await context.route('/', (route, request) => {
      route.continue({
        headers: {
          ...request.headers(),
          'Accept-Language': 'zh-Hans,zh;q=0.9,en;q=0.8',
        }
      })
    })
    await page.goto('/')
    expect(page.url()).toBe(`${baseURL}/zh-CN/en`)
    await expect(page.getByRole('heading', { name: 'Poly 导师' })).toBeVisible()
  })
})

