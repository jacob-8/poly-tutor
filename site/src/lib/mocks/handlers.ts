import { http, HttpResponse, passthrough } from 'msw'
// import type { ChatRequestBody } from '$lib/types'
// import streamResponses from './data/stream_penguin.json'
import lpyKfNjTZi8_getTracks from './data/get-tracks-lpyKfNjTZi8.json'
import lpyKfNjTZi8_getCaptions from './data/get-captions-zh-TW-lpyKfNjTZi8.json'
// import HRenI3LURNk_getTracks from './data/get-tracks-HRenI3LURNk.json'
// import HRenI3LURNk_getCaptions from './data/get-captions-zh-TW-HRenI3LURNk.json'
// import Ukr40eBfeyg_getTracks from './data/get-tracks-Ukr40eBfeyg.json'
// import Ukr40eBfeyg_getCaptions from './data/get-captions-zh-TW-Ukr40eBfeyg.json'
// import _9OkddyYQBec_getCaptions from './data/get-captions-zh-TW-9OkddyYQBec.json'
import { youtube_ids } from './shows'

export const handlers = [
  http.get('https://jsonplaceholder.typicode.com/todos/2', () => {
    return HttpResponse.json({
      'userId': 2,
      'id': 2,
      'title': 'this ones mocked',
      'completed': false
    })
  }),
  http.get('https://mocked.captions.url', ({request}) => {
    const url = new URL(request.url)
    const youtube_id = url.searchParams.get('v')
    const isTracksRequest = url.searchParams.get('type') === 'list'
    const isCaptionsRequest = url.searchParams.get('fmt') === 'srv3'

    // if (youtube_id === 'HRenI3LURNk') {
    //   if (isTracksRequest)
    //     return HttpResponse.json(HRenI3LURNk_getTracks)
    //   if (isCaptionsRequest)
    //     return HttpResponse.json(HRenI3LURNk_getCaptions)
    // }

    // if (youtube_id === 'Ukr40eBfeyg') {
    //   if (isTracksRequest)
    //     return HttpResponse.json(Ukr40eBfeyg_getTracks)
    //   if (isCaptionsRequest)
    //     return HttpResponse.json(Ukr40eBfeyg_getCaptions)
    // }

    if (youtube_id === youtube_ids.has_captions__llama) {
      if (isTracksRequest)
        return HttpResponse.json(lpyKfNjTZi8_getTracks)
      if (isCaptionsRequest)
        return HttpResponse.json(lpyKfNjTZi8_getCaptions)
    }

    if (youtube_id === youtube_ids.has_no_captions__ai_camp)
      return new HttpResponse('Internal Server Error', { status: 500 })

    if (youtube_id === 'throw-network-error')
      return HttpResponse.error()

    // if (url.includes('v=9OkddyYQBec') && url.includes('fmt=srv3'))
    //   return HttpResponse.json(_9OkddyYQBec_getCaptions)
    return passthrough()
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

function createChunkEncoder() {
  const encoder = new TextEncoder()
  return function (text: string): Uint8Array {
    return encoder.encode(text)
  }
}
