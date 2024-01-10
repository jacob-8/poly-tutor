// To learn about this service worker:
// 1. Understand SvelteKit's $service-worker module https://kit.svelte.dev/docs/service-workers
// 2. Then read about preloads https://web.dev/navigation-preload/ and network first, falling back to cache https://developer.chrome.com/docs/workbox/caching-strategies-overview/#network_first_falling_back_to_cache as they are required to work together if both used as seen here
// 3. Lastly the "Introduction to Workbox and service workers" and "What you need to know" sections of https://developer.chrome.com/docs/workbox/service-worker-overview/ are very helpful to round out your understanding of service workers even though we don't use Workbox here

/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, prerendered, version } from '$service-worker'

const _self = self as unknown as ServiceWorkerGlobalScope
const currentCache = `cache-${version}`
const process = { env: { VITE_COMMAND: 'serve' } }
const viteCommand = process.env.VITE_COMMAND as 'build' | 'serve'
const SUCCESS = 200
const assetsForCache = [
  ...build,
  ...prerendered,
  ...files,
]

_self.addEventListener('install', (event) => {
  event.waitUntil(addFilesToCache())
})

async function addFilesToCache() {
  const cache = await caches.open(currentCache)
  await cache.addAll(assetsForCache)
}

_self.addEventListener('activate', (event) => {
  event.waitUntil(deleteOldCaches())
  if (viteCommand === 'build')
    event.waitUntil(enableNavigationPreload())
})

async function deleteOldCaches() {
  const cacheNames = await caches.keys()
  const deletionPromises = cacheNames.map((name) => {
    if (name !== currentCache) return caches.delete(name)
  })
  await Promise.all(deletionPromises)
}

async function enableNavigationPreload() {
  if (_self.registration.navigationPreload)
    await _self.registration.navigationPreload.enable()
}

_self.addEventListener('fetch', (event) => {
  const isNotGetRequest = event.request.method !== 'GET'
  const isPartialRequest = event.request.headers.has('range') // as in videos
  if (isNotGetRequest && isPartialRequest) return

  const { pathname } = new URL(event.request.url)
  if (assetsForCache.includes(pathname))
    return event.respondWith(ignorePreloadAndReturnPrecached(event, pathname))

  // const cookies = event.request.headers.get('Cookie') // can check cookies for auth to turn off the stale-while-revalidate strategy for editors. It would be annoying for them to be confused by slightly stale content.

  // const isImage = event.request.destination === 'image' // could use stale-while-revalidate for images but isn't the HTTP cache taking care of these automatically?

  if (viteCommand === 'build')
    event.respondWith(networkFirst(event, pathname))
    // event.respondWith(staleWhileRevalidate(event, pathname)) // don't use cache in development to avoid working with one-page-load stale content
})

// `build`, `prerended`, and `files` can always be served from the cache
async function ignorePreloadAndReturnPrecached(event: FetchEvent, pathname: string): Promise<Response> {
  event.waitUntil(event.preloadResponse)
  const cache = await caches.open(currentCache)
  return (await cache.match(pathname))!
}

async function networkFirst(event: FetchEvent, pathname: string): Promise<Response> {
  const cache = await caches.open(currentCache)

  try {
    return respondFromNetworkAndUpdateCache(event, cache, pathname)
  } catch {
    console.info(`[sw] network error, trying cache: ${pathname}`)
    return cache.match(event.request) as Promise<Response>
  }
}

// Turns out to be a bad idea in this app, for example if a user loads a video without a summary, that no summary response is cached. So if they generate a summary, on next load it will not exist. Only one load further will it appear.
// async function staleWhileRevalidate(event: FetchEvent, pathname: string): Promise<Response> {
//   const cache = await caches.open(currentCache)

//   const cachedResponse = await cache.match(event.request)
//   if (cachedResponse) {
//     console.info(`[sw] used cached: ${pathname}`)
//     event.waitUntil(respondFromNetworkAndUpdateCache(event, cache, pathname))
//     return cachedResponse
//   }

//   return respondFromNetworkAndUpdateCache(event, cache, pathname)
// }

async function respondFromNetworkAndUpdateCache(event: FetchEvent, cache: Cache, pathname: string): Promise<Response> {
  const preloadedResponse = await (event.preloadResponse as Promise<Response | undefined>)

  if (preloadedResponse)
    console.info(`[sw] preloaded fetch: ${pathname}`)
  else
    console.info(`[sw] normal fetch: ${pathname}`)

  const networkResponse = preloadedResponse || await fetch(event.request)
  if (networkResponse.status === SUCCESS)
    cache.put(event.request, networkResponse.clone())
  return networkResponse
}
