import type { PageLoad } from './$types'
import type { ChatRequestBody, OpenAiChatStreamResponse, Sentence, StudyWords, TranslateRequestBody, YtAddRequestBody, YtCaptionsRequestBody, YtTranscribeRequestBody, YtTranslateRequestBody } from '$lib/types'
import { fetchSSE } from '$lib/client/fetchSSE'
import type { ChatCompletionRequestMessage } from 'openai-edge'
import { check_is_in_my_videos, remove_from_my_videos, youtube_in_db } from './check-youtube'
import type { Transcript, YouTube } from '$lib/supabase/database.types'
import { get, writable } from 'svelte/store'
import { post_request } from '$lib/utils/post-request'
import { browser } from '$app/environment'
import { get_openai_api_key, open_auth } from '$lib/client/UserInfo.svelte'
import { OpenAiChatModels, type ChatModels } from '$lib/types/models'

export const load = (async ({ params: { youtubeId: youtube_id, mother, learning }, fetch, parent }) => {
  const learning_language = learning.replace(/-.*/, '') as 'zh' | 'en'
  const { supabase, user, split_sentences, analyze_sentences } = await parent()
  let youtube = await youtube_in_db(youtube_id, supabase)

  let error = ''
  if (!youtube) {
    const { data, error: addingError } = await post_request<YtAddRequestBody, YouTube>('/api/yt_add', { youtube_id, language_code: learning_language }, fetch)
    if (addingError) {
      error = addingError.message
      youtube = { id: youtube_id } as YouTube
    } else {
      youtube = data
    }
  }

  async function getTranscript(): Promise<Transcript | null> {
    const { data: [transcript], error } = await supabase
      .from('youtube_transcripts')
      .select()
      .eq('youtube_id', youtube_id)
    if (error)
      throw new Error(error.message)
    if (transcript)
      return transcript

    const sentences = await getYoutubesCaptions()
    if (!sentences) return null

    const { data: justSavedTranscript, error: savingError } = await saveTranscript(sentences)
    if (savingError)
      throw new Error(savingError.message)
    return justSavedTranscript
  }

  function saveTranscript(sentences: Sentence[]) {
    return supabase
      .from('youtube_transcripts')
      .insert({
        youtube_id,
        transcript: { sentences },
        transcript_source: 'youtube',
      })
      .select()
      .single()
  }

  async function getYoutubesCaptions() {
    if (!get(user)) return
    const { data: sentences, error } = await post_request<YtCaptionsRequestBody, Sentence[]>('/api/yt_captions', { youtube_id, locale: learning }, fetch)
    if (error) {
      console.error(error.message)
      return
    }
    return sentences
  }

  async function transcribe_captions(): Promise<{ sentences: Sentence[], study_words: StudyWords} | void> {
    const openai_api_key = get_openai_api_key()
    if (!openai_api_key) return
    const { data: sentences, error } = await post_request<YtTranscribeRequestBody, Sentence[]>('/api/yt_transcribe', { youtube_id, openai_api_key, language_code: 'zh', duration_seconds: 600 }, fetch)
    if (error) {
      console.error(error.message)
      return alert(error.message)
    }

    const { error: savingError } = await saveTranscript(sentences)
    if (savingError) {
      console.error(savingError.message)
      return alert(savingError.message)
    }
    return await analyze_sentences(sentences)
  }

  const summary = writable<Sentence[] | null>(null, (set) => {
    if (!browser) return
    supabase
      .from('youtube_summaries')
      .select()
      .eq('youtube_id', youtube_id)
      .then(async ({ data: [summary], error }) => {
        if (error)
          console.error(error.message)
        if (summary?.summary?.sentences)
          set(await split_sentences(summary.summary.sentences))
      })
  })

  function addSummary({sentences}: {sentences: Sentence[]}): Promise<void> {
    return new Promise((resolve) => {
      const openai_api_key = get_openai_api_key()
      if (!openai_api_key) return resolve()

      const model: ChatModels = OpenAiChatModels.GPT3_5
      const transcript = sentences.map(sentence => sentence.text).join('\n')

      const messagesToSend: ChatCompletionRequestMessage[] = [
        { role: 'system', content: 'You are a professional language teacher who helps students learn language by watching films. Summarize the following transcript in less than 200 words to provide a quick preview before watching. Keep your speech simple and use 繁體中文.' },
        { role: 'user', content: `Transcript: ${transcript}` },
      ]

      const eventSource = fetchSSE<ChatRequestBody>('/api/chat', {
        messages: messagesToSend,
        model,
        max_tokens: 600,
        openai_api_key
      })
      eventSource.addEventListener('message', handle_message)
      eventSource.addEventListener('error', (e) => console.error(e))
      eventSource.stream()

      let streamed_in_summary = ''
      async function handle_message({detail}: CustomEvent<string>) {
        if (detail === '[DONE]') {
          const { data: translated_summary, error } = await post_request<TranslateRequestBody, {line_separated_translations: string}>('/api/translate', { text: streamed_in_summary, sourceLanguageCode: learning, targetLanguageCode: mother }, fetch)
          if (error) {
            console.error(error.message)
            alert(error.message)
          }
          const final_summary: Sentence[] = [{ text: streamed_in_summary, translation: { [mother]: translated_summary.line_separated_translations }}]
          summary.set(await split_sentences(final_summary))

          const { error: savingError } = await saveSummary(final_summary, model)
          if (savingError) {
            console.error(savingError.message)
            alert(savingError.message)
          }
          resolve()
          return
        }

        const { choices: [ { delta }] } = JSON.parse(detail) as OpenAiChatStreamResponse

        if (delta.content) {
          streamed_in_summary += delta.content
          summary.set([{ text: streamed_in_summary }])
        }
      }
    })
  }

  function saveSummary(sentences: Sentence[], source: string) {
    return supabase
      .from('youtube_summaries')
      .insert({
        youtube_id,
        start_ms: 0,
        end_ms: 10000,
        summary: { sentences },
        summary_source: source,
      })
      .select()
      .single()
  }

  async function translate(): Promise<Sentence[] | void> {
    if (!get(user)) return open_auth()
    const transcript = await getTranscript()
    const { data: sentences_with_translation, error: translate_error } = await post_request<YtTranslateRequestBody, Sentence[]>('/api/youtube/translate', { youtube_id, learning, mother, sentences: transcript.transcript.sentences }, fetch)
    if (translate_error) {
      console.error(translate_error.message)
      return alert(translate_error.message)
    }
    return sentences_with_translation
  }

  // If using, move into an endpoint to allow for analyzing others's captions
  // async function analyze_syntax(sentences: Sentence[]) {
  //   const text = sentences.map(sentence => sentence.text).join('\n')
  //   const { data, error } = await post_request<AnalyzeSyntaxRequestBody, Sentence['syntax']>('/api/analyze_syntax', { text, sourceLanguageCode: learning_language }, fetch)
  //   if (error) {
  //     console.error(error.message)
  //     return alert(error.message)
  //   }

  //   const sentencesWithSyntax = merge_syntax(data, sentences)
  //   const { error: savingError } = await updateTranscript(sentencesWithSyntax)
  //   if (savingError) {
  //     console.error(savingError.message)
  //     return alert(savingError.message)
  //   }
  //   invalidateAll()
  // }

  async function prepare_content(): Promise<{ sentences: Sentence[], study_words: StudyWords}> {
    if (!browser) return undefined // don't use null as that will mistakenly show option to transcribe for a moment when we just need to wait until the client inits
    const transcript = await getTranscript()
    if (!transcript) return { sentences: null, study_words: null }
    const { sentences } = transcript.transcript
    const index_of_sentence_over_30_minutes = sentences.findIndex(sentence => sentence.end_ms > 1000 * 60 * 30)

    // TODO: chapters
    // get chapters from DB (fetch and save if first time)
    // check if chapter ID exists in URL
    // If no chapters, then "make" chapters based on five minute sections. Don't orphan the last one at less than 1 minute though.

    if (index_of_sentence_over_30_minutes > -1)
      return await analyze_sentences(sentences.slice(0, index_of_sentence_over_30_minutes))

    return await analyze_sentences(sentences)
  }

  return {
    youtube,
    summary,
    error,
    check_is_in_my_videos,
    remove_from_my_videos,
    transcribe_captions,
    addSummary,
    translate,
    title: split_sentences([{text: youtube.title}]),
    description: split_sentences([{text: youtube.description}]),
    content: prepare_content(),
  }
}) satisfies PageLoad



