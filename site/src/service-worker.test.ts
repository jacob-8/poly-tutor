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

  test('prerendered home routes (/en, /zh-TW, /zh-CN) are precached', () => {
    expect(swContent).toContain('"/en"')
    expect(swContent).toContain('"/zh-TW"')
    expect(swContent).toContain('"/zh-CN"')
  })

  test('/en/about is not precached because it is not prerendered', () => {
    expect(swContent).not.toContain('"/en/about"')
  })

  test('process.env.VITE_COMMAND replaced with "build"', () => {
    expect(swContent).not.toContain('process.env.VITE_COMMAND')
  })
})
