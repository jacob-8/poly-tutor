import { ResponseCodes } from '$lib/responseCodes'
import { type Config, error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import type { Sentence } from '$lib/types'
import { OpenAiChatModels, type ChatModels } from '$lib/types/models'
import type { ChatCompletionRequestMessage, CreateChatCompletionRequest, CreateChatCompletionResponse } from 'openai-edge'
import type { LocaleCode } from '$lib/i18n/locales'
import { translate_sentences } from '$api/translate/translate-sentences'
import { split_into_sentences } from '../add/split_string_into_sentences'

export const config: Config = { maxDuration: 300 }

export interface YoutubeSummarizeRequestBody {
  openai_api_key: string
  transcript: string // TODO in future just send the timestamps and then fetch the transcript from the db then map it to a string with sentences.map(sentence => sentence.text).join('\n')
  start_ms: number
  end_ms: number
  mother: LocaleCode
  learning: LocaleCode
}
export type YoutubeSummarizeResponseBody = Sentence[]

export const POST: RequestHandler = async ({ locals: { getSession }, params: { youtube_id }, request, fetch }) => {
  const { data: session_data, error: _error, supabase } = await getSession()
  if (_error || !session_data?.user)
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  const { openai_api_key, start_ms, end_ms, mother, learning, transcript } = await request.json() as YoutubeSummarizeRequestBody

  try {
    // Future TODO: ask gpt for a title from the summary (if none from youtube) and return both (add a title translations field to the youtube_summaries table)
    const model: ChatModels = OpenAiChatModels.GPT3_5

    const requested_language = learning === 'zh-TW'
      ? '繁體中文。'
      : learning === 'zh-CN'
        ? '简体中文。'
        : 'English.'

    const messages: ChatCompletionRequestMessage[] = [
      { role: 'system', content: `You are a professional language teacher who helps students learn language by watching films. Summarize the following transcript in less than 200 words to provide a quick preview before watching. Keep your speech simple and use ${requested_language}.` },
      { role: 'user', content: `Transcript: ${transcript}` },
    ]

    const completionRequest: CreateChatCompletionRequest = {
      model,
      messages,
      max_tokens: 700,
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
    const completion = await response.json() as CreateChatCompletionResponse
    const reply = completion.choices[0].message.content

    const sentences: Sentence[] = split_into_sentences(reply).map(text => ({ text }))
    const sentences_with_translation = await translate_sentences({ sentences, mother, learning, _fetch: fetch })
    const { error: saving_error } = await supabase
      .from('youtube_summaries')
      .insert({
        youtube_id,
        start_ms,
        end_ms,
        sentences: sentences_with_translation,
        source: model,
      })
      .select()
      .single()
    if (saving_error)
      throw new Error(saving_error.message)

    return json(sentences_with_translation satisfies YoutubeSummarizeResponseBody)
  } catch (err) {
    console.error(err.message)
    error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
  }
}

// Old streaming example
// return new Promise((resolve) => {
//   if (!openai_api_key) return resolve()

//   const eventSource = fetchSSE<ChatRequestBody>('/api/chat', {
//     messages: messagesToSend,
//     model,
//     max_tokens: 600,
//     openai_api_key
//   })
//   eventSource.addEventListener('message', handle_message)
//   eventSource.addEventListener('error', (e) => console.error(e))
//   eventSource.stream()

//   let streamed_in_summary = ''
//   async function handle_message({detail}: CustomEvent<string>) {
//     if (detail === '[DONE]') {
//       if (error) {
//         console.error(error.message)
//         alert(error.message)
//       }
//       summary.set(streamed_in_summary)
//       resolve()
//       return
//     }

//     const { choices: [ { delta }] } = JSON.parse(detail) as OpenAiChatStreamResponse

//     if (delta.content) {
//       streamed_in_summary += delta.content
//       summary.set(streamed_in_summary)
//     }
//   }
// })
