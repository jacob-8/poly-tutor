import { describe, expect, test } from 'vitest'
import { readFileSync } from 'node:fs'
import { build } from 'vite'

describe('service worker', async () => {
  await build({
    logLevel: 'error',
  })

  const swName = './.svelte-kit/output/client/service-worker.js'
  const swContent = readFileSync(swName, 'utf-8')

  test('manifest.webmanifest is precached', () => {
    expect(swContent).toContain('"/manifest.webmanifest"')
  })

  // since we want to have quick resume shortcuts on a user's home screen, not sure yet if want to pre-render home routes
  // test('prerendered home routes (/en/zh-TW, /zh-CN/en, ...) are precached', () => {
  //   expect(swContent).toContain('"/en/zh-TW"')
  //   expect(swContent).toContain('"/en/zh-CN"')
  //   expect(swContent).toContain('"/zh-TW/en"')
  //   expect(swContent).toContain('"/zh-CN/en"')
  // })

  test('/en/about is not precached because it is not prerendered', () => {
    expect(swContent).not.toContain('"/en/zh-TW/shows"')
  })

  test('process.env.VITE_COMMAND replaced with "build"', () => {
    expect(swContent).not.toContain('process.env.VITE_COMMAND')
  })
})
