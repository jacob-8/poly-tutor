import type { PageLoad } from './$types'
import type { AnalyzeSyntaxRequestBody, ChatRequestBody, OpenAiChatStreamResponse, Sentence, TranslateRequestBody, YtCaptionsRequestBody, YtTranscribeRequestBody } from '$lib/types'
import { get } from 'svelte/store'
import { apiFetch } from '$lib/utils/apiFetch'
import { fetchSSE } from '$lib/client/fetchSSE'
import type { ChatCompletionRequestMessage } from 'openai-edge'
import { merge_translations } from './merge_translations'
import { merge_syntax } from './merge_syntax'
import { getCEDict } from './getCEDict'
import { add_youtube_to_db, check_is_in_my_videos, remove_from_my_videos, youtube_in_db } from './check-youtube'
import type { Summary, Transcript } from '$lib/supabase/database.types'

export const load = (async ({ params: { youtubeId: youtube_id }, fetch, parent }) => {
  const { supabase } = await parent()
  let youtube = await youtube_in_db(youtube_id, supabase)

  let error = ''
  if (!youtube)
    ({ youtube, error } = await add_youtube_to_db(youtube_id, fetch))

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
    if (!sentences.length) return null

    const { data: justSavedTranscript, error: savingError } = await supabase
      .from('youtube_transcripts')
      .insert({
        youtube_id,
        transcript: { sentences },
        transcript_source: 'youtube',
      })
      .select()
      .single()

    if (savingError)
      throw new Error(savingError.message)
    return justSavedTranscript
  }

  async function getYoutubesCaptions() {
    const response = await apiFetch<YtCaptionsRequestBody>('/api/yt_captions', { youtube_id }, fetch)
    const body = await response.json()
    if (!response.ok) {
      console.error(body.message)
      return []
    }
    return body as Sentence[]
  }

  // TODO: repeat same process for summary

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

  async function transcribeCaptions(openai_api_key: string) {
    alert('not implemented')
    console.info('transcribeCaptions', openai_api_key)
  //   const response = await apiFetch<YtTranscribeRequestBody>('/api/yt_transcribe', { youtube_id, openai_api_key, language_code: 'zh', duration_seconds: 600 }, fetch)
  //   if (!response.ok) return
  //   const sentences = await response.json() as Sentence[]
  //   content.set({ paragraphs: [{ sentences }] })
  }

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

  function deleteTranscript() {
    alert('not implemented')
  }

  function deleteSummary() {
    alert('not implemented')
  }


  async function translate() {
    alert('not implemented')
    //   const currentContent = get(content)
    //   if (!currentContent.paragraphs?.length) return
    //   const [firstParagraph] = currentContent.paragraphs
    //   const lineSeparatedText = firstParagraph.sentences.map(sentence => sentence.text).join('\n')

    //   const response = await apiFetch<TranslateRequestBody>('/api/translate', { text: lineSeparatedText, sourceLanguageCode: 'zh', targetLanguageCode: 'en' })
    //   const lineSeparatedTranslations = await response.json() as string // separated by /n

  //   const sentencesWithTranslation = merge_translations(lineSeparatedTranslations, firstParagraph.sentences)
  //   content.set({ ...currentContent, paragraphs: [{ sentences: sentencesWithTranslation }] })
  }

  async function analyze_syntax() {
    alert('not implemented')
    //   const currentContent = get(content)
    //   if (!currentContent.paragraphs?.length) return
    //   const [firstParagraph] = currentContent.paragraphs
    //   const lineSeparatedText = firstParagraph.sentences.map(sentence => sentence.text).join('\n')
    //   const response = await apiFetch<AnalyzeSyntaxRequestBody>('/api/analyze_syntax', { text: lineSeparatedText, sourceLanguageCode: 'zh' })
    //   const syntax = await response.json() as Sentence['syntax']
    //   const sentencesWithSyntax = merge_syntax(syntax, firstParagraph.sentences)
    //   content.set({ ...currentContent, paragraphs: [{ sentences: sentencesWithSyntax }] })
  }

  return {
    youtube_id, // remove this by making sure youtube at least exists with id
    youtube,
    error,
    check_is_in_my_videos,
    remove_from_my_videos,
    transcribeCaptions,
    deleteTranscript,
    addSummary,
    deleteSummary,
    translate,
    analyze_syntax,
    streamed: {
      cedict: getCEDict(),
      transcript: getTranscript(),
      summary: getSummary(),
    },
  }
}) satisfies PageLoad



