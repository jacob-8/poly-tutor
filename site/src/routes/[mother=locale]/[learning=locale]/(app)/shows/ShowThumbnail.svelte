<script lang="ts">
  import type { YouTube } from '$lib/supabase/database.types'
  import { format_time } from '$lib/utils/format_time'

  export let youtube: YouTube
  $: href= `shows/${youtube.id}`
</script>

<div>
  <a class="block mb-1 relative" {href}>
    <img class="sm:rounded w-full" src={youtube.thumbnail_url} alt={youtube.title} title={youtube.title} />
    <span class="bg-black rounded text-white text-xs px-1 py.5 absolute right-1 bottom-1">{format_time(youtube.duration_seconds)}</span>
  </a>

  <div class="flex">
    <a href="https://www.youtube.com/@{youtube.channel_id}" target="_blank" class="w-8 h-8 mr-2 shrink-0">
      <img src={youtube.channel_thumbnail_url} alt={youtube.channel_title} class="rounded-full" />
    </a>
    <div class="block">
      <a class="line-clamp-2 font-semibold text-sm" {href} title={youtube.title}>
        {youtube.title}
      </a>
    </div>
  </div>
</div>
