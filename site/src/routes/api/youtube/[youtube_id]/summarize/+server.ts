import { ResponseCodes } from '$lib/responseCodes'
import { type Config, error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import type { Translation } from '$lib/types'
import { OpenAiChatModels, type ChatModels } from '$lib/types/models'
import type { ChatCompletionRequestMessage, CreateChatCompletionRequest, CreateChatCompletionResponse } from 'openai-edge'
import type { LocaleCode } from '$lib/i18n/locales'

export const config: Config = { maxDuration: 300 }

export interface YoutubeSummarizeRequestBody {
  openai_api_key: string
  transcript: string // TODO in future just send the timestamps and then fetch the transcript from the db then map it to a string with sentences.map(sentence => sentence.text).join('\n')
  start_ms: number
  end_ms: number
  mother: LocaleCode
  learning: LocaleCode
  title: string
}
export type YoutubeSummarizeResponseBody = Translation

export const POST: RequestHandler = async ({ locals: { getSession }, params: { youtube_id }, request, fetch: _fetch }) => {
  const { data: session_data, error: _error, supabase } = await getSession()
  if (_error || !session_data?.user)
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  const { openai_api_key, start_ms, end_ms, mother, learning, transcript, title } = await request.json() as YoutubeSummarizeRequestBody

  try {
    // TODO: ask gpt for a title from the summary (if none on chapter from youtube) and return both (add a title translations field to the youtube_summaries table)
    const model: ChatModels = OpenAiChatModels.GPT3_5

    const requested_language = mother === 'zh-TW'
      ? '繁體中文。'
      : mother === 'zh-CN'
        ? '简体中文。'
        : 'English.'

    const messages: ChatCompletionRequestMessage[] = [
      { role: 'system', content: `I am learning ${learning === 'en' ? 'English' : '中文'}. Summarize the following transcript from a portion of a YouTube video. Use less than 200 words to provide a quick preview before I watch. Use ${requested_language}.` },
      { role: 'user', content: `Video title: ${title}
     
Transcript: ${transcript}` },
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
    const summary: Translation = { [mother]: reply }

    const { error: saving_error } = await supabase
      .from('youtube_summaries')
      .insert({
        youtube_id,
        start_ms,
        end_ms,
        translations: summary,
        source: model,
      })
      .select()
      .single()
    if (saving_error)
      throw new Error(saving_error.message)

    return json(summary satisfies YoutubeSummarizeResponseBody)
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
