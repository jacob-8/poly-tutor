import type { YoutubePlaylistAddRequestBody, YoutubePlaylistAddResponseBody } from '$api/youtube/playlist/add/+server'
import { post_request } from '$lib/utils/post-request'
import type { PageLoad } from './$types'

export const load = (({ params: {playlist_id}, fetch}) => {
  // const { supabase } = await parent()

  async function load_playlist() {
    // const { data: playlists, error } = await supabase
    //   .from('playlists')
    //   .select()
    //   .eq('id', playlist_id)
    // if (error)
    //   throw new Error(error.message)

    // if (playlists[0]) return { data: playlists[0] }

    return await post_request<YoutubePlaylistAddRequestBody, YoutubePlaylistAddResponseBody>(`/api/youtube/playlist/add`, { playlist_id }, fetch)
  }

  return {
    playlist_promise: load_playlist(),
    playlist_id,
  }
}) satisfies PageLoad
