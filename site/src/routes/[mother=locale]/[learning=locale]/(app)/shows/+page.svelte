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

<div data-testid="my-videos" class="sm:px-3 pb-3 mb-3 border-b">
  <h2 class="my-3 font-semibold text-xl">
    <span class="i-logos-youtube-icon text-125% -mb-1.25 view-transition-yt-icon" />
    My Videos</h2>
  <div class="grid sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
    <div class="sm:max-w-470px">
      <div class="bg-gray-200 rounded h-0 pb-56.25% relative">
        <div class="absolute inset-0 p-3 flex flex-col text-center justify-center h-full">
          <div class="mb-2 text-xl">{$page.data.t.shows.paste_youtube_url}</div>
          <input placeholder="https://www.youtube.com/watch?v=..." bind:value={url} class="w-full sm:w-450px max-w-full p-2 border border-2 rounded" />
        </div>
      </div>
      <div class="text-sm my-1">{$page.data.t.home.youtube_description}</div>
    </div>
    {#each data.youtubes as youtube}
      <ShowThumbnail {youtube} channel={youtube.channel} />
    {/each}
  </div>
</div>

<div data-testid="other-videos" class="sm:px-3">
  <h2 class=" my-3 font-semibold text-xl">Others are watching...</h2>
  <div class="grid sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
    {#each data.other_youtubes as youtube}
      <ShowThumbnail {youtube} channel={youtube.channel} />
    {/each}
  </div>
</div>
