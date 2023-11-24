<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { get_youtube_video_id } from './get_youtube_video_id.js'

  let url = ''
  $: youtube_id = get_youtube_video_id(url)
  $: if (youtube_id)
    goto(`shows/${youtube_id}`)
</script>

<div class="grow-1 flex flex-col items-center justify-center text-xl">
  <span class="i-logos-youtube-icon text-1000% -mt-1 opacity-20" />
  <div class="mb-2">

    {$page.data.t.shows.paste_youtube_url}</div>
  <input bind:value={url} class="min-w-full sm:min-w-450px p-2 border border-2 rounded" />
  <div class="flex flex-col mt-10 text-center">
    <button class="text-xs" type="button" on:click={() => url = 'https://www.youtube.com/watch?v=9OkddyYQBec'}>AI數學文化營</button>
    <a href="https://jia-you.vercel.app/shows/9OkddyYQBec" target="_blank" class="text-xs">old version</a>
    <br />
    <button class="text-xs" type="button" on:click={() => url = 'https://www.youtube.com/watch?v=Ukr40eBfeyg'}>農夫</button>
    <a href="https://jia-you.vercel.app/shows/Ukr40eBfeyg" target="_blank" class="text-xs">old version</a>
    <br />
    <button class="text-xs" type="button" on:click={() => url = 'https://www.youtube.com/watch?v=HRenI3LURNk'}>南橫公路全線通車</button>
    <a href="https://jia-you.vercel.app/shows/HRenI3LURNk" target="_blank" class="text-xs">old version</a>
    <br />
    <button class="text-xs" type="button" on:click={() => url = 'https://www.youtube.com/watch?v=lpyKfNjTZi8'}>Llama2</button>
  </div>
</div>

