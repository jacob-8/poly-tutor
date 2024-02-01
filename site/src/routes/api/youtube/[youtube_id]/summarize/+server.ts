import { ResponseCodes } from '$lib/responseCodes'
import { type Config, error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import type { Sentence } from '$lib/types'
// import { OpenAiChatModels, type ChatModels } from '$lib/types/models'

export const config: Config = { maxDuration: 300 }

export interface YoutubeSummarizeRequestBody {
  openai_api_key: string
  chapter_index: number
}
export type YoutubeSummarizeResponseBody = Sentence[]

export const POST: RequestHandler = async ({ locals: { getSession }, params: { youtube_id }, request }) => {
  const { data: session_data, error: _error } = await getSession() // TODO fix typing problem from supabase here
  if (_error || !session_data?.user)
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  const { chapter_index } = await request.json() as YoutubeSummarizeRequestBody

  try {
    // TODO: ask gpt for a title from the summary (if none from youtube) and return both (add a title translations field to the youtube_summaries table)
    console.info({youtube_id, chapter_index})

    // const {data, error: saving_error} = await supabase
    //   .from('youtube_summaries')
    //   .insert({
    //     youtube_id,
    //     start_ms: 0,
    //     end_ms: 10000,
    //     summary: { sentences: [] },
    //     source: 'CHANGE_ME',
    //   })
    //   .select()
    //   .single()


    return json('hi')
  } catch (err) {
    console.error(err.message)
    error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
  }
}

// function addSummary({sentences}: {sentences: Sentence[]}): Promise<void> {
//   return new Promise((resolve) => {
//     if (!openai_api_key) return resolve()

//     const model: ChatModels = OpenAiChatModels.GPT3_5
//     const transcript = sentences.map(sentence => sentence.text).join('\n')

//     const messagesToSend: ChatCompletionRequestMessage[] = [
//       { role: 'system', content: 'You are a professional language teacher who helps students learn language by watching films. Summarize the following transcript in less than 200 words to provide a quick preview before watching. Keep your speech simple and use 繁體中文.' },
//       { role: 'user', content: `Transcript: ${transcript}` },
//     ]

//     const eventSource = fetchSSE<ChatRequestBody>('/api/chat', {
//       messages: messagesToSend,
//       model,
//       max_tokens: 600,
//       openai_api_key
//     })
//     eventSource.addEventListener('message', handle_message)
//     eventSource.addEventListener('error', (e) => console.error(e))
//     eventSource.stream()

//     let streamed_in_summary = ''
//     async function handle_message({detail}: CustomEvent<string>) {
//       if (detail === '[DONE]') {
//         const { data: translated_summary, error } = await post_request<TranslateRequestBody, {line_separated_translations: string}>('/api/translate', { text: streamed_in_summary, sourceLanguageCode: learning, targetLanguageCode: mother }, fetch)
//         if (error) {
//           console.error(error.message)
//           alert(error.message)
//         }
//         const final_summary: Sentence[] = [{ text: streamed_in_summary, translation: { [mother]: translated_summary.line_separated_translations }}]
//         summary.set(await split_sentences(final_summary))

//         const { error: savingError } = await saveSummary(final_summary, model)
//         if (savingError) {
//           console.error(savingError.message)
//           alert(savingError.message)
//         }
//         resolve()
//         return
//       }

//       const { choices: [ { delta }] } = JSON.parse(detail) as OpenAiChatStreamResponse

//       if (delta.content) {
//         streamed_in_summary += delta.content
//         summary.set([{ text: streamed_in_summary }])
//       }
//     }
//   })
// }
