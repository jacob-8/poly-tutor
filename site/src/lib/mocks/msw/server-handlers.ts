import { http, HttpResponse, passthrough } from 'msw'
import streamResponses from '../data/stream_penguin.json'
import lpyKfNjTZi8_getTracks from '../data/get-tracks-lpyKfNjTZi8.json'
import lpyKfNjTZi8_getCaptions from '../data/get-captions-zh-TW-lpyKfNjTZi8.json'
// import HRenI3LURNk_getTracks from './data/get-tracks-HRenI3LURNk.json'
// import HRenI3LURNk_getCaptions from './data/get-captions-zh-TW-HRenI3LURNk.json'
// import Ukr40eBfeyg_getTracks from './data/get-tracks-Ukr40eBfeyg.json'
// import Ukr40eBfeyg_getCaptions from './data/get-captions-zh-TW-Ukr40eBfeyg.json'
// import _9OkddyYQBec_getCaptions from './data/get-captions-zh-TW-9OkddyYQBec.json'
import { unseeded_youtubes } from '../seed/youtubes'
import type { WhisperTranscript, ExternalYoutubeTranscribeRequestBody, ChatRequestBody } from '$lib/types'
import { ResponseCodes } from '$lib/responseCodes'

export const handlers = [
  http.post('https://jacob-8--whisper-transcriber-fastapi-app.modal.run/transcribe/youtube', async ({request}) => {
    const clonedRequest = request.clone()
    const { poly_key, language, youtube_id } = await clonedRequest.json() as ExternalYoutubeTranscribeRequestBody
    if (youtube_id !== unseeded_youtubes.zh_no_captions__ai_camp.id && poly_key !== 'test-key')
      return passthrough()

    if (language === 'fr') {
      return new HttpResponse('French language not supported', {
        status: ResponseCodes.BAD_REQUEST,
        headers: {
          'Content-Type': 'text/plain',
        },
      })
    }

    const body: WhisperTranscript = {
      transcript: [
        {
          text: language === 'en' ? 'This is a mocked Whisper transcription' : '這是一個模擬的Whisper轉錄',
          start_second: 0,
          end_second: 4,
        },
        {
          text: language === 'en' ? 'And another sentence' : '還有一個句子',
          start_second: 4,
          end_second: 8,
        },
      ]
    }
    return HttpResponse.json(body)
  }),

  http.get('https://mocked.captions.url', ({request}) => {
    const url = new URL(request.url)
    const youtube_id = url.searchParams.get('v')
    const isTracksRequest = url.searchParams.get('type') === 'list'
    const isCaptionsRequest = url.searchParams.get('fmt') === 'srv3'

    if (youtube_id === unseeded_youtubes.zh_captions_on_youtube__llama.id) {
      if (isTracksRequest)
        return HttpResponse.json(lpyKfNjTZi8_getTracks)
      if (isCaptionsRequest)
        return HttpResponse.json(lpyKfNjTZi8_getCaptions)
    }

    if (youtube_id === unseeded_youtubes.zh_no_captions__ai_camp.id) {
      return new HttpResponse('Internal Server Error', { status: 500, headers: {
        'Content-Type': 'text/plain',
      } })
    }

    if (youtube_id === 'throw-network-error')
      return HttpResponse.error()

    return passthrough()
  }),

  http.post('https://example.com/stream', () => {
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

  http.post('https://api.openai.com/v1/chat/completions', async ({request}) => {
    const { messages } = await request.json() as ChatRequestBody

    const lastMessage = messages[messages.length - 1].content
    if (lastMessage === 'BUG!') throw new Error('BUG!')

    const encode = createChunkEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        for (const msg of streamResponses) {
          controller.enqueue(encode(`data: ${JSON.stringify(msg)}\n\n`))
          const randomMs = Math.floor(Math.random() * 20)
          await new Promise(resolve => setTimeout(resolve, randomMs))
        }

        controller.enqueue(encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    })
  }),
]

function createChunkEncoder() {
  const encoder = new TextEncoder()
  return function (text: string): Uint8Array {
    return encoder.encode(text)
  }
}
