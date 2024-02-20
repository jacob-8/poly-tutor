import { error, json, type Config } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ResponseCodes } from '$lib/response-codes'
import type { Supabase, YouTube } from '$lib/supabase/database.types'
import { getAdminSupabaseClient } from '$lib/supabase/admin'
import { YOUTUBE_API_3_KEY } from '$env/static/private'
import { youtube_pt_format_duration_to_seconds } from './duration-to-seconds'
import type { LanguageCode, LocaleCode } from '$lib/i18n/locales'
import type { Sentence } from '$lib/types'
import { split_into_sentences } from './split_string_into_sentences'
import { get_chapters } from './get-chapters'
import { save_youtube_captions_as_transcript_if_exists } from './captions/get-captions'
import { translate_sentences } from '$api/translate/translate-sentences'

export const config: Config = { maxDuration: 300 }

export interface YoutubeAddRequestBody {
  mother: LocaleCode
  learning: LocaleCode
}

export type YoutubeAddResponseBody = YouTube

export const POST: RequestHandler = async ({ locals: { getSession }, params: { youtube_id }, request, fetch }) => {
  const { data: session_data, error: _error, supabase } = await getSession()
  if (_error || !session_data?.user)
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  const { mother, learning } = await request.json() as YoutubeAddRequestBody

  try {
    const { channel_id, title: youtube_title, description: youtube_description, locale: youtube_locale, published_at, duration_seconds, like_count, view_count } = await get_youtube_info_from_youtube(youtube_id)

    // The uploader of HGX4_sg3mfA miscategorized the video as English so the following check won't allow it to be added, but not sure I want to remove it as it prevents users miscategorizing videos in most use cases. Will need to keep an eye on this.

    if (youtube_locale) {
      const video_is_chinese = youtube_locale.includes('zh')
      if (video_is_chinese && learning === 'en')
        throw new Error('不能添加中文视频，因为你正在学习英文。请先切换语言。')
      if (!video_is_chinese && learning.includes('zh'))
        throw new Error('Cannot add an English video when studying Chinese. Please switch languages first.')
    }

    const language: LanguageCode = youtube_locale
      ? (youtube_locale.includes('zh') ? 'zh' : 'en')
      : learning.split('-')[0] as LanguageCode
    const admin_supabase = getAdminSupabaseClient()

    const channel_in_db = async () => {
      const channel_exists = await channel_is_in_db(channel_id, admin_supabase)
      if (!channel_exists)
        await add_channel(channel_id, admin_supabase)
    }

    const split_and_translate = async ({ text, mother, learning}: {text: string, mother: LocaleCode, learning: LocaleCode}) => {
      const sentences: Sentence[] = split_into_sentences(text).map(sentence => ({ text: sentence }))
      return await translate_sentences({ sentences, mother, learning, _fetch: fetch })
    }

    const [title, chapters] = await Promise.all([
      split_and_translate({ text: youtube_title, mother, learning}),
      get_chapters({youtube_id, duration_seconds}),
      channel_in_db(),
    ])

    const description = split_into_sentences(youtube_description).map(sentence => ({ text: sentence }))

    const { data: youtube, error: save_youtube_error } = await admin_supabase.from('youtubes').insert({
      id: youtube_id,
      channel_id,
      language,
      like_count,
      view_count,
      published_at,
      title: title || [],
      description: description || [],
      duration_seconds,
      chapters,
    }).select()
      .single()
    if (save_youtube_error)
      throw new Error(save_youtube_error.message)

    await save_youtube_captions_as_transcript_if_exists({youtube_id, mother, learning, supabase, _fetch: fetch})

    return json(youtube satisfies YoutubeAddResponseBody)
  } catch (err) {
    console.error(err.message)
    error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
  }
}

async function get_youtube_info_from_youtube(youtube_id: string) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${youtube_id}&key=${YOUTUBE_API_3_KEY}`

  const response = await fetch(url)
  const data = await response.json() as YouTubeVideoSnippetData
  const { items: [{ snippet: { channelId: channel_id, title, description, publishedAt: published_at, defaultLanguage, defaultAudioLanguage }, contentDetails: { duration }, statistics: { viewCount, likeCount } }] } = data

  const locale = defaultLanguage || defaultAudioLanguage

  const result: {
    title: string,
    description: string,
    channel_id: string,
    published_at: string,
    locale: string,
    duration_seconds: number,
    view_count: number,
    like_count: number,
  } = {
    title,
    description,
    channel_id,
    published_at,
    locale,
    duration_seconds: youtube_pt_format_duration_to_seconds(duration),
    view_count: viewCount ? parseInt(viewCount) : null,
    like_count: likeCount ? parseInt(likeCount) : null,
  }
  return result
}

async function channel_is_in_db(channel_id: string, supabase: Supabase) {
  const { data: [channel], error } = await supabase
    .from('youtube_channels')
    .select('id')
    .eq('id', channel_id)
  if (error)
    throw new Error(error.message)
  return !!channel
}

async function add_channel(channel_id: string, supabase: Supabase) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channel_id}&key=${YOUTUBE_API_3_KEY}`

  const response = await fetch(url)
  const { items: [{ snippet: { title, description, thumbnails }, statistics: { subscriberCount, videoCount, viewCount } }] } = await response.json() as YouTubeChannelSnippetData
  const BEFORE_EQUAL = /(?<thumbnail_url>[^=]*)=/
  const match = thumbnails.default.url.match(BEFORE_EQUAL)
  const thumbnail_url = match?.groups?.thumbnail_url || ''

  const { error } = await supabase.from('youtube_channels').insert({
    id: channel_id,
    title,
    thumbnail_url,
    description,
    subscriber_count: subscriberCount ? parseInt(subscriberCount, 10) : null,
    video_count: videoCount ? parseInt(videoCount, 10) : null,
    view_count: viewCount ? parseInt(viewCount, 10) : null,
  })
  if (error)
    throw new Error(error.message)
}

interface YouTubeVideoSnippetData {
  kind: string;
  etag: string;
  items: {
    kind: string;
    etag: string;
    id: string;
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: {
          url: string;
          width: number;
          height: number;
        };
        medium: {
          url: string;
          width: number;
          height: number;
        };
        high: {
          url: string;
          width: number;
          height: number;
        };
        standard: {
          url: string;
          width: number;
          height: number;
        };
        maxres: {
          url: string;
          width: number;
          height: number;
        };
      };
      channelTitle: string;
      tags: string[];
      categoryId: string;
      liveBroadcastContent: string;
      defaultLanguage?: string;
      localized: {
        title: string;
        description: string;
      };
      defaultAudioLanguage: string;
    };
    contentDetails: {
      duration: string;
      dimension: '2d' | '3d';
      definition: 'sd' | 'hd';
      caption: boolean
      licensedContent: boolean;
      contentRating: Record<string, unknown>;
      projection: 'rectangular' | '360';
    };
    statistics: { // quoted numbers
      viewCount: string;
      likeCount: string;
      favoriteCount: string;
      commentCount: string;
    };
  }[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

interface YouTubeChannelSnippetData {
  kind: string;
  etag: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: {
    kind: string;
    etag: string;
    id: string;
    snippet: {
      title: string;
      description: string;
      customUrl: string;
      publishedAt: string;
      thumbnails: {
        default: {
          url: string;
          width: number;
          height: number;
        };
        medium: {
          url: string;
          width: number;
          height: number;
        };
        high: {
          url: string;
          width: number;
          height: number;
        };
      };
      localized: {
        title: string;
        description: string;
      };
      country: string;
    };
    statistics: {
      viewCount: string // quoted number
      subscriberCount: string // quoted number
      hiddenSubscriberCount: boolean
      videoCount: string // quoted number
    }
  }[];
}
