import type { Channel, YouTube } from '$lib/supabase/database.types'
import type { PageLoad } from './$types'

export const load = (async ({parent}) => {
  const { supabase } = await parent()
  const { data: user_youtubes, error } = await supabase
    .from('user_youtubes')
    .select(`
      added_at,
      youtubes (
        id,
        title,
        description,
        language,
        duration_seconds,
        youtube_channels (
          id,
          title,
          description,
          thumbnail_url
        )
      )
    `)
    .eq('youtubes.language', 'zh')
    .order('added_at', { ascending: false })
  if (error)
    console.error(error)

  const user_youtube_ids = user_youtubes.map(y => y.youtubes.id)

  const { data: other_youtubes_data, error: error2 } = await supabase
    .from('youtubes')
    .select(`
      id,
      title,
      description,
      language,
      duration_seconds,
      created_at,
      youtube_channels (
        id,
        title,
        description,
        thumbnail_url
      )
    `)
    .eq('language', 'zh')
    .not('id', 'in', `(${user_youtube_ids.join(',')})`)
    .order('created_at', { ascending: false })
    .limit(10)
  if (error2)
    console.error(error2)

  const youtubes: Partial<YouTube & { channel: Partial<Channel>}>[] = user_youtubes.map(y => {
    return {
      ...y.youtubes,
      channel: y.youtubes.youtube_channels,
      created_at: y.added_at
    }
  })

  const other_youtubes: Partial<YouTube & { channel: Partial<Channel>}>[] = other_youtubes_data.map(y => {
    return {
      ...y,
      channel: y.youtube_channels,
    }
  })

  return {
    youtubes,
    other_youtubes,
  }
}) satisfies PageLoad
