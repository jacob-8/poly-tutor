<script lang="ts">
  import { onMount } from 'svelte'

  export let youtube_id: string
  export let youtube_title: string
  export let channel_id: string
  export let channel_title: string

  $: href= `../${youtube_id}`

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

<div class="sm:max-w-470px" data-sveltekit-preload-data="tap" data-sveltekit-preload-code="viewport">
  <a class="block mb-1 relative overflow-hidden h-0 pb-56.25% sm:rounded" style="view-transition-name: yt-playlist-thumbnail-{youtube_id}" {href}>
    <img class="w-full absolute centered" src={image_url} alt={youtube_title} title={youtube_title} />
  </a>

  <div class="flex">
    <a href="../channels/{channel_id}" title={channel_title} class="w-8 h-8 mr-2 mt-3px shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
      <span class="font-bold text-lg">{channel_title.substring(0, 1)}</span>
    </a>
    <div class="block">
      <a class="line-clamp-2 font-semibold text-sm" {href} title={youtube_title}>
        {youtube_title}
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
