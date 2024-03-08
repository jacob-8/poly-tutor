import type { LanguageCode } from '$lib/i18n/locales'
import type { YouTubeWithAllData } from '$lib/mocks/seed/youtubes'
import type { PageLoad } from './$types'

export const load = (async ({parent, params: { learning }}) => {
  const { supabase } = await parent()
  const language = learning.replace(/-.*/, '') as LanguageCode

  const { data: user_playlists, error: user_playlists_error } = await supabase.from('user_youtube_playlists')
    .select(`
      last_visit,
      playlist:youtube_playlists!inner(
        id,
        title,
        description,
        language,
        youtubes
      )
    `)
    .eq('youtube_playlists.language', language)
    .order('last_visit', { ascending: false })
    .limit(10)
  if (user_playlists_error)
    console.info({user_playlists_error})

  // TODO: make this a view
  const { data: user_youtubes_data, error: user_youtubes_error } = await supabase
    .from('user_youtubes')
    .select(`
      last_visit,
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
    .order('last_visit', { ascending: false })
    .limit(20)
  if (user_youtubes_error)
    console.error({user_youtubes_error})

  const user_youtubes: YouTubeWithAllData[] = user_youtubes_data.map(({youtube}) => ({
    youtube: {
      ...youtube,
      channel_id: youtube.channel.id,
    },
    channel: youtube.channel,
  }))

  const { data: user_channels, error: user_channels_error } = await supabase
    .from('my_youtube_channels')
    .select()
    .eq('language', language)
    .limit(10)
    .order('last_visit', { ascending: false })
  if (user_channels_error)
    console.info({user_channels_error})

  const { data: public_playlists, error: public_playlists_error } = await supabase.from('youtube_playlists')
    .select(`
        id,
        title,
        description,
        language,
        youtubes,
        public,
        updated_at
    `)
    .eq('language', language)
    .not('public', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(10)
  if (public_playlists_error)
    console.info({public_playlists_error})

  return {
    user_playlists,
    user_youtubes,
    user_channels,
    public_playlists,
  }
}) satisfies PageLoad
