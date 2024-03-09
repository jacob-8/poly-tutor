<script lang="ts">
  import ShowThumbnail from '../../ShowThumbnail.svelte'

  export let data

  $: title = data.channel_youtubes[0]?.channel.title || ''
  $: channel_id = data.channel_youtubes[0]?.channel.id || ''
</script>

<div class="sm:px-3 pb-3 mb-3 border-b">
  <a class="mb-3 font-semibold text-xl inline-block hover:underline" href="https://www.youtube.com/channel/{channel_id}" target="_blank">
    {title} Channel Videos
  </a>
  <div class="grid sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
    {#each data.channel_youtubes as youtube}
      <ShowThumbnail youtube={youtube} channel={youtube.channel} href_prefix=".." />
    {/each}
  </div>
</div>
