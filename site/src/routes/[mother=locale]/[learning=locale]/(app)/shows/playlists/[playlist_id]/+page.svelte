<script lang="ts">
  import type { YoutubePlaylistAddResponseBody } from '$api/youtube/playlist/add/+server.js'
  import { onMount } from 'svelte'
  import ShowThumbnail from './PlaylistShowThumbnail.svelte'

  export let data
  let playlist: YoutubePlaylistAddResponseBody

  onMount(async () => {
    const { data: _playlist, error } = await data.playlist_promise
    if (error)
      console.error(error)
    playlist = _playlist
  })
</script>


{#if playlist?.items}
  <div class="grid sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
    {#each playlist.items as item}
      <ShowThumbnail youtube_id={item.contentDetails.videoId} youtube_title={item.snippet.title} channel_id={item.snippet.channelId} channel_title={item.snippet.channelTitle} />
    {/each}
  </div>
{/if}
