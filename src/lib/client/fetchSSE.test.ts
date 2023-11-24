import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from '../mocks/server'
import { fetchSSE } from './fetchSSE'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe(fetchSSE, () => {
  test.fails('emits two messages and then done', async () => {
    const eventSource = fetchSSE('https://api.openai.com/v1/chat/completions', {})
    const messages: string[] = []
    eventSource.addEventListener('message', (event: any) => {
      messages.push(event.data)
      if (event.data.detail === '[DONE]') {
        //@ts-ignore
        eventSource.close()
      }
    })
    eventSource.stream()
    await new Promise((resolve) => {
      eventSource.addEventListener('close', () => {
        expect(messages.join('')).toMatchInlineSnapshot('Hello world')
        resolve(true)
      })
    })
  })
})
