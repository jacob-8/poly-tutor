<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { get_youtube_video_id } from './get_youtube_video_id.js'

  let url = ''
  $: youtube_id = get_youtube_video_id(url)
  $: if (youtube_id)
    goto(`shows/${youtube_id}`)
</script>

<div class="grow-1 flex flex-col items-center justify-center">
  <div class="mb-2"><span class="i-logos-youtube-icon text-2xl -mt-1" /> {$page.data.t.shows.paste_youtube_url}</div>
  <input bind:value={url} class="min-w-full sm:min-w-450px p-2 border border-2 rounded" />
  <button class="text-xs" type="button" on:click={() => url = 'https://www.youtube.com/watch?v=lpyKfNjTZi8'}>https://www.youtube.com/watch?v=lpyKfNjTZi8</button>
</div>

