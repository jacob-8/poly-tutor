import { setupServer } from 'msw/node'
import { handlers } from './handlers'
import {writeFileSync} from 'node:fs'
import { createChunkDecoder } from '$lib/client/chunkDecoder'
import type { OpenAiChatStreamResponse } from '$lib/types'

export const server = setupServer(...handlers)

server.events.on('response:bypass', ({ request, response }) => {
  if (response.headers.get('content-type')?.includes('event-stream'))
    saveStreamedResponse(response)

  if (response.headers.get('content-type')?.includes('json')) {
    if (request.url.startsWith('https://zfxvyodqwvigxarorgjx.supabase.co/auth/v1/'))
      return
    saveJsonResponse(response)
  }

  console.info(
    '%s %s received live and saved to disk if stream or json %s %s',
    request.method,
    request.url,
    response.status,
    response.statusText
  )
})

server.events.on('response:mocked', ({ request, response }) => {
  console.info(
    '%s %s received and mocked %s %s',
    request.method,
    request.url,
    response.status,
    response.statusText
  )
})

function saveJsonResponse(response: Response) {
  const clonedResponse = response.clone()
  clonedResponse.json().then((json) => {
    writeFileSync(`./src/lib/mocks/data/${Date.now()}.json`, JSON.stringify(json, null, 2))
  })
}

function saveStreamedResponse(response: Response) {
  const timestamp = Date.now()
  const clonedResponse = response.clone()
  const reader = clonedResponse.body.getReader()
  const decoder = createChunkDecoder()

  const streamResponses: OpenAiChatStreamResponse[] = []
  let result = ''

  reader.read().then(function processResult({ done, value }) {
    if (done) {
      writeFileSync(`./src/lib/mocks/data/stream_${timestamp}.json`, JSON.stringify(streamResponses, null, 2))
      return
    }

    result += decoder(value)
    const messages = result.split('\n\n')
    result = messages.pop() // pops off the last message which may only be partially received and saves it for the next read

    messages.forEach(message => {
      message.split('\n').forEach(line => {
        const [field, ...values] = line.split(':')
        const value = values.join(':').trim()
        if (field === 'data') {
          try {
            const data = JSON.parse(value)
            streamResponses.push(data)
          } catch {
            console.info('could not parse json', value)
          }
        }
      })
    })

    reader.read().then(processResult)
  })
}
