import type { PageLoad } from './$types'
import type { Sentence } from '$lib/types'
import { check_is_in_my_videos, remove_from_my_videos, youtube_in_db } from './check-youtube'
import type { Summary, YouTube } from '$lib/supabase/database.types'
import { post_request } from '$lib/utils/post-request'
import { get_openai_api_key } from '$lib/client/UserInfo.svelte'
import type { LanguageCode } from '$lib/i18n/locales'
import type { YoutubeAddRequestBody, YoutubeAddResponseBody } from '$api/youtube/[youtube_id]/add/+server'
import type { YoutubeTranscribeRequestBody, YoutubeTranscribeResponseBody } from '$api/youtube/[youtube_id]/transcribe/+server'
import type { YoutubeSummarizeRequestBody, YoutubeSummarizeResponseBody } from '$api/youtube/[youtube_id]/summarize/+server'

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
    const { data: sentences, error } = await post_request<YoutubeTranscribeRequestBody, YoutubeTranscribeResponseBody>(`/api/youtube/${youtube_id}/transcribe`, { openai_api_key, language_code: language, duration_seconds: whisper_chunk_minutes * 60 }, fetch)
    if (error) {
      console.error(error.message)
      throw new Error(error.message)
    }
    return sentences
  }

  async function summarize_chapter(chapter_index: number): Promise<Sentence[]> {
    const openai_api_key = get_openai_api_key()
    if (!openai_api_key) return
    const { data: sentences, error } = await post_request<YoutubeSummarizeRequestBody, YoutubeSummarizeResponseBody>(`/api/youtube/${youtube_id}/summarize`, { openai_api_key, chapter_index }, fetch)
    if (error) {
      console.error(error.message)
      throw new Error(error.message)
    }
    return sentences
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
  }
}) satisfies PageLoad
