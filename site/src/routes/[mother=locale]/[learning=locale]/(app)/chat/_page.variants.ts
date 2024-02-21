import type { Variant } from 'kitbook'
import type Page from './+page.svelte'
import { mockLayoutData } from '$lib/mocks/data/page'
import { messages } from '$lib/mocks/data/chat-thread'

export const variants: Variant<Page>[] = [
  {
    viewports: [
      {
        width: 400,
        height: 400,
      }
    ],
    props: {
      data: {
        ...mockLayoutData,
        savedMessages: messages,
      },
    },
  },
  {
    name: 'has-additional-tests',
    props: {
      data: {
        ...mockLayoutData,
        savedMessages: [],
      }
    },
    // tests: {
    //   'example': async ({page, expect, filepathWithoutExtension, name}) => {
    //     // await page.goto('http://localhost:5173/zh-TW')
    //     // await page.getByRole('textbox').click()
    //     // await page.getByRole('textbox').fill('Hello')
    //     // await page.getByRole('button', { name: 'Send' }).click()
    //     // await page.goto('http://localhost:5173/en')
    //     await page.getByRole('link', { name: '繁體' }).click()
    //     await expect(page.getByText('/zh-TW')).toBeVisible()
    //     await expect(page).toHaveScreenshot([filepathWithoutExtension, `${name}-.png`])
    //   },
    // }
  }
]
