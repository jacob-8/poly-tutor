<script lang="ts">
  import type { Channel, YouTube } from '$lib/supabase/database.types'
  import { format_time } from '$lib/utils/format_time'

  export let youtube: Partial<YouTube>
  export let channel: Partial<Channel>
  $: href= `shows/${youtube.id}`

  // https://img.youtube.com/vi/b5JaHbjKb2I/0.jpg // 1,2,3 - thumbnail variations
  // https://img.youtube.com/vi/b5JaHbjKb2I/hqdefault.jpg // 480x360
  // https://img.youtube.com/vi/b5JaHbjKb2I/sddefault.jpg // 640x480
  // https://img.youtube.com/vi/b5JaHbjKb2I/maxresdefault.jpg // 1280x720
  // https://i.ytimg.com/vi... // shortened alt url

  const channel_thumbnail_url = `${channel.thumbnail_url}=s64-c-k-c0x00ffffff-no-rj`
// sometimes images exist only under https://yt3.googleusercontent.com or https://yt3.googleusercontent.com
</script>

<div class="sm:max-w-470px">
  <a class="block mb-1 relative overflow-hidden h-0 pb-56.25% sm:rounded" style="view-transition-name: yt-thumbnail-{youtube.id}" {href}>
    <img class="w-full absolute centered" src="https://i.ytimg.com/vi/{youtube.id}/sddefault.jpg" alt={youtube.title} title={youtube.description} />
    {#if youtube.duration_seconds}
      <span class="bg-black rounded text-white text-xs px-1 py.5 absolute right-1 bottom-1">{format_time(youtube.duration_seconds)}</span>
    {/if}
  </a>

  <div class="flex">
    <a href="https://www.youtube.com/channel/{channel.id}" target="_blank" class="w-8 h-8 mr-2 mt-3px shrink-0">
      <img src={channel_thumbnail_url} alt={channel.title} class="rounded-full" />
    </a>
    <div class="block">
      <a class="line-clamp-2 font-semibold text-sm" {href} title={youtube.title}>
        {youtube.title}
      </a>
    </div>
  </div>
</div>

<!-- <pre>{JSON.stringify(youtube, null, 2)}</pre> -->

<style>
  .centered {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
