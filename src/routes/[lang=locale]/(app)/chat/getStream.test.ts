import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from '../../../../lib/mocks/server'
import { createChunkDecoder } from '../../../../lib/client/chunkDecoder'
import { apiFetch } from '../../../../lib/client/apiFetch'
import type { ChatRequestBody } from '../../../api/chat/chat.interface'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

async function getStream(url: string, lastMessage: string) {
  const response = await apiFetch<ChatRequestBody>(url, {
    messages: [{
      role: 'system',
      content: 'Testing'
    },
    {
      role: 'user',
      content: lastMessage
    }],
    model: 'gpt-4-1106-preview',
  })
  const reader = response.body.getReader()
  const decoder = createChunkDecoder()

  let result = ''

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder(value)
    // console.log(chunk)
    result += chunk
  }

  return result
}

describe(getStream, () => {
  // test('hello world', async () => {
  //   const streamedResponse = await getStream('https://example.com/stream')
  //   expect(streamedResponse).toMatchInlineSnapshot(`
  //     "data: hello

  //     data: world

  //     "
  //   `)
  // })

  test('ChatGPT normal', async () => {
    const streamedResponse = await getStream('https://api.openai.com/v1/chat/completions', 'normal')
    expect(streamedResponse).toMatchInlineSnapshot(`
      "data: {\\"id\\":\\"chatcmpl-7fk6EXGWflbli7Xj3Bmv3dOhIq0Wk\\",\\"object\\":\\"chat.completion.chunk\\",\\"created\\":1690183010,\\"model\\":\\"gpt-3.5-turbo-0613\\",\\"choices\\":[{\\"index\\":0,\\"delta\\":{\\"content\\":\\"Hello \\"},\\"finish_reason\\":null}]}

      data: {\\"id\\":\\"chatcmpl-7fk6EXGWflbli7Xj3Bmv3dOhIq0Wk\\",\\"object\\":\\"chat.completion.chunk\\",\\"created\\":1690183010,\\"model\\":\\"gpt-3.5-turbo-0613\\",\\"choices\\":[{\\"index\\":0,\\"delta\\":{\\"content\\":\\"World\\"},\\"finish_reason\\":null}]}

      data: {\\"id\\":\\"chatcmpl-7fk6EXGWflbli7Xj3Bmv3dOhIq0Wk\\",\\"object\\":\\"chat.completion.chunk\\",\\"created\\":1690183010,\\"model\\":\\"gpt-3.5-turbo-0613\\",\\"choices\\":[{\\"index\\":0,\\"delta\\":{},\\"finish_reason\\":\\"stop\\"}]}

      data: [DONE]"
    `)
  })

  test.fails('bug', async () => {
    const streamedResponse = await getStream('https://api.openai.com/v1/chat/completions', 'BUG!')
    expect(streamedResponse).toMatchInlineSnapshot(`
      "data: {\\"id\\":\\"chatcmpl-7fk6EXGWflbli7Xj3Bmv3dOhIq0Wk\\",\\"object\\":\\"chat.completion.chunk\\",\\"created\\":1690183010,\\"model\\":\\"gpt-3.5-turbo-0613\\",\\"choices\\":[{\\"index\\":0,\\"delta\\":{\\"content\\":\\"Hello \\"},\\"finish_reason\\":null}]}

      data: {\\"id\\":\\"chatcmpl-7fk6EXGWflbli7Xj3Bmv3dOhIq0Wk\\",\\"object\\":\\"chat.completion.chunk\\",\\"created\\":1690183010,\\"model\\":\\"gpt-3.5-turbo-0613\\",\\"choices\\":[{\\"index\\":0,\\"delta\\":{\\"content\\":\\"World\\"},\\"finish_reason\\":null}]}

      data: {\\"id\\":\\"chatcmpl-7fk6EXGWflbli7Xj3Bmv3dOhIq0Wk\\",\\"object\\":\\"chat.completion.chunk\\",\\"created\\":1690183010,\\"model\\":\\"gpt-3.5-turbo-0613\\",\\"choices\\":[{\\"index\\":0,\\"delta\\":{},\\"finish_reason\\":\\"stop\\"}]}

      data: [DONE]"
    `)
  })
})





