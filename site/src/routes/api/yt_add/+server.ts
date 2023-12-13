import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ResponseCodes } from '$lib/responseCodes'
import type { YtAddRequestBody } from '$lib/types'
import type { Supabase } from '$lib/supabase/database.types'
import { getAdminSupabaseClient } from '$lib/supabase/admin'
import { YOUTUBE_API_3_KEY } from '$env/static/private'

export const POST: RequestHandler = async ({ locals: { getSession }, request }) => {
  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user)
    throw error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  const { youtube_id } = await request.json() as YtAddRequestBody

  if (!youtube_id)
    throw error(ResponseCodes.BAD_REQUEST, 'No youtube_id found in request body')

  try {
    const { channel_id, title, description, language } = await get_youtube_info_from_youtube(youtube_id)

    const adminSupabase = getAdminSupabaseClient()

    const channel_exists = await channel_is_in_db(channel_id, adminSupabase)
    if (!channel_exists)
      await add_channel(channel_id, adminSupabase)

    const { data, error: _error2 } = await adminSupabase.from('youtubes').insert({
      id: youtube_id,
      title,
      description,
      channel_id,
      language,
    })
      .select()
      .single()
    if (_error2)
      throw new Error(_error2.message)
    return json(data)
  } catch (err) {
    console.error(err.message)
    throw error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
  }
}

async function get_youtube_info_from_youtube(youtube_id: string) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${youtube_id}&key=${YOUTUBE_API_3_KEY}`

  const response = await fetch(url)
  const data = await response.json() as YouTubeVideoSnippetData
  const { items: [{ snippet: { channelId, title, description, publishedAt, defaultLanguage, defaultAudioLanguage } }] } = data

  const language = (defaultLanguage || defaultAudioLanguage)?.includes('zh') ? 'zh' : 'en'

  const result: {
    title: string,
    description: string,
    channel_id: string,
    published_at: string, // TODO: use this
    language: 'en' | 'zh',
  } = {
    title,
    description,
    channel_id: channelId,
    published_at: publishedAt,
    language,
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
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channel_id}&key=${YOUTUBE_API_3_KEY}`

  const response = await fetch(url)
  const { items: [{ snippet: { title, description, thumbnails } }] } = await response.json() as YouTubeChannelSnippetData
  const AFTER_SLASH_BEFORE_EQUAL = /\/([^/]*)=/
  const match = thumbnails.default.url.match(AFTER_SLASH_BEFORE_EQUAL)
  const thumbnail_id = match ? match[1] : ''

  const { error } = await supabase.from('youtube_channels').insert({
    id: channel_id,
    title,
    description,
    thumbnail_id,
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
  }[];
}
