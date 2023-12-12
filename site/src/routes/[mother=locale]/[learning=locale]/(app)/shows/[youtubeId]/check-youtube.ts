import { apiFetch } from '$lib/utils/apiFetch'
import type { Supabase, YouTube } from '$lib/supabase/database.types'
import type { YtAddRequestBody } from '$lib/types'

export async function youtube_in_db(youtube_id: string, supabase: Supabase): Promise<YouTube> {
  const { data: [youtube], error } = await supabase
    .from('youtubes')
    .select()
    .eq('id', youtube_id)
  if (error)
    throw new Error(error.message)
  return youtube
}

export async function add_youtube_to_db(youtube_id: string, fetch): Promise<YouTube> {
  const response = await apiFetch<YtAddRequestBody>('/api/yt_add', { youtube_id }, fetch)
  const body = await response.json()
  if (!response.ok)
    console.error(body.message)
  return body as YouTube
}

export async function check_is_in_my_videos(youtube_id: string, supabase: Supabase) {
  const alreadyAdded = await youtube_is_already_mine(youtube_id, supabase)
  if (alreadyAdded) return
  const { data, error } = await supabase.from('user_youtubes').insert({ youtube_id })
  if (error)
    throw new Error(error.message)
  console.info({added_to_my_youtubes: data})
}

async function youtube_is_already_mine(youtube_id: string, supabase: Supabase): Promise<number> {
  const { data, error } = await supabase
    .from('user_youtubes')
    .select('youtube_id')
    .eq('youtube_id', youtube_id)
  if (error)
    throw new Error(error.message)
  console.info({youtube_is_already_mine: data})
  return data.length
}

export async function remove_from_my_videos(youtube_id: string, supabase: Supabase) {
  const { error } = await supabase.from('user_youtubes').delete().eq('youtube_id', youtube_id)
  if (error)
    throw new Error(error.message)
  console.info({removed: youtube_id})
}
