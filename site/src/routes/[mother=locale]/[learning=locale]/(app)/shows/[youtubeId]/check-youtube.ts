import type { Supabase, YouTube } from '$lib/supabase/database.types'

export async function youtube_in_db(youtube_id: string, supabase: Supabase): Promise<YouTube> {
  const { data: [youtube], error } = await supabase
    .from('youtubes')
    .select()
    .eq('id', youtube_id)
  if (error)
    throw new Error(error.message)
  return youtube
}

export async function check_is_in_my_videos(youtube_id: string, supabase: Supabase) {
  const alreadyAdded = await youtube_is_already_mine(youtube_id, supabase)
  console.info({alreadyAdded})
  if (alreadyAdded) return
  const { data, error } = await supabase.from('user_youtubes')
    .insert({ youtube_id })
    .select()
    .single()
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
