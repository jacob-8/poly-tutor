import type { RequestHandler } from './$types'
import { error, json } from '@sveltejs/kit'
import { ResponseCodes } from '$lib/response-codes'
import { YOUTUBE_API_3_KEY } from '$env/static/private'
import { get_request } from '$lib/utils/post-request'
import type { LanguageCode } from '$lib/i18n/locales'
import type { Playlist } from '$lib/supabase/database.types'
import { split_into_sentences } from '$lib/utils/split-into-sentences'
import type { PlaylistYoutubeMetadata } from '$lib/types'
import { getAdminSupabaseClient } from '$lib/supabase/admin'

export interface YoutubePlaylistAddRequestBody {
  playlist_id: string
  language: LanguageCode
}

export type YoutubePlaylistAddResponseBody = Playlist

export const POST: RequestHandler = async ({ locals: { getSession }, request }) => {
  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user)
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  const { playlist_id, language } = await request.json() as YoutubePlaylistAddRequestBody

  try {
    const playlist_url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlist_id}&key=${YOUTUBE_API_3_KEY}`

    const { data: yt_playlist_data, error: playlist_fetch_error } = await get_request<PlaylistResponse>(playlist_url)
    if (playlist_fetch_error)
      throw new Error(playlist_fetch_error.message)

    const title = split_into_sentences(yt_playlist_data.items[0].snippet.title).map(sentence => ({ text: sentence }))
    const description = split_into_sentences(yt_playlist_data.items[0].snippet.description).map(sentence => ({ text: sentence }))

    const youtubes = await get_all_videos_from_playlist(playlist_id)

    const admin_supabase = getAdminSupabaseClient()
    const { data: playlist, error: save_playlist_error } = await admin_supabase.from('youtube_playlists').insert({
      id: playlist_id,
      language,
      title,
      description,
      youtubes,
    }).select().single()
    if (save_playlist_error)
      throw new Error(save_playlist_error.message)

    return json(playlist satisfies Playlist)
  }
  catch (err) {
    console.error(err.message)
    error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
  }
}

async function get_all_videos_from_playlist(playlist_id: string, nextPageToken = ''): Promise<PlaylistYoutubeMetadata[]> {
  const videos: PlaylistYoutubeMetadata[] = []

  const playlistItems_url = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlist_id}&maxResults=50&key=${YOUTUBE_API_3_KEY}&pageToken=${nextPageToken}`
  const { data, error: playlist_items_fetch_error } = await get_request<PlaylistItemListResponse>(playlistItems_url)
  if (playlist_items_fetch_error)
    throw new Error(playlist_items_fetch_error.message)

  videos.push(...data.items.map(item => ({
    id: item.contentDetails.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    channel_id: item.snippet.channelId,
    channel_title: item.snippet.channelTitle,
    published_at: item.snippet.publishedAt,
  })))

  if (data.nextPageToken) {
    const more_videos = await get_all_videos_from_playlist(playlist_id, data.nextPageToken)
    videos.push(...more_videos)
  }

  return videos
}

interface PlaylistResponse {
  items: {
    id: string;
    snippet: {
      publishedAt: string // 2022-09-07T00:28:36Z,
      channelId: string,
      title: string,
      description: string,
      // thumbnails // usually just the first video so pointless to pay attention to
      channelTitle: string,
      localized: {
        title: string,
        description: string
      }
    }
  }[]
}

interface PlaylistItemListResponse {
  nextPageToken?: string; // if more than 50 items
  prevPageToken?: string; // if not on page 1
  items: {
    id: string;
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: Thumbnail;
        medium: Thumbnail;
        high: Thumbnail;
        standard?: Thumbnail;
        maxres?: Thumbnail;
      };
      channelTitle: string;
      playlistId: string;
      position: number;
      resourceId: {
        kind: string;
        videoId: string;
      };
      videoOwnerChannelTitle: string;
      videoOwnerChannelId: string;
    };
    contentDetails: {
      videoId: string;
      videoPublishedAt: string;
    };
    status: {
      privacyStatus: 'public' // doesn't distinguish between public and unlisted
    };
  }[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}
