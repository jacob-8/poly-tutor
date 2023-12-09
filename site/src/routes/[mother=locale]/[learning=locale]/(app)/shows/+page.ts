import type { YouTube } from '$lib/supabase/database.types'
import type { PageLoad } from './$types'

export const load = (() => {
  const youtubes: YouTube[] = []
  return {
    youtubes
  }
}) satisfies PageLoad
