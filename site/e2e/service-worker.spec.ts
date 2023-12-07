import { test, expect, type Page } from '@playwright/test'
// page.screenshot({ path: `screenshots/page.png` })

test('service worker exists and has only 1 cache', async ({ page, baseURL }) => {
  await page.goto('/')

  const serviceWorkerURL = await getServiceWorkerUrl(page)
  const swName = 'service-worker.js'
  expect(serviceWorkerURL).toBe(`${baseURL}/${swName}`)

  const cachesKeys = await page.evaluate(async () => await caches.keys())
  expect(cachesKeys.length).toEqual(1)
})

test('service worker cache includes manifest (static assests) and prerendered pages', async ({ page, baseURL }) => {
  await page.goto('/')
  await getServiceWorkerUrl(page)

  const urls = await getCachedUrls(page, baseURL!)

  const staticAsset = '/manifest.webmanifest'
  expect(urls.includes(staticAsset)).toBeTruthy()

  const prerenderedPages = ['/en', '/zh-TW', '/zh-CN']
  for (const prerenderedPage of prerenderedPages)
    expect(urls.includes(prerenderedPage)).toBeTruthy()
})

test('service worker includes dynamic page only after navigation to it', async ({ page, baseURL }) => {
  await page.goto('/')
  await getServiceWorkerUrl(page)

  const dynamicPage = '/en/dynamic'

  const urlsBeforeNavigate = await getCachedUrls(page, baseURL!)
  expect(urlsBeforeNavigate.includes(dynamicPage)).toBeFalsy()

  await page.goto(dynamicPage)

  const urlsAfterNavigate = await getCachedUrls(page, baseURL!)
  expect(urlsAfterNavigate.includes(dynamicPage)).toBeTruthy()
})

async function getServiceWorkerUrl(page: Page) {
  return await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready
    return registration.active?.scriptURL
  })
}

async function getCachedUrls(page: Page, baseURL: string) {
  const urls = await page.evaluate(async () => {
    const [cacheName] = await caches.keys()
    const cache = await caches.open(cacheName)
    const cacheKeys = await cache.keys()
    return cacheKeys.map((req) => req.url)
  })
  return urls.map(url => url.replace(baseURL, ''))
}
