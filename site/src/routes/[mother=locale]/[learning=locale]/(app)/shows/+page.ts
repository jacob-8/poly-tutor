import type { Channel, YouTube } from '$lib/supabase/database.types'
import type { PageLoad } from './$types'

export const load = (async ({parent}) => {
  const { supabase } = await parent()
  const { data, error } = await supabase
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
          thumbnail_id
        )
      )
    `)
    // .eq('youtubes.language', 'en')
    .order('added_at', { ascending: false })
  if (error)
    console.error(error)

  const youtubes: Partial<YouTube & { channel: Partial<Channel>}>[] = data.map(y => {
    return {
      ...y.youtubes,
      channel: y.youtubes.youtube_channels,
      created_at: y.added_at
    }
  })
  return {
    youtubes
  }
}) satisfies PageLoad
