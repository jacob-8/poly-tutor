import { test, expect } from '@playwright/test'
import kitbookConfig from '../kitbook.config'
import { importAllVariants } from './findVariants'

// /en/kitbook/sandbox/routes/[lang=locale]/(app)/+page?variantIdx=0

const directory = '../src'
const variantModules = await importAllVariants(directory)
const { viewports, languages } = kitbookConfig

for (const [path, module] of variantModules) {
  if (module.variants?.length === 0) continue

  const [,relativePath] = path.split('src')

  for (let index = 0; index < module.variants.length; index++) {
    const variant = module.variants[index]
    for (const viewport of variant.viewports || viewports) {
      for (const language of languages || [{ code: '' }]) {
        const { directory, filenameWithoutExtension } = normalizeAndSplitPath(relativePath)

        let testName = variant.name || index.toString()
        const viewportName = viewport.name ? viewport.name : `${viewport.width}x${viewport.height}`
        testName += `-${viewportName}`
        if (language.code) testName += `-${language.code}`

        const url = `/${language.code}/kitbook/sandbox${relativePath.replace('_', '+').replace('.variants.ts', '')}?variantIdx=${index}`

        test(testName, async ({ page }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height })
          await page.goto(url)
          await expect(page).toHaveScreenshot([directory, filenameWithoutExtension, `${testName}.png`])
        })

        if (variant.tests) {
          for (const [ additionalName, additionalTest] of Object.entries(variant.tests)) {
            const name = `${testName}-${additionalName}`
            test(name, async ({ page }) => {
              await page.setViewportSize({ width: viewport.width, height: viewport.height })
              await page.goto(url)
              await additionalTest({page, expect, filepathWithoutExtension: `${directory}/${filenameWithoutExtension}`, name})
            })
          }
        }
      }
    }
  }
}

function normalizeAndSplitPath(path: string): { directory: string; filenameWithoutExtension: string } {
  // 1. Normalize the path to use forward slashes (e.g.: \\routes\\[lang=locale]\\(app)\\_layout.variants.ts)
  const normalizedPath = path.replace(/\\\\|\\/g, '/')

  // 2. Split the path into directory and filename
  const leadingSlash = /^\//
  const parts = normalizedPath.replace(leadingSlash, '').split('/')
  const filename = parts.pop() as string

  // 3. Remove the extension from the filename by slicing of the last chunk and joining the others back together
  const filenameWithoutExtension = filename.split('.').slice(0, -1).join('.')

  return {
    directory: parts.join('/'),
    filenameWithoutExtension
  }
}

