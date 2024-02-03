import type { ChatRequestBody } from '$api/chat/+server'
import { createChunkDecoder } from '$lib/client/chunkDecoder'
import { OpenAiChatModels } from '$lib/types/models'

// This is a simple way to receive entire stream and return it
async function getStream(url: string, lastMessage = 'normal') {
  const data: ChatRequestBody = {
    messages: [{
      role: 'system',
      content: 'Testing'
    },
    {
      role: 'user',
      content: lastMessage
    }],
    model: OpenAiChatModels.GPT4,
    max_tokens: 1000,
    openai_api_key: 'not needed in mock',
    stream: true,
  }

  // try {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
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
  // } catch (err) {
  //   console.info(err.message)
  // }
}

describe(getStream, () => {
  test('ChatGPT normal', async () => {
    const streamedResponse = await getStream('https://api.openai.com/v1/chat/completions')
    expect(streamedResponse).toMatchInlineSnapshot(`
      "data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"M"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"o"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"c"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"k"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"e"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"d"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":":"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":" "},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"企"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"鹅"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"("},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"q"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"ǐ"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"'"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"é"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":")"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"。"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"你"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"喜"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"欢"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"企"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"鹅"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"吗"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"？"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"为"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"什"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"么"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{"content":"？"},"finish_reason":null}]}

      data: {"id":"chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP","object":"chat.completion.chunk","created":1700657939,"model":"gpt-4-1106-preview","system_fingerprint":"fp_a24b4d720c","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

      data: [DONE]

      "
    `)
  })

  test('bug', async () => {
    await expect(() => getStream('https://api.openai.com/v1/chat/completions', 'BUG!')).rejects.toThrowErrorMatchingInlineSnapshot(`[TypeError: Failed to fetch]`)
  })
})





