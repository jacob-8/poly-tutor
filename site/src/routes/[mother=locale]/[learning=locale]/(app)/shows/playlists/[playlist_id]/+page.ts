import type { YoutubePlaylistAddRequestBody, YoutubePlaylistAddResponseBody } from '$api/youtube/playlist/add/+server'
import type { LanguageCode } from '$lib/i18n/locales'
import { post_request } from '$lib/utils/post-request'
import type { PageLoad } from './$types'

export const load = (async ({ params: { playlist_id, learning }, fetch, parent }) => {
  const { supabase } = await parent()
  const language = learning.replace(/-.*/, '') as LanguageCode

  async function load_playlist() {
    const { data: playlists, error } = await supabase
      .from('youtube_playlists')
      .select()
      .eq('id', playlist_id)
    if (error)
      return { error: error.message }

    if (playlists[0]) return { data: playlists[0] }

    const { data, error: adding_error } = await post_request<YoutubePlaylistAddRequestBody, YoutubePlaylistAddResponseBody>(`/api/youtube/playlist/add`, { playlist_id, language }, fetch)
    if (adding_error)
      return { error: adding_error.message }
    return { data }
  }

  async function check_is_in_my_playlists() {
    const { data: is_added_data, error: checking_error } = await supabase
      .from('user_youtube_playlists')
      .select('youtube_playlist_id')
      .eq('youtube_playlist_id', playlist_id)
    if (checking_error)
      throw new Error(checking_error.message)

    if (is_added_data.length) {
      const { error: update_last_visit_error } = await supabase.from('user_youtube_playlists')
        .update({ last_visit: new Date().toISOString() })
        .eq('youtube_playlist_id', playlist_id)
        .select()
      if (update_last_visit_error)
        console.error({update_last_visit_error})
      return
    }

    const { data, error } = await supabase.from('user_youtube_playlists')
      .insert({ youtube_playlist_id: playlist_id })
      .select()
      .single()
    if (error)
      throw new Error(error.message)
    console.info({added_to_my_playlists: data})
  }

  return {
    playlist_promise: load_playlist(),
    check_is_in_my_playlists,
  }
}) satisfies PageLoad
