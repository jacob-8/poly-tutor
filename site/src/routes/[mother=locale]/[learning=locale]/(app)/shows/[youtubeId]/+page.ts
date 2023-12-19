import type { PageLoad } from './$types'
import type { AnalyzeSyntaxRequestBody, Sentence, TranslateRequestBody, YtAddRequestBody, YtCaptionsRequestBody, YtTranscribeRequestBody } from '$lib/types'
// import { fetchSSE } from '$lib/client/fetchSSE'
// import type { ChatCompletionRequestMessage } from 'openai-edge'
import { merge_translations } from './merge_translations'
import { getCEDict } from './getCEDict'
import { check_is_in_my_videos, remove_from_my_videos, youtube_in_db } from './check-youtube'
import type { Summary, Transcript, YouTube } from '$lib/supabase/database.types'
import { invalidateAll } from '$app/navigation'
import { get } from 'svelte/store'
import type { LocaleCode } from '$lib/i18n/locales'
import { post_request } from '$lib/utils/post-request'
import { merge_syntax } from './merge_syntax'

export const load = (async ({ params: { youtubeId: youtube_id, mother, learning }, fetch, parent }) => {
  const mother_language = mother.replace(/-.*/, '') as 'zh' | 'en'
  const learning_language = learning.replace(/-.*/, '') as 'zh' | 'en'
  const { supabase, user } = await parent()
  let youtube = await youtube_in_db(youtube_id, supabase)

  let error = ''
  if (!youtube) {
    const { data, error: addingError } = await post_request<YtAddRequestBody, YouTube>('/api/yt_add', { youtube_id, language_code: learning_language }, fetch)
    if (error)
      error = addingError.message
    youtube = data
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
    if (!sentences) return

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
    const { data: sentences, error } = await post_request<YtCaptionsRequestBody, Sentence[]>('/api/yt_captions', { youtube_id, locale: learning as LocaleCode }, fetch)
    if (error) {
      console.error(error.message)
      return
    }
    return sentences
  }

  async function transcribeCaptions(openai_api_key: string) {
    const { data: sentences, error } = await post_request<YtTranscribeRequestBody, Sentence[]>('/api/yt_transcribe', { youtube_id, openai_api_key, language_code: 'zh', duration_seconds: 600 }, fetch)
    if (error)
      throw new Error(error.message)

    const { error: savingError } = await saveTranscript(sentences)
    if (savingError)
      throw new Error(savingError.message)
    invalidateAll()
  }

  // TODO: repeat same process for summary as getTranscript
  async function getSummary(): Promise<Summary | null> {
    return Promise.resolve(null)

  //   const { data: [summary], error } = await supabase
  //     .from('youtube_summaries')
  //     .select()
  //     .eq('youtube_id', youtube_id)
  //   if (error)
  //     throw new Error(error.message)
  //   return summary
  }

  // TODO: turn on
  function addSummary(openai_api_key: string): Promise<void> {
    alert('not implemented')
    console.info('transcribeCaptions', openai_api_key)
    return Promise.resolve()
    //   return new Promise((resolve) => {
    //     const currentContent = get(content)
    //     const transcript = currentContent.paragraphs.map(paragraph => {
    //       return paragraph.sentences.map(sentence => sentence.text).join('\n')
    //     }).join('\n\n')

    //     const messagesToSend: ChatCompletionRequestMessage[] = [
    //       { role: 'system', content: 'You are a professional language teacher who helps students learn language by watching films. Summarize the following transcript in less than 200 words to provide a quick preview before watching. Keep your speech simple and use 繁體中文.' },
    //       { role: 'user', content: `Transcript: ${transcript}` },
    //     ]

    //     const eventSource = fetchSSE<ChatRequestBody>('/api/chat', {
    //       messages: messagesToSend,
    //       model: 'gpt-3.5-turbo-1106',
    //       max_tokens: 600,
    //       openai_api_key
    //     })
    //     eventSource.addEventListener('message', handle_message)
    //     eventSource.addEventListener('error', (e) => console.error(e))
    //     eventSource.stream()

    //     let streamingInSummary = ''
    //     async function handle_message({detail}: CustomEvent<string>) {
    //       if (detail === '[DONE]') {
    //         const response = await apiFetch<TranslateRequestBody>('/api/translate', { text: streamingInSummary, sourceLanguageCode: 'zh', targetLanguageCode: 'en' })
    //         const translatedSummary = await response.json() as string
    //         summary.set({ summary: [{ sentences: [{text: streamingInSummary, machine_translation: { en: translatedSummary}}] }] })
    //         resolve()
    //         return
    //       }

    //       const { choices: [ { delta }] } = JSON.parse(detail) as OpenAiChatStreamResponse

  //       if (delta.content) {
  //         streamingInSummary += delta.content
  //         summary.set({ summary: [{ sentences: [{text: streamingInSummary}] }] })
  //       }
  //     }
  //   })
  }

  // TODO: move this into an endpoint to allow for translating others's captions
  async function translate(sentences: Sentence[]) {
    const text = sentences.map(sentence => sentence.text).join('\n')
    const { data, error } = await post_request<TranslateRequestBody, {line_separated_translations: string}>('/api/translate', { text, sourceLanguageCode: learning_language, targetLanguageCode: mother_language }, fetch)
    if (error) {
      console.error(error.message)
      return alert(error.message)
    }

    const sentencesWithTranslation = merge_translations(data.line_separated_translations, sentences)

    const { error: savingError } = await updateTranscript(sentencesWithTranslation)
    if (savingError) {
      console.error(savingError.message)
      return alert(savingError.message)
    }
    invalidateAll()
  }

  function updateTranscript(sentences: Sentence[]) {
    return supabase
      .from('youtube_transcripts')
      .update({
        transcript: { sentences },
      })
      .eq('youtube_id', youtube_id)
      .select()
      .single()
  }

  // TODO: move this into an endpoint to allow for analyzing others's captions
  async function analyze_syntax(sentences: Sentence[]) {
    const text = sentences.map(sentence => sentence.text).join('\n')
    const { data, error } = await post_request<AnalyzeSyntaxRequestBody, Sentence['syntax']>('/api/translate', { text, sourceLanguageCode: learning_language }, fetch)
    if (error) {
      console.error(error.message)
      return alert(error.message)
    }

    const sentencesWithSyntax = merge_syntax(data, sentences)
    const { error: savingError } = await updateTranscript(sentencesWithSyntax)
    if (savingError) {
      console.error(savingError.message)
      return alert(savingError.message)
    }
    invalidateAll()
  }

  return {
    youtube_id, // TODO: remove this by making sure youtube at least exists with id
    youtube,
    error,
    check_is_in_my_videos,
    remove_from_my_videos,
    transcribeCaptions,
    addSummary,
    translate,
    analyze_syntax,
    streamed: {
      cedict: getCEDict(),
      transcript: getTranscript(),
      summary: getSummary(),
    },
  }
}) satisfies PageLoad



