<script lang="ts">
  import { browser, dev } from '$app/environment'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import ShowThumbnail from './ShowThumbnail.svelte'
  import { get_youtube_video_id } from './get-youtube-video-id'
  import { get_youtube_playlist_id } from './get-youtube-playlist-id'

  export let data

  let navigating = false

  function handle_url(event) {
    const youtube_id = get_youtube_video_id(event.target.value)
    if (youtube_id) {
      goto(`shows/${youtube_id}`)
      return navigating = true
    }

    const playlist_id = get_youtube_playlist_id(event.target.value)
    if (playlist_id) {
      goto(`shows/playlists/${playlist_id}`)
      return navigating = true
    }
  }
</script>

<div data-testid="my-videos" class="sm:px-3 pb-3 mb-3 border-b">
  <h2 class="my-3 font-semibold text-xl">
    <span class="i-logos-youtube-icon text-125% -mb-1.25 view-transition-yt-icon" />
    My Videos</h2>
  <div class="grid sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
    <div class="sm:max-w-470px">
      <div class="bg-gray-200 rounded h-0 pb-56.25% relative">
        <div class="absolute inset-0 p-3 flex flex-col text-center justify-center h-full">
          <div class="mb-2 text-xl">
            {$page.data.t.shows.paste_youtube_url}
            {#if navigating}
              <span class="i-svg-spinners-3-dots-fade align--4px" />
            {/if}
          </div>
          <input placeholder={browser ? 'https://www.youtube.com/watch?v=...' : ''} on:input={handle_url} class="w-full sm:w-450px max-w-full p-2 border border-2 rounded" />
        </div>
      </div>
      <div class="text-sm my-1">{$page.data.t.home.youtube_description}</div>
    </div>
    {#each data.user_youtubes as youtube}
      <ShowThumbnail youtube={youtube.youtube} channel={youtube.channel} />
    {/each}
  </div>
</div>

{#if dev}
  <div data-testid="other-videos" class="sm:px-3">
    <h2 class=" my-3 font-semibold text-xl">Others are watching...</h2>
    <div class="grid sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
      {#each data.other_youtubes as youtube}
        <ShowThumbnail youtube={youtube.youtube} channel={youtube.channel} />
      {/each}
    </div>
  </div>
{/if}
