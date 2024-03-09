<script lang="ts">
  import type { YoutubePlaylistAddResponseBody } from '$api/youtube/playlist/add/+server.js'
  import { onMount } from 'svelte'
  import PlaylistShowThumbnail from './PlaylistShowThumbnail.svelte'
  import { browser } from '$app/environment'
  import { page } from '$app/stores'

  export let data
  $: ({ user } = data)
  let playlist: YoutubePlaylistAddResponseBody
  let adding_playlist_error: string

  onMount(async () => {
    const { data: _playlist, error } = await data.playlist_promise
    if (error)
      return adding_playlist_error = error.message
    playlist = _playlist
  })

  let checked_for_playlist = false
  $: if (browser && !checked_for_playlist && $user && playlist) {
    checked_for_playlist = true
    data.check_is_in_my_playlists()
  }
</script>

{#if playlist?.youtubes}
  <h1 class="text-lg font-semibold mb-3 px-3">
    <a target="_blank" href="https://www.youtube.com/playlist?list={playlist.id}">{playlist.title.map(sent => sent.text)}</a>
    ({playlist.youtubes.length} shows)</h1>

  <div class="sm:px-3 grid sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
    {#each playlist.youtubes as youtube}
      <PlaylistShowThumbnail youtube_id={youtube.id} youtube_title={youtube.title} channel_id={youtube.channel_id} channel_title={youtube.channel_title} />
    {/each}
  </div>
{:else if adding_playlist_error}
  <div class="text-red px-3">{$page.data.t.layout.error}: {adding_playlist_error}
    {#if !$user}
      - {$page.data.t.layout.sign_in}
    {/if}</div>
{:else}
  <div class="px-3">{$page.data.t.layout.loading}<span class="i-svg-spinners-3-dots-fade align--4px ml-1" /></div>
{/if}
