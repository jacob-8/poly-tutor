import type { PageLoad } from './$types'
import type { Sentence, Translation } from '$lib/types'
import { check_is_in_my_videos, remove_from_my_videos, youtube_in_db } from './check-youtube'
import type { Summary, YouTube } from '$lib/supabase/database.types'
import { post_request } from '$lib/utils/post-request'
import { get_openai_api_key } from '$lib/client/UserInfo.svelte'
import type { LanguageCode, LocaleCode } from '$lib/i18n/locales'
import type { YoutubeAddRequestBody, YoutubeAddResponseBody } from '$api/youtube/[youtube_id]/add/+server'
import type { YoutubeTranscribeRequestBody, YoutubeTranscribeResponseBody } from '$api/youtube/[youtube_id]/transcribe/+server'
import type { YoutubeSummarizeRequestBody, YoutubeSummarizeResponseBody } from '$api/youtube/[youtube_id]/summarize/+server'
import { create_chat_store } from '$lib/components/chat/create-chat-store'
import { create_openai_streaming_store } from '$lib/components/chat/create-streaming-store'
import type { TranslateRequestBody, TranslateResponseBody } from '$api/translate/+server'
import { ResponseCodes } from '$lib/response-codes'

export const load = (async ({ params: { youtube_id, mother, learning }, fetch, parent }) => {
  const { supabase, split_sentences, analyze_sentences } = await parent()
  const language = learning.replace(/-.*/, '') as LanguageCode

  async function load_youtube(): Promise<{ data?: YouTube, error?: { status: number, message: string }}> {
    const youtube = await youtube_in_db(youtube_id, supabase)
    if (youtube) return { data: youtube }

    return await post_request<YoutubeAddRequestBody, YoutubeAddResponseBody>(`/api/youtube/${youtube_id}/add`, { mother, learning }, fetch)
  }

  async function load_transcript(): Promise<Sentence[]> {
    const { data, error } = await supabase
      .from('youtube_transcripts')
      .select()
      .eq('youtube_id', youtube_id)
    if (error) {
      console.error(error.message)
      alert(error.message)
      return
    }
    return data?.[0]?.sentences
  }

  async function load_summaries(): Promise<Summary[]> {
    const { data, error } = await supabase
      .from('youtube_summaries')
      .select()
      .eq('youtube_id', youtube_id)
    if (error) {
      console.error(error.message)
      alert(error.message)
      return
    }
    if (data)
      return data
  }

  async function transcribe(whisper_chunk_minutes = 5): Promise<Sentence[]> {
    const openai_api_key = get_openai_api_key()
    if (!openai_api_key) return
    const prompt = learning === 'zh-TW'
      ? '請使用繁體字。'
      : learning === 'zh-CN'
        ? '请使用简体字。'
        : 'Please use punctuation marks.'

    // const puncPrompt = 'Whisper, as you transcribe speech into text, please ensure to include punctuation marks as accurately as possible. Additionally, when creating the timeline for the subtitles, try to split at the punctuation marks to ensure that sentences are not divided across different time segments. The goal is to have each sentence contained within a single time segment for clarity and coherence. 請使用繁體字。'
    //   const punc_prompt_ch = `請盡量準確地加上標點符號。

    // 在製作字幕的時間軸時，在標點符號處分割，以避免句子被分散在不同時間段。

    // 目標是讓每個句子都在一個時間段內，以保持清晰。`

    const { data: sentences, error } = await post_request<YoutubeTranscribeRequestBody, YoutubeTranscribeResponseBody>(`/api/youtube/${youtube_id}/transcribe`, { openai_api_key, prompt, mother, learning, language_code: language, duration_seconds: whisper_chunk_minutes * 60 }, fetch)
    if (error) {
      console.error(error.message)
      throw new Error(error.message)
    }
    return sentences
  }

  async function summarize_chapter({start_ms, end_ms, sentences, title}: { start_ms: number, end_ms: number, sentences: Sentence[], title: string}): Promise<Translation> {
    const openai_api_key = get_openai_api_key()
    if (!openai_api_key) return
    const transcript = sentences.map(({ text }) => text).join('\n')
    const { data: translations, error } = await post_request<YoutubeSummarizeRequestBody, YoutubeSummarizeResponseBody>(`/api/youtube/${youtube_id}/summarize`, { openai_api_key, mother, learning, start_ms, end_ms, transcript, title }, fetch)
    if (error) {
      console.error(error.message)
      throw new Error(error.message)
    }
    return translations
  }

  async function translate(text: string, from: LocaleCode, to: LocaleCode): Promise<string> {
    const { data, error: translate_error } = await post_request<TranslateRequestBody, TranslateResponseBody>('/api/translate', { text, sourceLanguageCode: from, targetLanguageCode: to }, fetch)
    if (translate_error)
      throw Error(translate_error.message)
    return data.line_separated_translations
  }

  const chat = create_chat_store({
    split_sentences,
    mother,
    learning,
    create_streaming_store: create_openai_streaming_store,
    translate,
  })

  async function transcribe_audio(audio: File): Promise<string> {
    const openai_api_key = get_openai_api_key()
    if (!openai_api_key) return

    const prompt = learning === 'zh-TW' ? '請使用繁體字' : ''
    const formData = new FormData()
    formData.append('file', audio)
    formData.append('model', 'whisper-1')
    formData.append('language', language)
    formData.append('prompt', prompt)

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openai_api_key}`,
        },
        body: formData,
      }
    )

    if (response.status !== ResponseCodes.OK) {
      const error = await response.json()
      console.error(error)
      throw new Error(error)
    }

    const { text } = await response.json() as { text: string }
    return text
  }

  return {
    youtube_id,
    language,
    youtube_promise: load_youtube(),
    load_transcript,
    load_summaries,
    transcribe,
    summarize_chapter,
    analyze_sentences, // for transcript
    split_sentences, // for metadata
    check_is_in_my_videos,
    remove_from_my_videos,
    chat,
    transcribe_audio,
  }
}) satisfies PageLoad
