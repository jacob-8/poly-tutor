import { http, HttpResponse, passthrough } from 'msw'
// import type { ChatRequestBody } from '$lib/types'
import { CAPTIONS_URL } from '$env/static/private'
// import streamResponses from './data/stream_penguin.json'
import lpyKfNjTZi8_getTracks from './data/get-tracks-lpyKfNjTZi8.json'
import lpyKfNjTZi8_getCaptions from './data/get-captions-zh-TW-lpyKfNjTZi8.json'

function createChunkEncoder() {
  const encoder = new TextEncoder()
  return function (text: string): Uint8Array {
    return encoder.encode(text)
  }
}

export const handlers = [
  http.get(CAPTIONS_URL, ({request: { url }}) => {
    if (!url.includes('v=lpyKfNjTZi8'))
      return passthrough()

    if (url.includes('type=list'))
      return HttpResponse.json(lpyKfNjTZi8_getTracks)

    if (url.includes('fmt=srv3'))
      return HttpResponse.json(lpyKfNjTZi8_getCaptions)
  }),

  http.get('https://example.com/stream', () => {
    const encode = createChunkEncoder()
    const msg1 = encode('data: hello\r\n\r\n')
    const msg2 = encode('data: world\r\n\r\n')

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(msg1)
        controller.enqueue(msg2)
        controller.close()
      },
    })

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    })
  }),

  // http.post('https://api.openai.com/v1/chat/completions', async ({request}) => {
  //   const { messages } = await request.json() as ChatRequestBody

  //   const lastMessage = messages[messages.length - 1].content
  //   if (lastMessage === 'BUG!') throw new Error('BUG!')

  //   const encode = createChunkEncoder()
  //   const stream = new ReadableStream({
  //     async start(controller) {
  //       await new Promise(resolve => setTimeout(resolve, 1000))
  //       for (const msg of streamResponses) {
  //         controller.enqueue(encode(`data: ${JSON.stringify(msg)}\n\n`))
  //         const randomMs = Math.floor(Math.random() * 200)
  //         await new Promise(resolve => setTimeout(resolve, randomMs))
  //       }

  //       controller.enqueue(encode('data: [DONE]\n\n'))
  //       controller.close()
  //     },
  //   })

  //   return new HttpResponse(stream, {
  //     headers: {
  //       'Content-Type': 'text/event-stream',
  //     },
  //   })
  // }),
]
