import type { RequestHandler } from './$types'
import type { CreateChatCompletionRequest, ChatCompletionRequestMessage, CreateChatCompletionResponse } from 'openai-edge'
import { error } from '@sveltejs/kit'
import type { Config } from '@sveltejs/adapter-vercel'
import { ResponseCodes } from '$lib/responseCodes'
import type { ChatModels } from '$lib/types/models'
// import { createChunkDecoder } from '$lib/client/chunkDecoder'

export const config: Config = { runtime: 'edge' }

export interface OpenAiChatStreamResponse extends Omit<CreateChatCompletionResponse, 'usage'> {
  choices: {
    index: number;
    delta: {
      content?: string;
    };
    finish_reason: string | null;
  }[];
}

export interface ChatRequestBody {
  messages: ChatCompletionRequestMessage[]
  model: ChatModels
  max_tokens: number
  openai_api_key: string
  stream?: boolean
}

export const POST: RequestHandler = async ({ locals: { getSession }, request }) => {
  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user)
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  const { messages, model, max_tokens, openai_api_key, stream } = await request.json() as ChatRequestBody

  if (!openai_api_key) error(ResponseCodes.BAD_REQUEST, 'No openai_api_key found')
  if (!messages?.length) error(ResponseCodes.BAD_REQUEST, 'No messages found')

  try {
    const completionRequest: CreateChatCompletionRequest = {
      model,
      messages,
      max_tokens,
      stream: stream ?? true,
      temperature: 0,
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openai_api_key}`,
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
    //   console.info(chunk)
    // }

    return new Response(response.body, { headers: { 'Content-Type': 'text/event-stream;charset=utf-8' } })
  } catch (err) {
    console.error(err.message)
    error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
  }
}
