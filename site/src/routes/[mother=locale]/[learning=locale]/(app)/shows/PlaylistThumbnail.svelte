<script lang="ts">
  import { onMount } from 'svelte'

  export let youtube_id: string
  export let playlist_id: string
  export let playlist_title: string
  export let playlist_length: number

  $: href= `shows/playlists/${playlist_id}`

  let image_url = `https://i.ytimg.com/vi/${youtube_id}/sddefault.jpg`

  const MISSING_IMAGE_YOUTUBE_FILLER_IMAGE_WIDTH = 120
  onMount(() => {
    const img = new Image()
    img.src = image_url
    img.onload = () => {
      if (img.naturalWidth === MISSING_IMAGE_YOUTUBE_FILLER_IMAGE_WIDTH)
        image_url = `https://i.ytimg.com/vi/${youtube_id}/hqdefault.jpg`
    }
  })
</script>

<div class="w-85vw sm:w-350px shrink-0 mr-4 snap-start" data-sveltekit-preload-data="tap" data-sveltekit-preload-code="viewport">
  <a class="block mb-1 relative overflow-hidden h-0 pb-56.25% rounded" style="view-transition-name: yt-playlist-thumbnail-{youtube_id}" {href}>
    <img class="w-full absolute centered" src={image_url} alt={playlist_title} title={playlist_title} />
  </a>

  <div class="flex">
    <div class="block">
      <a class="line-clamp-2 font-semibold text-sm" {href} title={playlist_title}>
        {playlist_title} ({playlist_length} shows)
      </a>
    </div>
  </div>
</div>

<style>
  .centered {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
