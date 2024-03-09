import type { Supabase, YouTube } from '$lib/supabase/database.types'

export async function youtube_in_db(youtube_id: string, supabase: Supabase): Promise<YouTube> {
  const { data, error } = await supabase
    .from('youtubes')
    .select()
    .eq('id', youtube_id)
  if (error)
    throw new Error(error.message)
  return data[0]
}

export async function check_is_in_my_videos(youtube_id: string, supabase: Supabase) {
  if (!youtube_id) return
  const alreadyAdded = await youtube_is_already_mine(youtube_id, supabase)
  if (alreadyAdded) {
    const { error: update_last_visit_error } = await supabase.from('user_youtubes')
      .update({ last_visit: new Date().toISOString() })
      .eq('youtube_id', youtube_id)
      .select()
    if (update_last_visit_error)
      console.error({update_last_visit_error})
    return
  }

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
  return data.length
}

export async function remove_from_my_videos(youtube_id: string, supabase: Supabase) {
  const { error } = await supabase.from('user_youtubes').delete().eq('youtube_id', youtube_id)
  if (error)
    throw new Error(error.message)
}
