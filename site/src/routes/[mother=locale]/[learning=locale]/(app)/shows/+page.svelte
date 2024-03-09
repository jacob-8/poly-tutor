<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import ShowThumbnail from './ShowThumbnail.svelte'
  import PlaylistThumbnail from './PlaylistThumbnail.svelte'
  import { get_youtube_video_id } from './get-youtube-video-id'
  import { get_youtube_playlist_id } from './get-youtube-playlist-id'

  export let data

  async function check_clipboard() {
    try {
      const clipboard_text = await navigator.clipboard.readText()
      check_clipboard_text_for_youtube_url(clipboard_text)
    } catch (error) {
      console.error(error)
      const pasted_text = prompt('Could not access your clipboard. Please paste the link here:')
      if (pasted_text)
        check_clipboard_text_for_youtube_url(pasted_text)
    }
  }

  function check_clipboard_text_for_youtube_url(text: string) {
    const youtube_id = get_youtube_video_id(text)
    if (youtube_id)
      return goto(`shows/${youtube_id}`)

    const playlist_id = get_youtube_playlist_id(text)
    if (playlist_id)
      return goto(`shows/playlists/${playlist_id}`)

    alert('Make you have copied a valid url for either a youtube video (youtube.com/watch?v=7PoQrTjEIi4) or a playlist (youtube.com/playlist?list=PLz_e7apcBzpsvG8o2PH0enszYSZZr6Kqg)')
  }
</script>

<div class="mx-3">
  {#if !(data.user_playlists.length || data.user_youtubes.length)}
    <div class="text-sm my-1">{$page.data.t.home.youtube_description}</div>
  {/if}
  <button type="button" on:click={check_clipboard} class="px-4 py-2 border rounded bg-gray-100 mr-2 text-lg">{$page.data.t.shows.paste_youtube_url}</button>
</div>

<div class="p-3">
  {#if data.user_playlists.length}
    <h2 class="mb-3 font-semibold text-xl">
      <span class="i-iconamoon-playlist-fill align--2px" />
      {$page.data.t.shows.my_playlists}
    </h2>
    <div class="flex overflow-x-auto snap-mandatory snap-x mb-3">
      {#each data.user_playlists as { playlist }}
        {@const [youtube] = playlist.youtubes}
        {#if youtube}
          <PlaylistThumbnail youtube_id={youtube.id} playlist_title={playlist.title[0].text} playlist_id={playlist.id} playlist_length={playlist.youtubes.length} />
        {/if}
      {/each}
    </div>
  {/if}

  {#if data.user_youtubes.length}
    <div data-testid="my-videos">
      <h2 class="mb-3 font-semibold text-xl">
        <span class="i-clarity-history-line align--2px" />
        {$page.data.t.shows.watch_history}
      </h2>
      <div class="flex overflow-x-auto snap-mandatory snap-x mb-3">
        {#each data.user_youtubes as youtube}
          <ShowThumbnail youtube={youtube.youtube} channel={youtube.channel} />
        {/each}
      </div>
    </div>
  {/if}

  {#if data.user_channels.length}
    <h2 class="mb-3 font-semibold text-xl">
      <span class="i-material-symbols-account-circle align--4px text-2xl" />
      {$page.data.t.shows.my_channels}
    </h2>
    <div class="mb-3 flex overflow-x-auto snap-mandatory snap-x">
      {#each data.user_channels as channel}
        <a href="shows/channels/{channel.id}" class="flex my-2 bg-gray-100 rounded overflow-hidden hover:bg-gray-200 h-100px w-85vw sm:w-350px shrink-0 mr-4 snap-start">
          <img class="w-100px h-100px mr-1" src="{channel.thumbnail_url}=s200-c-k-c0x00ffffff-no-rj" />
          <div class="p-1">
            <div class="font-semibold text-xl">
              {channel.title}
            </div>
            {#if channel.description}
              <div class="line-clamp-3 text-sm">
                {channel.description}
              </div>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  {/if}

  {#if data.public_playlists.length}
    <h2 class="mb-3 font-semibold text-xl">
      <span class="i-iconamoon-playlist-fill align--2px" />
      {$page.data.t.shows.public_playlists}
    </h2>
    <div class="flex overflow-x-auto snap-mandatory snap-x mb-3">
      {#each data.public_playlists as playlist}
        {@const [youtube] = playlist.youtubes}
        {#if youtube}
          <PlaylistThumbnail youtube_id={youtube.id} playlist_title={playlist.title[0].text} playlist_id={playlist.id} playlist_length={playlist.youtubes.length} />
        {/if}
      {/each}
    </div>
  {/if}
</div>

<!-- {#if dev}
  <div data-testid="other-videos" class="sm:px-3">
    <h2 class=" my-3 font-semibold text-xl">{$page.data.t.shows.others_are_watching}...</h2>
    <div class="grid sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
      {#each data.other_youtubes as youtube}
        <ShowThumbnail youtube={youtube.youtube} channel={youtube.channel} />
      {/each}
    </div>
  </div>
{/if} -->
