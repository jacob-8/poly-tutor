import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ResponseCodes } from '$lib/responseCodes'
import type { YtAddRequestBody } from '$lib/types'
import type { Supabase } from '$lib/supabase/database.types'
import { getAdminSupabaseClient } from '$lib/supabase/admin'
import { YOUTUBE_API_3_KEY } from '$env/static/private'
import { youtube_pt_format_duration_to_seconds } from './duration-to-seconds'

export const POST: RequestHandler = async ({ locals: { getSession }, request }) => {
  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user)
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  const { youtube_id, language_code } = await request.json() as YtAddRequestBody

  if (!youtube_id)
    error(ResponseCodes.BAD_REQUEST, 'No youtube_id found in request body')

  try {
    const { channel_id, title, description, locale, published_at, duration_seconds } = await get_youtube_info_from_youtube(youtube_id)

    const adminSupabase = getAdminSupabaseClient()

    const channel_exists = await channel_is_in_db(channel_id, adminSupabase)
    if (!channel_exists)
      await add_channel(channel_id, adminSupabase)

    const language = locale
      ? (locale.includes('zh') ? 'zh' : 'en')
      : language_code

    const { data, error: _error2 } = await adminSupabase.from('youtubes').insert({
      id: youtube_id,
      title,
      description,
      channel_id,
      language,
      published_at,
      duration_seconds
    })
      .select()
      .single()
    if (_error2)
      throw new Error(_error2.message)
    return json(data)
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
    view_count: viewCount ? parseInt(viewCount, 10) : null,
    like_count: likeCount ? parseInt(likeCount, 10) : null,
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

