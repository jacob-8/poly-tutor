<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import ShowThumbnail from './ShowThumbnail.svelte'
  import { get_youtube_video_id } from './get_youtube_video_id.js'

  export let data

  let url = ''
  $: youtube_id = get_youtube_video_id(url)
  $: if (youtube_id)
    goto(`shows/${youtube_id}`)
</script>

<div class="grow-1 flex flex-col sm:px-3">
  <div class="text-center px-3 sm:px-0">
    <span class="i-logos-youtube-icon text-1000% -mt-1 opacity-20 view-transition-yt-icon" />
    <div class="mb-2 text-xl">{$page.data.t.shows.paste_youtube_url}</div>
    <input placeholder="https://www.youtube.com/watch?v=..." bind:value={url} class="min-w-full sm:min-w-450px p-2 border border-2 rounded" />
    <div class="text-sm my-1">{$page.data.t.home.youtube_description}</div>
  </div>

  <div class="mt-10 grid sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
    {#each data.youtubes as youtube}
      <ShowThumbnail {youtube} channel={youtube.channel} />
    {/each}
    <!-- <button class="text-xs" type="button" on:click={() => url = 'https://www.youtube.com/watch?v=9OkddyYQBec'}>AI數學文化營</button>
    <a href="https://jia-you.vercel.app/shows/9OkddyYQBec" target="_blank" class="text-xs">old version</a>
    <br />
    <button class="text-xs" type="button" on:click={() => url = 'https://www.youtube.com/watch?v=Ukr40eBfeyg'}>農夫</button>
    <a href="https://jia-you.vercel.app/shows/Ukr40eBfeyg" target="_blank" class="text-xs">old version</a>
    <br />
    <button class="text-xs" type="button" on:click={() => url = 'https://www.youtube.com/watch?v=HRenI3LURNk'}>南橫公路全線通車</button>
    <a href="https://jia-you.vercel.app/shows/HRenI3LURNk" target="_blank" class="text-xs">old version</a>
    <br />
    <button class="text-xs" type="button" on:click={() => url = 'https://www.youtube.com/watch?v=lpyKfNjTZi8'}>Llama2 - hi friends</button> -->
  </div>
</div>

