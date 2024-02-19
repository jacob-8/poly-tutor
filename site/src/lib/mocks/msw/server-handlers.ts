import type { ExtenralYoutubeTranscribeRequestResponse, ExternalYoutubeTranscribeRequestBody } from '$lib/types'
import { http, HttpResponse, passthrough } from 'msw'
import { ResponseCodes } from '$lib/responseCodes'
import { create_chat_completion_data } from '../data/create_chat_completion'
import { fake_ch__penguin_summary, unseeded_youtubes } from '../seed/youtubes'

import lpyKfNjTZi8_getTracks from '../data/get-tracks-lpyKfNjTZi8.json'
import lpyKfNjTZi8_getCaptions from '../data/get-captions-zh-TW-lpyKfNjTZi8.json'
import youtube_api_video_id_9OkddyYQBec from '../data/youtube_api_video_id_9OkddyYQBec.json'
import youtube_api_channel_id_UCkceO_uT0eWlMhX from '../data/youtube_api_channel_id_UCkceO_uT0eWlMhX-04rxAMQ.json'
import youtube_api_video_id_lpyKfNjTZi8 from '../data/youtube_api_video_id_lpyKfNjTZi8.json'
import youtube_api_channel_id_UCs53vwIrtmBTr from '../data/youtube_api_channel_id_UCs53vwIrtmBTr-NAfqYYt6w.json'
import youtube_api_playlistItems_bike_rider from '../data/youtube_api_playlistItems_jian-xiao-bai-bike-rider.json'
import type { CreateChatCompletionRequest } from 'openai-edge'

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

    const body: ExtenralYoutubeTranscribeRequestResponse = {
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

  http.get('https://www.googleapis.com/youtube/v3/videos', ({request}) => {
    const url = new URL(request.url)
    const part = url.searchParams.get('part')
    const youtube_id = url.searchParams.get('id')
    if (part === 'snippet,contentDetails,statistics' && youtube_id === unseeded_youtubes.zh_no_captions__ai_camp.id)
      return HttpResponse.json(youtube_api_video_id_9OkddyYQBec)
    if (part === 'snippet,contentDetails,statistics' && youtube_id === unseeded_youtubes.zh_captions_on_youtube__llama.id)
      return HttpResponse.json(youtube_api_video_id_lpyKfNjTZi8)
    return passthrough()
  }),

  http.get('https://www.googleapis.com/youtube/v3/channels', ({request}) => {
    const url = new URL(request.url)
    const part = url.searchParams.get('part')
    const channel_id = url.searchParams.get('id')
    if (part === 'snippet,statistics' && channel_id === unseeded_youtubes.zh_no_captions__ai_camp.channel_id)
      return HttpResponse.json(youtube_api_channel_id_UCkceO_uT0eWlMhX)
    if (part === 'snippet,statistics' && channel_id === unseeded_youtubes.zh_captions_on_youtube__llama.channel_id)
      return HttpResponse.json(youtube_api_channel_id_UCs53vwIrtmBTr)
    return passthrough()
  }),

  http.get('https://www.googleapis.com/youtube/v3/playlistItems', ({request}) => {
    const url = new URL(request.url)
    const playlistId = url.searchParams.get('playlistId')
    const bike_rider_playlist_id = 'PLz_e7apcBzpuVEVC-_pvHDKLq7T_0MbcZ'
    if (playlistId === bike_rider_playlist_id)
      return HttpResponse.json(youtube_api_playlistItems_bike_rider)
    return passthrough()
  }),

  http.get('https://cors-proxy.*', ({request}) => {
    const url = new URL(request.url)
    const isTracksRequest = url.searchParams.get('type') === 'list'
    const isCaptionsRequest = url.searchParams.get('fmt') === 'srv3'

    if (url.search.includes(unseeded_youtubes.zh_captions_on_youtube__llama.id)) {
      if (isTracksRequest)
        return HttpResponse.json(lpyKfNjTZi8_getTracks)
      if (isCaptionsRequest)
        return HttpResponse.json(lpyKfNjTZi8_getCaptions)
    }

    if (url.search.includes(unseeded_youtubes.zh_no_captions__ai_camp.id)) {
      return new HttpResponse('Internal Server Error', { status: 500, headers: {
        'Content-Type': 'text/plain',
      } })
    }

    if (url.search.includes('throw-network-error'))
      return HttpResponse.error()

    return passthrough()
  }),

  http.post('https://api.openai.com/v1/chat/completions', async ({request}) => {
    const clonedRequest = request.clone()
    const { messages, stream: is_streaming } = await clonedRequest.json() as CreateChatCompletionRequest
    if (!is_streaming)
      return passthrough()
    const lastMessage = messages[messages.length - 1].content
    if (lastMessage === 'BUG!') throw new Error('BUG!')

    const encode = createChunkEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const message = fake_ch__penguin_summary.split('')

        for (const msg of create_chat_completion_data(message)) {
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
