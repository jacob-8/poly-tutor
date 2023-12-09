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

<div class="grow-1 flex flex-col  text-xl">
  <div class="text-center">
    <span class="i-logos-youtube-icon text-800% -mt-1 opacity-20" />
    <div class="mb-2">
      {$page.data.t.shows.paste_youtube_url}</div>
    <input bind:value={url} class="min-w-full sm:min-w-450px p-2 border border-2 rounded" />
  </div>

  <div class="mt-10 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
    {#each data.youtubes as youtube}
      <ShowThumbnail {youtube} />
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

