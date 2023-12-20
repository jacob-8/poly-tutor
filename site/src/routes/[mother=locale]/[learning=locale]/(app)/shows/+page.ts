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
        title,
        description,
        language,
        duration_seconds,
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

  const user_youtubes = user_youtubes_data.map(y => ({
    ...y,
    channel: y.youtube.channel,
  }))

  const user_youtube_ids = user_youtubes.map(({youtube}) => youtube.id)

  const { data: other_youtubes_data, error: error2 } = await supabase
    .from('youtubes')
    .select(`
      id,
      title,
      description,
      language,
      duration_seconds,
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
    .limit(20)

  if (error2)
    console.error(error2)

  const other_youtubes = other_youtubes_data.map(y => ({
    youtube: y,
    channel: y.channel,
  }))

  return {
    user_youtubes,
    other_youtubes,
  }
}) satisfies PageLoad
