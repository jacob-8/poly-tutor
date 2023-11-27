import type { Variant } from 'kitbook'
import type Page from './+page.svelte'
import { mockLayoutData } from '$lib/mocks/data/page'

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
        savedMessages: [
          {
            role: 'user',
            content: 'What are bananas?',
          },
          {
            role: 'assistant',
            content: '香蕉是一种水果。 (Bananas are a type of fruit.) 你喜欢吃香蕉吗？(Do you like eating bananas?)',
          },
          {
            role: 'user',
            content: '我喜欢吃香蕉。',
          },
          {
            role: 'assistant',
            content: '很好！香蕉是一种又健康又美味的水果。你通常什么时候吃香蕉？',
          },
          {
            role: 'user',
            content: '我通常在早上吃香蕉。',
          },
          {
            role: 'assistant',
            content: '早上吃香蕉是个不错的选择！香蕉含有丰富的能量和营养，可以给你一天的精力。你还喜欢在其他时间吃香蕉吗？',
          },
          // {
          //   role: 'user',
          //   content: '我也喜欢在午饭后吃香蕉。',
          // },
        ]
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
