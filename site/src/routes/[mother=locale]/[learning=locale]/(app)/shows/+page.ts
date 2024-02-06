import type { YouTubeWithAllData } from '$lib/mocks/seed/youtubes'
import type { PageLoad } from './$types'

export const load = (async ({parent, params: { learning }}) => {
  const { supabase } = await parent()
  const language = learning.replace(/-.*/, '')

  // TODO: should be a view
  const { data: user_youtubes_data, error } = await supabase
    .from('user_youtubes')
    .select(`
      added_at,
      youtube:youtubes!inner(
        id,
        language,
        title,
        description,
        duration_seconds,
        chapters,
        channel:youtube_channels(
          id,
          title,
          description,
          thumbnail_url
        )
      )
    `)
    .eq('youtubes.language', language)
    .order('added_at', { ascending: false })
  if (error)
    console.error(error)

  const user_youtubes: YouTubeWithAllData[] = user_youtubes_data.map(({youtube}) => ({
    youtube: {
      ...youtube,
      channel_id: youtube.channel.id,
    },
    channel: youtube.channel,
  }))

  const user_youtube_ids = user_youtubes.map(({youtube}) => youtube.id)

  const { data: other_youtubes_data, error: error2 } = await supabase
    .from('youtubes')
    .select(`
      id,
      language,
      title,
      description,
      duration_seconds,
      chapters,
      created_at,
      channel:youtube_channels(
        id,
        title,
        description,
        thumbnail_url
      )
    `)
    .eq('language', language)
    .not('id', 'in', `(${user_youtube_ids.join(',')})`)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error2)
    console.error(error2)

  const other_youtubes: YouTubeWithAllData[] = other_youtubes_data.map(youtube => ({
    youtube: {
      ...youtube,
      channel_id: youtube.channel.id,
    },
    channel: youtube.channel,
  }))

  return {
    user_youtubes,
    other_youtubes,
  }
}) satisfies PageLoad
