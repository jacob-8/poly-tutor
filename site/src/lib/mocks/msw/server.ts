import { setupServer } from 'msw/node'
import { handlers } from './server-handlers'
import { writeFileSync } from 'node:fs'
import { createChunkDecoder } from '$lib/client/chunkDecoder'
import type { OpenAiChatStreamResponse } from '$lib/types'

export const server = setupServer(...handlers)

// server.events.on('request:start', ({ request }) => {
//   console.log({url: request.url})
// })

server.events.on('response:bypass', ({ request, response }) => {
  const LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321'
  const DEPLOYED_SUPABASE_URL = 'https://tjsnduoporqqlrbbpola.supabase.co'
  if (request.url.startsWith(LOCAL_SUPABASE_URL) || request.url.startsWith(DEPLOYED_SUPABASE_URL))
    return

  if (!response.status.toString().startsWith('2'))
    return console.error(`${request.method} ${request.url} had a ${response.status} ${response.statusText} response. The Error response was not saved to disk.`)

  if (response.headers.get('content-type')?.includes('event-stream')) {
    saveStreamedResponse(response)
    return console.info(`${request.method} ${request.url} had a ${response.status} ${response.statusText} response. The stream was received live and saved to disk.`)
  }

  if (response.headers.get('content-type')?.includes('json')) {
    saveJsonResponse(response)
    return console.info(`${request.method} ${request.url} had a ${response.status} ${response.statusText} response. The json was received live and saved to disk.`)
  }
})

server.events.on('response:mocked', ({ request, response }) => {
  console.info(`MOCKED: ${request.method} ${request.url} with ${response.status} ${response.statusText}`)
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
