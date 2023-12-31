import type { RequestHandler } from './$types'
import type { CreateChatCompletionRequest } from 'openai-edge'
import { OPENAI_API_KEY } from '$env/static/private'
import { error } from '@sveltejs/kit'
import type { Config } from '@sveltejs/adapter-vercel'
import { ResponseCodes } from '$lib/responseCodes'
import type { ChatRequestBody } from '$lib/types'
// import { createChunkDecoder } from '$lib/client/chunkDecoder'

export const config: Config = {
  runtime: 'edge',
}

export const POST: RequestHandler = async ({ locals: { getSession }, request }) => {
  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user)
    throw error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  const { messages, model, max_tokens, openai_api_key } = await request.json() as ChatRequestBody

  let api_key = openai_api_key

  if (!api_key && session_data.user.email === 'jacob@polylingual.dev')
    api_key = OPENAI_API_KEY

  if (!api_key) throw error(ResponseCodes.BAD_REQUEST, 'No OPENAI_API_KEY found')

  try {
    const completionRequest: CreateChatCompletionRequest = {
      model,
      messages,
      max_tokens,
      stream: true,
      temperature: 0,
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${api_key}`,
      },
      body: JSON.stringify(completionRequest),
    })

    // uncomment to inspect the response on server though it will wait until done to send to the client
    // const responseClone = response.clone()
    // const reader = responseClone.body.getReader()
    // const decoder = createChunkDecoder()

    // while (true) {
    //   const { done, value } = await reader.read()
    //   if (done) break
    //   const chunk = decoder(value)
    //   console.log(chunk)
    // }

    return new Response(response.body, { headers: { 'Content-Type': 'text/event-stream;charset=utf-8' } })
  } catch (err) {
    console.error(err.message)
    throw error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
  }
}
