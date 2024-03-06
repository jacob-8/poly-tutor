<script lang="ts">
  import { browser, dev } from '$app/environment'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import ShowThumbnail from './ShowThumbnail.svelte'
  import PlaylistThumbnail from './PlaylistThumbnail.svelte'
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

<div class="sm:px-3 pb-3 mb-3 border-b">
  <h2 class="my-3 font-semibold text-xl">
    {$page.data.t.shows.my_playlists}
  </h2>
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
          <input placeholder={browser ? 'https://www.youtube.com/playlist?list=...' : ''} on:input={handle_url} class="w-full sm:w-450px max-w-full p-2 border border-2 rounded" />
        </div>
      </div>
    </div>
    {#each data.user_playlists as { playlist }}
      {@const [youtube] = playlist.youtubes}
      {#if youtube}
        <PlaylistThumbnail youtube_id={youtube.id} playlist_title={playlist.title[0].text} playlist_id={playlist.id} playlist_length={playlist.youtubes.length} />
      {/if}
    {/each}
  </div>
</div>

<div data-testid="my-videos" class="sm:px-3 pb-3 mb-3 border-b">
  <h2 class="my-3 font-semibold text-xl">
    {$page.data.t.shows.my_videos}
  </h2>
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

{#if data.user_channels.length}
  <div class="sm:px-3 pb-3 mb-3 border-b">
    <h2 class="my-3 font-semibold text-xl">
      {$page.data.t.shows.my_channels}
    </h2>
    {#each data.user_channels as channel}
      <a href="shows/channels/{channel.id}" class="flex my-2 bg-gray-100 rounded hover:bg-gray-200 h-100px">
        <img class="w-100px h-100px" src="{channel.thumbnail_url}=s200-c-k-c0x00ffffff-no-rj" />
        <div class="p-2">
          <div class="font-semibold text-xl">
            {channel.title}
          </div>
          {#if channel.description}
            <div class="line-clamp-2">
              {channel.description}
            </div>
          {/if}
        </div>
      </a>
    {/each}
  </div>
{/if}

{#if dev}
  <div data-testid="other-videos" class="sm:px-3">
    <h2 class=" my-3 font-semibold text-xl">{$page.data.t.shows.others_are_watching}...</h2>
    <div class="grid sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
      {#each data.other_youtubes as youtube}
        <ShowThumbnail youtube={youtube.youtube} channel={youtube.channel} />
      {/each}
    </div>
  </div>
{/if}
