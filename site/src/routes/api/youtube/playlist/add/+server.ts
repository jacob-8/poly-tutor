import type { RequestHandler } from './$types'
import { error, json } from '@sveltejs/kit'
import { ResponseCodes } from '$lib/response-codes'
import { YOUTUBE_API_3_KEY } from '$env/static/private'
import { get_request } from '$lib/utils/post-request'

export interface YoutubePlaylistAddRequestBody {
  playlist_id: string
}

export type YoutubePlaylistAddResponseBody = PlaylistItemListResponse

export const POST: RequestHandler = async ({ locals: { getSession }, request }) => {
  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user)
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  const { playlist_id } = await request.json() as YoutubePlaylistAddRequestBody

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlist_id}&maxResults=50&&key=${YOUTUBE_API_3_KEY}`

  const { data, error: playlist_fetch_error } = await get_request<PlaylistItemListResponse>(url)
  if (playlist_fetch_error)
    error(ResponseCodes.INTERNAL_SERVER_ERROR, playlist_fetch_error.message)

  return json(data satisfies PlaylistItemListResponse)
}

interface PlaylistItemListResponse {
  kind: string;
  etag: string;
  items: Item[];
  pageInfo: PageInfo;
}

interface Item {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
  contentDetails: ContentDetails;
}

interface Snippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  playlistId: string;
  position: number;
  resourceId: {
    kind: string;
    videoId: string;
  };
  videoOwnerChannelTitle: string;
  videoOwnerChannelId: string;
}

interface Thumbnails {
  default: Thumbnail;
  medium: Thumbnail;
  high: Thumbnail;
  standard?: Thumbnail;
  maxres?: Thumbnail;
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

interface ContentDetails {
  videoId: string;
  videoPublishedAt: string;
}

interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}
