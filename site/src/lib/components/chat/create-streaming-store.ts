import type { ChatCompletionRequestMessage } from 'openai-edge'
import { writable } from 'svelte/store'
import { type GenerateContentRequest, GoogleGenerativeAI  } from '@google/generative-ai'
import { ResponseCodes } from '$lib/response-codes'
import { createChunkDecoder } from '$lib/client/chunkDecoder'
import type { ChatRequestBody, OpenAiChatStreamResponse } from '$api/chat/+server'
import { OpenAiChatModels } from '$lib/types/models'

export interface StreamingStoreArguments {
  messages: ChatCompletionRequestMessage[]
  api_key: string
}

export function create_openai_streaming_store({messages, api_key}: StreamingStoreArguments) {
  const { subscribe, set } = writable('')

  const data: ChatRequestBody = {
    model: OpenAiChatModels.GPT4,
    openai_api_key: api_key,
    max_tokens: 1000,
    messages,
  }

  async function stream() {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (response.status !== ResponseCodes.OK) {
      const { message } = await response.json()
      console.error(message)
      set(`[ERROR] ${message}`)
      return
    }

    const reader = response.body.getReader()
    const decoder = createChunkDecoder()

    let result = ''

    reader.read().then(function processResult({ done, value }) {
      if (done) return

      result += decoder(value)

      const messages = result.split('\n\n')
      result = messages.pop() // pops off the last message which may only be partially received and saves it for the next read

      messages.forEach(message => {
        let data = ''

        message.split('\n').forEach(line => {
          const [field, ...values] = line.split(':')
          const value = values.join(':').trim()
          if (field === 'data') data = value
        })

        if (data === '[DONE]') return set('[DONE]')

        const { choices: [ { delta }] } = JSON.parse(data) as OpenAiChatStreamResponse
        if (delta.content)
          set(delta.content)
      })
      reader.read().then(processResult)
    })
  }
  stream()
  return { subscribe }
}

// https://aistudio.google.com/app/apikey
// TODO: Gemini returns more than a sentence at a time and that currently cannot be handled
export function create_gemini_streaming_store({messages, api_key}: StreamingStoreArguments) {
  const { subscribe, set } = writable('')

  const genAI = new GoogleGenerativeAI(api_key)

  // const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent?key=${api_key}`

  const data: GenerateContentRequest = {
    contents: messages.map((message) => {
      return {
        role:
          message.role === 'system' ? 'user' :
            message.role === 'assistant' ? 'model' :
              'user',
        parts: message.content.split('\n').map((text) => {
          return {text}
        })
      }
    }),
    generationConfig: {
      temperature: 0.9,
      // candidateCount: 1,
    }
  }

  console.info({data})

  async function stream() {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro'})

    try {
      const result = await model.generateContentStream(data)
      for await (const chunk of result.stream) {
        const chunkText = chunk.text()
        set(chunkText)
      }
    } catch (error) {
      set(`[ERROR] ${error.message}`)
      console.info({error})
    }

    set('[DONE]')
  }
  stream()

  return { subscribe }
}
